// const spotify = require('./src/Spotify')
const app = require('./src/Cli')
const yt = require('./src/Youtube')


async function ohboi () {
  let result = await yt.convert('./download/', 'test')
  console.log(result)
}

app()
// ohboi()