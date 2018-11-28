// const spotify = require('./src/Spotify')
const app = require('./src/Cli')
const yt = require('./src/Youtube')


async function ohboi () {
  try {
    let result = await yt.convert('./download/', {name:'the animal', artist:'Steve Vai', album: 'long du zboob'})
    console.log(result)
  } catch(e) {
    console.error(e)
  }
}

app()
// ohboi()