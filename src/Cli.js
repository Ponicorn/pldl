/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const chalk = require('chalk')
const figlet  = require('figlet')
const prompts  = require('prompts')

async function app () {
  init()
  let username = await askUsername()
  console.log(username)
  askPlaylist()
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

function askPlaylist () {

}

module.exports = app