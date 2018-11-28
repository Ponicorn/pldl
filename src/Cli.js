/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const chalk = require('chalk')
const figlet  = require('figlet')
const prompts  = require('prompts')
const spotify = require('./Spotify')

async function app () {
  init()
  let result

  result = await askUsername()
  let playlists = await spotify.fetchPlaylists(result.username)
  if (!playlists || playlists.length == 0) return console.log('Oops ! Pas de playlist a l\'horizon !')

  result = await askPlaylist(playlists)
  let songs = await spotify.fetchPlaylistItems(result.playlists)
  if (!songs || songs.length == 0) return console.log('Oops ! ça va pas le faire on dirait...')

  // TODO: Ici on a la playlist a dl, on doit 'juste' dl pour chaque morceau desormais.
  // Rappel: pour dl,
  //      1) trouver le morceau sur yt (nom/artist/temps)
  //      2) telecharger le morceau si ok
  //      3) convertir au bon format si besoin
  //      4) ???
  //      5) profit
  songs.forEach(s => {
    console.log(`${s.name} - ${s.artist}`)
  })
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
    name: 'playlists',
    message: 'Choose a playlist: ',
    choices: pls
  })
}

module.exports = app