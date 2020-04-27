export const stringContains = (str = '', ...terms) => RegExp(terms.join('|')).test(str)

export const resolveLocalAddress = (url = '') => {
  const { origin } = location

  return stringContains(origin, 'local', 'test') ? url : origin
}

export const websocketAddressFrom = (url = '') => resolveLocalAddress(url).replace(/^http/, 'ws')

export const bypassEvent = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

export const pseudoFlash = (node = document.documentElement) => (type = 'flash', text) => {
  const className = `do-${type}`

  if (text) {
    node.setAttribute('data-text', text.toString())
  }

  node.classList.add(className)

  return setTimeout(() => {
    node.removeAttribute('data-text')
    node.classList.remove(className)
  }, 2000)
}

export const convertBlobToDataURL = blob => new Promise((resolve, reject) => {
  const reader = new FileReader()

  reader.addEventListener('error', reject)
  reader.addEventListener('load', () => {
    // This is a base64 encoded `.png`
    const { result } = reader

    resolve(result)
  })

  reader.readAsDataURL(blob)
})
