const Youtube = require('simple-youtube-api')
const ytdl = require('ytdl-core')
const fs = require('fs')
const { ytkey } = require('../secret.json')
const youtube = new Youtube(ytkey)

/**
 * Recherche une video 
 * @param {Object} track 
 */
async function search (track) {
  let results = await youtube.searchVideos(`${track.name} ${track.artist}`, 5)
  for (let result of results) {
    let id = result.id
    let video = await youtube.getVideoByID(id)
    let duration = video.duration.hours * 3600 + video.duration.minutes * 60 + video.duration.seconds
    if (track.duration - 30 < duration && track.duration + 30 > duration) return video.id
  }

  return false
}

// AfeAhCWaMD0
async function download (videoid, dlpath) {
  return new Promise((resolve) => {
    ytdl(videoid, { filter: (format) => format.container === 'mp4' })
      .pipe(fs.createWriteStream(dlpath))
      .on('close', resolve)
  })
}

async function convert (path, name) {
  let input = `${path}${name}.mp4`
  let output = `${path}${name}.mp3`
}

async function downloadTracks (tracks) {
  for(let track of tracks) {
    let videoid = await search(track)
    if (!videoid) continue
    let dlpath = `./download/${track.name}.mp4`
    try {
      await download(videoid, dlpath)
      await convert('./download/', track.name)
      console.log(`${track.name} - downloaded`)
    } catch (e) {
      console.error(e)
      console.log(`${track.name} - error`)
    }
  }
  return 'q+'
}

module.exports = {
  search,
  download,
  downloadTracks,
  convert
}