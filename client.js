import fullscream from 'fullscream'
import createPager from 'picknick'

import { bypassEvent, pseudoFlash, convertBlobToDataURL, websocketAddressFrom } from './helper'

const $html = document.documentElement
const $image = document.getElementById('image')

$image.addEventListener('load', () => {
  // Hide spinner
  $html.classList.remove('is-loading')
})

const store = { uploads: [], mass: 0 }

// For browsing through the image queue
const pager = createPager((i) => {
  const src = store.uploads[i]

  if (src && $image.src.indexOf(src) < 0) {
    // Show spinner
    $html.classList.add('is-loading')

    // Replace image, trigger image load
    $image.setAttribute('src', src)
  }
})

const $figure = document.getElementById('figure')

$figure.addEventListener('click', () => {
  pager.prev()
})

const $zoom = document.getElementById('zoom')

$zoom.removeAttribute('hidden')
$zoom.addEventListener('click', (e) => {
  bypassEvent(e)
  fullscream($figure)
})

const { createObjectURL } = window.URL || window.webkitURL
const flash = pseudoFlash($html)
const $poll = document.getElementById('poll')

const io = new WebSocket(`${websocketAddressFrom('http://localhost:8012')}/io`)

const isQueueEmpty = store.uploads.length === 0
const maxUploadSize = 2 * 1024 * 1024

io.addEventListener('message', ({ data }) => {
  const { error, mass, uploads } = JSON.parse(data)

  if (error) {
    flash('alert', error)
  }

  if (mass !== undefined && mass !== store.mass) {
    store.mass = mass
    $poll.textContent = `${mass}`
  }

  if (uploads) {
    store.uploads = uploads
    pager.total(uploads.length)
  }

  if (isQueueEmpty) {
    pager.pick()
  }
})

io.addEventListener('open', () => {
  $html.classList.remove('is-waiting')
})

io.addEventListener('error', () => {
  flash('alert', 'Trouble connecting')
})

document.addEventListener('drop', (e) => {
  bypassEvent(e)

  if (io.readyState !== 1) {
    flash('alert', 'Disconnected!')

    return
  }

  try {
    // Reach for the first file in queue
    const [file] = e.dataTransfer.files

    if (file.type.indexOf('image') < 0) {
      flash('alert', 'File type invalid')

      return
    }

    if (file.size > maxUploadSize) {
      flash('alert', 'File too big')

      return
    }

    const previewImageSource = createObjectURL(file)
    const currentPagerIndex = pager.nick()

    store.uploads.splice(currentPagerIndex, 0, previewImageSource)

    pager.total(store.uploads.length)
    pager.pick()

    convertBlobToDataURL(file).then((dataURL) => {
      const message = JSON.stringify({ target: dataURL, offset: currentPagerIndex })

      io.send(message, { mask: true })
    }).catch((x) => {
      flash('alert', `Upload failed - ${x.message}`)
    })
  } catch (x) {
    flash('alert', 'Could not process file')
  }
})

document.addEventListener('dragover', bypassEvent)
document.addEventListener('dragenter', (e) => {
  bypassEvent(e)
  flash()
})

document.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
  // Spacebar
  case 32:
    bypassEvent(e)
    pager.prev()
    break
  // Arrow left
  case 37:
    bypassEvent(e)
    pager.next()
    break
  // Arrow right
  case 39:
    bypassEvent(e)
    pager.prev()
    break
  default:
    break
  }
})

// Has the page been loaded inside of an iframe?
if (window !== window.top) {
  $html.classList.add('is-planted')
}

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(console.log)
  }

  $html.classList.remove('is-waiting')
})
