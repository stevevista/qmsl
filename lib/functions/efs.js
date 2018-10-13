const path = require('path')
const ref = require('ref')
const ffi = require('ffi')
const Qlib = require('../signatures')
const { EventEmitter } = require('events')

function EfsDirCB (callback) {
  return ffi.Callback('byte', [ 'string', 'byte', 'ushort', 'byte', 'byte', 'ulong', 'ulong', 'uint' ],
    (name, isFile, iAttributeMask, iBufferingOption, iCleanupOption, iCreateDate, iFileSize, hContextID) => {
      return callback(name, isFile, iAttributeMask, iCreateDate, iFileSize)
    })
}

function EfsFileTransferCB (callback) {
  return ffi.Callback('byte', [ 'string', 'string', 'int', 'int', 'ulong', 'ulong', 'uint' ], (srcname, dstname, oper, suboper, bytestransferred, filesize, hContextID) => {
    return callback(srcname, dstname, bytestransferred)
  })
}

Qlib.prototype.efsReadDir = async function (hResourceContext, sFolderPath) {
  // remove trailing /
  const regpath = sFolderPath.replace(new RegExp('[/]*$'), '')

  let items = []

  const callback = (name, isFile, attrs, iCreateDate, size) => {
    let type = isFile ? 'file' : 'dir'
    items.push({
      name: path.basename(name),
      mode: attrs,
      path: name,
      isLink: false,
      isDir: !isFile,
      size,
      mtime: new Date(iCreateDate),
      type
    })
  }

  const callbackDir = EfsDirCB(callback)
  this._ffi.QLIB_ConfigureEfs2CallBacks(hResourceContext, null, callbackDir)

  await this.validateCall('efsDirectory', hResourceContext, regpath)

  return items
}

class EfsReadStream extends EventEmitter {
  constructor (Q, comName, sFilePath) {
    super()
    this.init(Q, comName, sFilePath)
  }

  async init (Q, comName, sFilePath) {
    Q.connectionContext(comName, async h => {
      let stat = await Q.efsStat(h, sFilePath)

      let dataBufferSize = ref.alloc('ulong', stat.size)
      let dataBuffer = Buffer.alloc(stat.size)

      Q._ffi.QLIB_ConfigureEfs2CallBacks(h, EfsFileTransferCB((name, dstname, bytestransferred) => {
        this.emit('progress', bytestransferred)
      }), null)

      await Q.validateCall('efsReadMem', h, dataBuffer, dataBufferSize, sFilePath)
      this.emit('data', dataBuffer)
      process.nextTick(() => { this.emit('end') })
    })
      .catch(err => { this.emit('error', err) })
  }
}

Qlib.prototype.createReadStream = function (comName, sFilePath) {
  return new EfsReadStream(this, comName, sFilePath)
}

Qlib.prototype.efsRead = async function (hResourceContext, sFilePath) {
  let stat = await this.efsStat(hResourceContext, sFilePath)

  let dataBufferSize = ref.alloc('ulong', stat.size)
  let dataBuffer = Buffer.alloc(stat.size)

  await this.validateCall('efsReadMem', hResourceContext, dataBuffer, dataBufferSize, sFilePath)
  return dataBuffer
}

Qlib.prototype.efsStat = async function (hResourceContext, sFilePath) {
  let piErrorNo = ref.alloc('ulong', 0)
  let piMode = ref.alloc('ulong', 0)
  let piSize = ref.alloc('ulong', 0)
  let piNlink = ref.alloc('ulong', 0)
  let piAtime = ref.alloc('ulong', 0)
  let piMtime = ref.alloc('ulong', 0)
  let piCtime = ref.alloc('ulong', 0)

  await this.validateCall('EFS2_DIAG_STAT', hResourceContext, sFilePath, piErrorNo, piMode, piSize, piNlink, piAtime, piMtime, piCtime)
  return {
    mode: piMode.deref(),
    size: piSize.deref(),
    mtime: piMtime.deref()
  }
}

Qlib.prototype.efsWrite = function (hResourceContext, dataBuffer, sFilePath) {
  return this.efsWriteMem(hResourceContext, dataBuffer, dataBuffer.length, sFilePath)
}
