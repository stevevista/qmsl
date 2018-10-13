module.exports = {
  getPhoneOperatingMode: {
    signature: 'byte QLIB_GetPhoneOperatingMode(HANDLE, unsigned long* piPhoneMode)',
    outputs: 1,
    validate: true
  },
  getPhoneCallState: {
    signature: 'byte QLIB_GetPhoneCallState(HANDLE, unsigned long* piCallState, unsigned long* piSystemMode)',
    outputs: 2,
    validate: true
  },
  getPhoneCallStateV2: {
    signature: 'byte QLIB_GetPhoneCallState_V2(HANDLE, unsigned long* piCallState, unsigned long* piSystemMode)',
    outputs: 2,
    validate: true
  },
  getPhoneCallStateV3: {
    signature: 'byte QLIB_GetPhoneCallState_V3(HANDLE, unsigned long* piCallState, unsigned long* piSystemMode)',
    outputs: 2,
    validate: true
  },
  DIAG_NV_READ_F: {
    signature: 'byte QLIB_DIAG_NV_READ_F(HANDLE, ushort, void*, int, ushort*)'
  },
  DIAG_NV_READ_EXT_F: {
    signature: 'byte QLIB_DIAG_NV_READ_EXT_F(HANDLE, ushort, void*, ushort, int, ushort*)'
  },
  DIAG_NV_READ_ARRAY_F: {
    signature: 'byte QLIB_DIAG_NV_READ_ARRAY_F(HANDLE, ushort, byte, void*, int, ushort*)'
  },
  DIAG_NV_WRITE_F: {
    signature: 'byte QLIB_DIAG_NV_WRITE_F(HANDLE, ushort, void*, int, ushort*)'
  },
  DIAG_NV_WRITE_EXT_F: {
    signature: 'byte QLIB_DIAG_NV_WRITE_EXT_F(HANDLE, ushort, void*, ushort, int, ushort*)'
  },
  DIAG_NV_WRITE_ARRAY_F: {
    signature: 'byte QLIB_DIAG_NV_WRITE_ARRAY_F(HANDLE, ushort, byte, void*, int, ushort*)'
  },
  DIAG_VERNO_F: {
    signature: `
      unsigned char QLIB_DIAG_VERNO_F  ( HANDLE  hResourceContext,  
        char*  comp_date,  
        char*  comp_time,  
        char*  rel_date,  
        char*  rel_time,  
        char*  ver_dir,  
        unsigned char *  scm,  
        unsigned char *  mob_cai_rev,  
        unsigned char *  mob_model,  
        unsigned short *  mob_firm_rev,  
        unsigned char *  slot_cycle_index,  
        unsigned char *  voc_maj,  
        unsigned char *  voc_min  
      ) 
    `,
    validate: true
  },
  DIAG_EXT_BUILD_ID_F: {
    signature: `
      unsigned char QLIB_DIAG_EXT_BUILD_ID_F  ( HANDLE  hResourceContext,  
        unsigned long *  piMSM_HW_Version,  
        unsigned long *  piMobModel,  
        char *  sMobSwRev,  
        char *  sModelStr  
      ) 
    `
  },
  isFTMMode: {
    signature: 'uchar QLIB_IsFTM_Mode(HANDLE, uchar*)',
    outputs: 1,
    validate: true
  },
  DIAG_WaitForEvent: {
    signature: `
      unsigned char QLIB_DIAG_WaitForEvent  ( HANDLE  hResourceContext,  
        unsigned short  iEventID,  
        void *  pEvent,  
        unsigned long  iTimeOut_ms  
      ) 
    `
  }
}

const HANDLE = ''
const module1 = {
  QLIB_SetStartFlag: [ 'byte', [
    HANDLE /* hResourceContext */,
    'byte' /* bStartFlag */
  ] ],

  QLIB_SetLogFlags: [ 'byte', [
    HANDLE /* hResourceContext */,
    'uint' /* uiLogFlags */
  ] ],

  QLIB_IsLoggingStarted: [ 'byte', [ HANDLE ] ],
  QLIB_StartLogging: [ 'byte', [ HANDLE, 'string' ] ],
  QLIB_StopLogging: [ 'byte', [ HANDLE ] ]
}

const module2 = {
  QLIB_DIAG_HS_KEY_F: [ 'byte', [ 'uint', 'int', 'byte' ] ],

  QLIB_DIAG_CONTROL_F: [ 'uchar', [ HANDLE, 'int' ] ],

  QLIB_DIAG_NV_WRITE_SetBatchMode: ['uchar', [
    HANDLE /* hResourceContext */,
    'uchar' /* bStartBatchMode */
  ] ],

  QLIB_DIAG_SPC_F: ['uchar', [
    HANDLE /* hResourceContext */,
    'pointer' /* unsigned char iSPC[6] */,
    'uchar*' /* piSPC_Result */
  ] ]

}


const module3 = {
  QLIB_QPHONEMS_SaharaConfigureCallback: [ 'void', [ 'uint', 'pointer' ] ],
  QLIB_QPHONEMS_FireHoseConfigureCallback: [ 'void', [ 'uint', 'pointer' ] ]
}
