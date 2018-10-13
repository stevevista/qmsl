const Qlib = require('../signatures')
const ref = require('ref')
const ffi = require('ffi')

function swdlQPHONEMSCB (callback) {
  return ffi.Callback('void', [ 'uint', 'string', 'ushort' ], (handle, msg, msgsize) => {
    callback(handle, msg)
  })
}

Qlib.prototype.createSWDLCallback = (callback) => swdlQPHONEMSCB(callback)

Qlib.prototype.connectSahara = async function (iComPort, bGetInfo, timeout, callback) {
  let version = ref.alloc('ulong', 0)
  let serno = ref.alloc('ulong', 0)
  let msmid = ref.alloc('ulong', 0)
  let pkhash = Buffer.alloc(256)

  // Callback from the native lib back into js
  let mode = 0
  if (callback) {
    mode = 2
  }

  const handle = await this.connectServerSahara(iComPort, version, serno, msmid, pkhash, bGetInfo, mode, timeout, callback)
  if (handle === 0) {
    throw new Error('QConnectServerSahara fail')
  }
  return [handle, version.deref(), serno.deref(), msmid.deref(), pkhash]
}

Qlib.prototype.connectFireHose = async function (iComPort, waittime, callback) {
  if (waittime) {
    await setTimeout(() => {}, waittime)
  }

  const handle = await this.connectServerFireHose(iComPort, callback)
  if (handle === 0) {
    throw new Error('ConnectServerFireHose fail')
  }

  return handle
}
