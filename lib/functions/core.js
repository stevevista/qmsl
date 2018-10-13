const Qlib = require('../signatures')
const ref = require('ref')
const { trimBufferToString } = require('../utils')

Qlib.prototype.getLibraryCapabilities = function () {
  let pbSupportsDiag = ref.alloc('uchar', 0)
  let pbSupportsEFS = ref.alloc('uchar', 0)
  let pbSupportsSwDownload = ref.alloc('uchar', 0)
  let pbUsingQPST = ref.alloc('uchar', 0)
  this._ffi.QLIB_GetLibraryCapabilities(pbSupportsDiag, pbSupportsEFS, pbSupportsSwDownload, pbUsingQPST)
  return {
    diag: pbSupportsDiag.deref() === 1,
    EFS: pbSupportsEFS.deref() === 1,
    SwDownload: pbSupportsSwDownload.deref() === 1,
    QPST: pbUsingQPST.deref() === 1
  }
}

// connection manager
Qlib.prototype.parseComPort = (comName) => parseInt(comName.slice(3))

Qlib.prototype.connect = async function (portNumber, iTimeout) {
  if (!this.getLibraryCapabilities().QPST) {
    await this.terminateQPSTServer()
  }

  if (typeof iTimeout === 'number') {
    const handle = await this.connectServerWithWait(portNumber, iTimeout)
    return handle
  } else {
    const handle = await this.connectServer(portNumber)
    return handle
  }
}

Qlib.prototype.connectionContext = function (comName, params, body) {
  let callback
  let options = {}

  if (typeof params === 'function') {
    callback = params
  } else {
    options = params || {}
    callback = body
  }

  const portNum = this.parseComPort(comName)
  return this.connect(portNum, options.wait)
    .then((h) => {
      return callback(h)['finally'](async () => {
        this.disconnect(h)
      })
    })
}

Qlib.prototype.phoneConnectedContext = function (comName, params, body) {
  let callback
  let options = {}

  if (typeof params === 'function') {
    callback = params
  } else {
    options = params || {}
    callback = body
  }

  return this.connectionContext(comName, options, (h) => {
    const connected = this.isPhoneConnected(h)
    return callback(connected, h)
  })
}

Qlib.prototype.send = async function (hResourceContext, requestBytes, iTimeout) {
  let responseSize = ref.alloc('short', 4096)
  let responseBytes = Buffer.alloc(4096)
  await this.validateCall('sendSync', hResourceContext, requestBytes.length, requestBytes, responseSize, responseBytes, iTimeout)
  return responseBytes.slice(0, responseSize.deref())
}

Qlib.prototype.sendRaw = async function (hResourceContext, requestBytes, iTimeout) {
  let responseSize = ref.alloc('short', 4096)
  let responseBytes = Buffer.alloc(4096)
  await this.validateCall('sendRAW', hResourceContext, requestBytes.length, requestBytes, responseSize, responseBytes, iTimeout)
  return responseBytes.slice(0, responseSize.deref())
}

Qlib.prototype.sendAT = function (hResourceContext, requestStr, iTimeout) {
  let requestBytes = Buffer.alloc(requestStr.length + 2)
  let i = 0
  for (let c of requestStr) {
    requestBytes[i++] = c
  }
  requestBytes[i++] = '\r'
  requestBytes[i] = 0
  return this.sendRaw(hResourceContext, requestBytes, iTimeout)
}
