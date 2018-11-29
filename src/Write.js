function rewriteLine (msg, nextline = false) {
  process.stdout.clearLine()  
  process.stdout.cursorTo(0)
  process.stdout.write(msg)
  if (nextline) process.stdout.write('\n')
}

module.exports = rewriteLine