module.exports = {
  getLibraryVersion: {
    signature: 'void QLIB_GetLibraryVersion(char ver[50])',
    outputs: 1,
    sync: true
  },
  getLibraryCapabilities: {
    signature: `
        void QLIB_GetLibraryCapabilities  ( unsigned char *  pbSupportsDiag,  
          unsigned char *  pbSupportsEFS,  
          unsigned char *  pbSupportsSwDownload,  
          unsigned char *  pbUsingQPST  
        ) 
    `,
    ignore: true
  },
  setLibraryMode: {
    signature: 'void QLIB_SetLibraryMode(byte)',
    sync: true
  },
  setTargetType : {
    signature: 'void QLIB_SetTargetType(byte)',
    sync: true
  },
  setDiagType : {
    signature: 'void QLIB_SetDiagType(byte)',
    sync: true
  },
  terminateQPSTServer: {
    signature: 'void QLIB_TerminateQPSTServer()'
  },
  connectServer: {
    signature: 'HANDLE QLIB_ConnectServer(unsigned int iComPort )'
  },
  connectServerWithWait: {
    signature: 'HANDLE QLIB_ConnectServerWithWait(unsigned int iComPort, unsigned int iWait_ms )'
  },
  connectServerWithVerify: {
    signature: 'HANDLE QLIB_ConnectServerWithVerify(unsigned int iComPort)'
  },
  disconnect: {
    signature: 'void QLIB_DisconnectServer(HANDLE)',
    sync: true
  },
  isPhoneConnected: {
    signature: 'byte QLIB_IsPhoneConnected(HANDLE)',
    sync: true
  },
  isDeviceConnected: {
    signature: 'byte QLIB_IsDeviceConnected(HANDLE, byte iDeviceCheckType)',
    sync: true
  },
  setPacketMode: {
    signature: 'byte QLIB_SetPacketMode(HANDLE, byte)',
    sync: true
  },
  sendSync: {
    signature: `
      byte QLIB_SendSync(
        HANDLE hResourceContext ,
        short iRequestSize ,
        unsigned char *  piRequestBytes,
        short * piResponseSize,
        unsigned char *  piResponseBytes,
        unsigned long iTimeout
      )
    `
  },
  sendRAW: {
    signature: `
      byte QLIB_SendRAW(
        HANDLE hResourceContext,
        short iRequestSize,
        unsigned char *  piRequestBytes,
        short * piResponseSize ,
        unsigned char *  piResponseBytes,
        unsigned long iTimeout
      )
    `
  },
  configureCallBacks: {
    signature: `
      void QLIB_ConfigureCallBacks(
        HANDLE hResourceContext,
        void* pEfsDirCallback,
        void*  pGeneralSwDownloadCB,
        void*  pAsyncMessageCB
      )
    `,
    ignore: true
  },
  configureEfs2CallBacks: {
    signature: `
      void QLIB_ConfigureEfs2CallBacks(
        HANDLE hResourceContext,
        void* pEfsCallback,
        void*  pEfsDirCB
      )
    `,
    ignore: true
  },
  configureLibraryTextLogCallBack: {
    signature: `
      void QLIB_ConfigureLibraryTextLogCallBack(
        HANDLE hResourceContext,
        void* pAsyncMessageCB
      )
    `,
    ignore: true
  },
  configureTimeOut: {
    signature: `
      byte QLIB_ConfigureTimeOut(
        HANDLE hResourceContext,
        unsigned long eTimeOutId,
        unsigned long iNewValue_ms
      )
    `,
    sync: true
  },
  getTimeOut: {
    signature: `
      byte QLIB_GetTimeOut(
        HANDLE hResourceContext,
        unsigned long eTimeOutId
      )
    `,
    sync: true
  },
  changeFTMBootMode: {
    signature: 'byte QLIB_ChangeFTM_BootMode(HANDLE, byte bFTMmode, byte bReset)',
    validate: true
  },
  changeFTMModeRuntime: {
    signature: 'byte QLIB_ChangeFTM_ModeRuntime(HANDLE, byte bFTMmode)',
    validate: true
  }
}
