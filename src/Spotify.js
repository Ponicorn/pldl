const rp = require('request-promise-native')
const {clientId, clientSecret} = require('../secret.json')

/**
 * Recupère les playlists d'un utilisateur
 * @param {string} user 
 */
async function fetchPlaylists (username) {
  let playlists = []

  try {
    playlists = await spotifyRequest(`https://api.spotify.com/v1/users/${username}/playlists`)
  } catch (e) {
    console.error(e)
    return false
  }

  return playlists
}

async function fetchPlaylistItems (playlistId) {
  let items = []

  try {
    items = await spotifyRequest(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`)
  } catch (e) {
    console.error(e)
    return false
  }

  return items
}

/**
 * Fait les requêtes vers spotify
 */
async function spotifyRequest (url, method = 'GET') {
  let options = { 
    method, 
    url, 
    json: true,
  }

  let optionsAuth = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` },
    form: { grant_type: 'client_credentials' },
    json: true
  }

  let bodyAuth = await rp(optionsAuth)
  options.headers = { 'Authorization': `Bearer ${bodyAuth.access_token}` }
  let bodyItems = await rp(options)
  return bodyItems.items || bodyItems
}


module.exports = {
  fetchPlaylists,
  fetchPlaylistItems
}