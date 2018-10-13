function trimBufferToString (buffer) {
  let iEnd = 0
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0) {
      iEnd = i
      break
    }
  }
  return buffer.toString('utf8', 0, iEnd)
}

module.exports = {
  trimBufferToString
}
