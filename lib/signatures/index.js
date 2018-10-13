'use strict'

const ffi = require('ffi')
const ref = require('ref')
const fs = require('fs')
const path = require('path')
const {parseDeclare} = require('./parser')
const {trimBufferToString} = require('../utils')

let allSigs = {}
let apiList = []

function mapRef (ty) {
  if (ty.type === 'VOID') return ref.types.void
  if (ty.type === 'UNSIGNED VOID') return ref.types.void
  if (ty.type === 'CHAR') return ref.types.char
  if (ty.type === 'UNSIGNED CHAR') return ref.types.uchar
  if (ty.type === 'SHORT') return ref.types.short
  if (ty.type === 'UNSIGNED SHORT') return ref.types.ushort
  if (ty.type === 'INT') return ref.types.int
  if (ty.type === 'UNSIGNED INT') return ref.types.uint
  if (ty.type === 'LONG') return ref.types.long
  if (ty.type === 'UNSIGNED LONG') return ref.types.ulong
  if (ty.type === 'LONGLONG') return ref.types.longlong
  if (ty.type === 'UNSIGNED LONGLONG') return ref.types.ulonglong
  if (ty.type === 'FLOAT') return ref.types.float
  if (ty.type === 'DOUBLE') return ref.types.double

  if (ty.type === 'POINTER' || ty.type === 'ARRAY') {
    if (ty.base.type === 'CHAR' && ty.base.cons) {
      return ref.types.CString
    }
    if (ty.base.type === 'POINTER' || ty.base.type === 'ARRAY') {
      return ref.refType(ref.types.void)
    } else {
      return ref.refType(mapRef(ty.base))
    }
  }
}

function mapFFI (ty) {
  return [mapRef(ty), ty.params.map(t => mapRef(t))]
}

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js' && file !== 'parser.js') {
    const sigs = require(path.join(__dirname, file))
    for (let name in sigs) {
      const {signature, outputs, ignore, sync, validate} = sigs[name]

      let ty
      try {
        ty = parseDeclare(signature)
      } catch (e) {
        throw Error(`Parsing '${name}', ${e.message}`)
      }

      const funcname = ty.id || name

      allSigs[funcname] = mapFFI(ty)
      apiList.push({
        name,
        realName: funcname,
        ty,
        outputs,
        ignore,
        sync, 
        validate
      })
    }
  }
})

class Qlib {
  constructor (pathname) {
    if (!pathname) {
      pathname = 'QMSL_MSVC10R.dll'
    }
    this._ffi = ffi.Library(pathname, allSigs)
  }

  async validateCall (name, ...args) {
    const r = await this[name](...args)
    if (!r) {
      throw new Error(name + ' fail')
    }
  }
}

for (const api of apiList) {
  if (api.ignore) {
    continue
  }

  const outputProtos = []
  let constructOutParams
  let constructOutput

  if (api.outputs) {
    for (let i = api.ty.params.length - 1; i >= 0; i--) {
      const t = api.ty.params[i]
      if (t.type === 'POINTER') {
        if (t.base.type === 'POINTER' || t.base.type === 'ARRAY') {
          outputProtos.push({type: 'buffer', size: 1024})
        } else {
          outputProtos.push(mapRef(t.base))
        }
      } else if (t.type === 'ARRAY') {
        const size = t.dim || 1024
        if (t.base.type === 'CHAR') {
          outputProtos.push({type: 'string', size})
        } else {
          outputProtos.push({type: 'buffer', size})
        }
      } else {
        throw Error(`${api.name}: mismatched outoutps type`)
      }

      if (outputProtos.length >= api.outputs) break
    }

    if (outputProtos.length !== api.outputs) throw Error(`${api.name}: mismatched outoutps count`)

    constructOutParams = () => outputProtos.map(t => {
      if (t.type === 'buffer' || t.type === 'string') return Buffer.alloc(t.size)
      else return ref.alloc(t, 0)
    })

    constructOutput = (callRet, outParams) => {
      let rets = []

      if (api.ty.type === 'VOID' || api.validate) {
        // no need return this
      } else {
        rets.push(callRet)
      }

      const outs = outParams.map((o, i) => {
        if (outputProtos[i].type === 'string') {
          return trimBufferToString(o)
        } else if (outputProtos[i].type === 'buffer') {
          return o
        } else {
          return o.deref()
        }
      })

      rets = rets.concat(outs)

      if (rets.length === 1) {
        return rets[0]
      } else {
        return rets
      }
    }
  }

  if (api.sync) {
    if (outputProtos.length > 0) {
      Qlib.prototype[api.name] = function (...args) {
        const outPtrs = constructOutParams()
        const ret = this._ffi[api.realName](...args, ...outPtrs)
        return constructOutput(ret, outPtrs)
      }
    } else {
      Qlib.prototype[api.name] = function (...args) {
        return this._ffi[api.realName](...args)
      }
    }
  } else {
    const asyncFunc0 = function (...args) {
      return new Promise((resolve, reject) => {
        this._ffi[api.realName].async(...args, (err, res) => {
          if (err) {
            resolve(false)
          } else {
            resolve(res)
          }
        })
      })
    }

    let asyncFunc1 = asyncFunc0

    if (api.validate) {
      asyncFunc1 = async function (...args) {
        const r = await asyncFunc0.apply(this, args)
        if (!r) {
          throw new Error(api.realName + ' fail')
        }
      }
    }

    let asyncFunc2 = asyncFunc1

    if (outputProtos.length > 0) {
      asyncFunc2 = async function (...args) {
        const outPtrs = constructOutParams()
        const ret = await asyncFunc1.call(this, ...args, ...outPtrs)
        return constructOutput(ret, outPtrs)
      }
    }

    Qlib.prototype[api.name] = asyncFunc2
  }
}

module.exports = Qlib
