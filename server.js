'use strict'

const { Server } = require('ws')
const path = require('path')
const fs = require('fs')
const uploader = require('@thewhodidthis/upload')

const { CLIENT_ID, CONFIG = './config.json', PORT = 8012, npm_package_config_port = PORT, MAX = 50 } = process.env
const { parse, stringify } = JSON

const configPath = path.resolve(__dirname, CONFIG)
const config = require(configPath)
const { uploads = [], clientId = CLIENT_ID } = config

const maxUploadSize = 2 * 1024 * 1024
const upload = uploader(clientId)

const io = new Server({ port: npm_package_config_port, path: '/io' })
const broadcast = data => io.clients.forEach(client => client.send(stringify(data)))

io.on('connection', (socket) => {
  const raiseErrorClientSide = (error = '') => {
    socket.send(stringify({ error }))
  }

  // `io.clients` is a `Set`
  const mass = io.clients.size

  socket
    .on('error', console.error)
    .on('message', (message) => {
      const { target, offset } = parse(message)

      // Get file size, this is approximate, doesn't matter
      // From: https://en.wikipedia.org/wiki/Base64
      const targetSize = (target.length - 814) / 1.37

      if (targetSize <= 0) {
        raiseErrorClientSide('Input empty')

        return
      }

      if (targetSize > maxUploadSize) {
        raiseErrorClientSide('File too big')

        return
      }

      const [, base64String] = target.split(',')

      // Send to imgur
      upload(base64String, (error, body) => {
        if (error) {
          raiseErrorClientSide(error.message)
        } else {
          const { data } = parse(body)
          const { link } = data

          if (link) {
            // Drop protocol from image URL
            const [, item] = link.split(':')

            // Edit point
            const start = parseInt(offset, 10) || 0

            // Start deleting if total uploads over queue max
            const deleteCount = uploads.length > MAX ? 1 : 0

            // Edit in place
            uploads.splice(start, deleteCount, item)

            // Let clients know
            broadcast({ uploads })

            // A cheap way of saving image URLs for recovery if need be
            try {
              fs.writeFileSync(configPath, stringify({ ...config, uploads }, null, 2))
            } catch (e) {
              console.error(e)
            }
          }
        }
      })
    })
    .on('close', () => {
      broadcast({ mass })
    })

  broadcast({ mass, uploads })
})
