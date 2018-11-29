const Youtube = require('simple-youtube-api')
const ytdl = require('ytdl-core')
const fs = require('fs')
const rw = require('./Write')
const ffmpeg = require('fluent-ffmpeg')
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

async function convert (path, track) {
  let input = `${path}${track.namefile}.mp4`
  let output = `${path}${track.namefile}.mp3`
  
  if (fs.existsSync(output)) fs.unlinkSync(output)
  
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        '-vn',
        '-ar', 44100,
        '-ac', 2,
        '-ab', 192,
        '-f', 'mp3'
      ])
      .on('error', reject)
      .on('end', resolve)
      .save(output)
  })
}

async function downloadTracks (downloadpath, tracks) {
  for(let track of tracks) {
    let videoid = await search(track)
    if (!videoid) continue
    let dlpath = `${downloadpath}${track.namefile}.mp4`
    try {
      rw(`${track.name} : downloading...`)
      await download(videoid, dlpath)
      rw(`${track.name} : converting to mp3...`)
      await convert(downloadpath, track)
      rw(`${track.name} : downloaded !`, true)
      fs.unlinkSync(`${downloadpath}${track.namefile}.mp4`)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = {
  search,
  download,
  downloadTracks,
  convert
}