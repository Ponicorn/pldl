const fs =  require('fs')
const ffmetadata = require('ffmetadata')

async function write(path, track) {
  return new Promise((resolve, reject) => {
    let file = `${path}/${track.namefile}.mp3`
    if (!fs.existsSync(file)) resolve

    let data = {
      artist: track.artist,
      album: track.album,
      title: track.name
    }

    let options = {
      // attachments: [track.image]
    }

    ffmetadata.write(file, data, options, (err) => {
      if (err) reject(err)
      resolve()
    })

  })
}

async function writeAll(path, tracks) {
  for(let track of tracks) {
    await write(path,track)
  }
}

module.exports = {
  writeAll
}