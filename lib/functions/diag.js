const Qlib = require('../signatures')
const ref = require('ref')
const { trimBufferToString } = require('../utils')

Qlib.prototype.diagVersion = async function (hResourceContext) {
  let compdate = Buffer.alloc(11)
  let comptime = Buffer.alloc(8)
  let reldate = Buffer.alloc(11)
  let reltime = Buffer.alloc(8)
  let verdir = Buffer.alloc(8)
  let scm = ref.alloc('byte')
  let mobcairev = ref.alloc('byte')
  let mobmodel = ref.alloc('byte')
  let mobfirmrev = ref.alloc('ushort')
  let slotcycleindex = ref.alloc('byte')
  let vocmaj = ref.alloc('byte')
  let vocmin = ref.alloc('byte')

  await this.DIAG_VERNO_F(hResourceContext, compdate, comptime, reldate, reltime, verdir,
    scm, mobcairev, mobmodel, mobfirmrev, slotcycleindex, vocmaj, vocmin)

  let verObj = {
    'comp_date': compdate.toString(),
    'comp_time': comptime.toString(),
    'rel_date': reldate.toString(),
    'rel_time': reltime.toString(),
    'ver_dir': verdir.toString(),
    'scm': scm.deref(),
    'mob_cai_rev': mobcairev.deref(),
    'mob_model': mobmodel.deref(),
    'mob_firm_rev': mobfirmrev.deref(),
    'slot_cycle_index': slotcycleindex.deref(),
    'voc_maj': vocmaj.deref(),
    'voc_min': vocmin.deref()
  }

  let piMSMHWVersion = ref.alloc('ulong')
  let piMobModel = ref.alloc('ulong')
  let sMobSwRev = Buffer.alloc(512)
  let sModelStr = Buffer.alloc(512)

  const ret = await this.DIAG_EXT_BUILD_ID_F(hResourceContext, piMSMHWVersion, piMobModel, sMobSwRev, sModelStr)
  if (ret) {
    verObj.hwVersion = piMSMHWVersion.deref()
    verObj.mobModel = piMobModel.deref()
    verObj.reversion = trimBufferToString(sMobSwRev)
    verObj.model = trimBufferToString(sModelStr)
  }

  return verObj
}

Qlib.prototype.NvReadF = async function (hResourceContext, iItemID, iLength) {
  let buffer = Buffer.alloc(iLength)
  let iStatus = ref.alloc('ushort', 0)
  await this.validateCall('DIAG_NV_READ_F', hResourceContext, iItemID, buffer, iLength, iStatus)
  return [iStatus.deref(), buffer]
}

Qlib.prototype.NvReadExt = async function (hResourceContext, iItemID, iLength, iContextID) {
  let buffer = Buffer.alloc(iLength)
  let iStatus = ref.alloc('ushort', 0)
  await this.validateCall('DIAG_NV_READ_EXT_F', hResourceContext, iItemID, buffer, iContextID, iLength, iStatus)
  return [iStatus.deref(), buffer]
}

Qlib.prototype.NvReadArray = async function (hResourceContext, iItemID, iArrayIndex, iLength) {
  let buffer = Buffer.alloc(iLength)
  let iStatus = ref.alloc('ushort', 0)
  await this.validateCall('DIAG_NV_READ_ARRAY_F', hResourceContext, iItemID, iArrayIndex, buffer, iLength, iStatus)
  return [iStatus.deref(), buffer]
}

Qlib.prototype.NvRead = function (hResourceContext, iItemID, iLength, iContextID) {
  if (iItemID instanceof Array) {
    return this.NvReadArray(hResourceContext, iItemID[0], iItemID[1], iLength)
  } else if (iContextID === undefined) {
    return this.NvReadF(hResourceContext, iItemID, iLength)
  } else {
    return this.NvReadExt(hResourceContext, iItemID, iLength, iContextID)
  }
}

Qlib.prototype.NvWriteF = async function (hResourceContext, iItemID, buffer) {
  let iStatus = ref.alloc('ushort', 0)
  await this.validateCall('DIAG_NV_WRITE_F', hResourceContext, iItemID, buffer, buffer.length, iStatus)
  return iStatus.deref()
}

Qlib.prototype.NvWriteExt = async function (hResourceContext, iItemID, buffer, iContextID) {
  let iStatus = ref.alloc('ushort', 0)
  await this.validateCall('DIAG_NV_WRITE_EXT_F', hResourceContext, iItemID, buffer, iContextID, buffer.length, iStatus)
  return iStatus.deref()
}

Qlib.prototype.NvWriteArray = async function (hResourceContext, iItemID, iArrayIndex, buffer) {
  let iStatus = ref.alloc('ushort', 0)
  await this.validateCall('DIAG_NV_WRITE_ARRAY_F', hResourceContext, iItemID, iArrayIndex, buffer, buffer.length, iStatus)
  return iStatus.deref()
}

Qlib.prototype.NvWrite = function (hResourceContext, iItemID, buffer, iContextID) {
  if (iItemID instanceof Array) {
    return this.NvWriteArray(hResourceContext, iItemID[0], iItemID[1], buffer)
  } else if (iContextID === undefined) {
    return this.NvWriteF(hResourceContext, iItemID, buffer)
  } else {
    return this.NvWriteExt(hResourceContext, iItemID, buffer, iContextID)
  }
}

Qlib.prototype.diagSpc = async function (hResourceContext, iSPC) {
  const piSPCResult = ref.alloc('uchar', 0)
  let spc = Buffer.alloc(6)
  for (let i = 0; i < spc.length; i++) spc[i] = iSPC[i]
  await this.validateCall('QLIB_DIAG_SPC_F', hResourceContext, spc, piSPCResult)
  return piSPCResult.deref()
}

Qlib.prototype.waitForDiagEvent = async function (hResourceContext, iEventID, iTimeOut_ms) {
  let event = Buffer.alloc(1024)
  const r = await this.DIAG_WaitForEvent(hResourceContext, iEventID, event, iTimeOut_ms)
  return r
}
