/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const chalk = require('chalk')
const figlet  = require('figlet')
const prompts  = require('prompts')
const spotify = require('./Spotify')
const yt = require('./Youtube')

async function app () {
  init()
  let result

  // Ask user name and fetch playlist
  result = await askUsername()
  let playlists = await spotify.fetchPlaylists(result.username)
  if (!playlists || playlists.length == 0) return console.log('Oops ! Pas de playlist a l\'horizon !')

  result = await askPlaylist(playlists)
  let playlist = result.playlist
  let tracks = await spotify.fetchPlaylistItems(playlist)
  let end = await yt.downloadTracks(tracks)

  console.log(end)
}

function init () {
  console.log(
    chalk.cyan(
      figlet.textSync('PL/DL', {
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  )
}

function askUsername () {
  return prompts({
    type: 'text',
    name: 'username',
    message: 'Spotify user ?'
  })
}

function askPlaylist (playlists) {
  let pls = playlists.map(pl => { 
    return {
      title: pl.name, 
      value: pl.id 
    }
  })
  return prompts({
    type: 'select',
    name: 'playlist',
    message: 'Choose a playlist: ',
    choices: pls
  })
}

async function showTracks (playlist) {
  let songs = await spotify.fetchPlaylistItems(playlist)
  if (!songs || songs.length == 0) return console.log('Oops ! ça va pas le faire on dirait...')
  songs.forEach(s => {
    console.log(s)
  })
}

module.exports = app