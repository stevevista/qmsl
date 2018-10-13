module.exports = {
  switchToDownloadMode: {
    signature: 'byte QLIB_QPHONEMS_SwitchToDownloadMode_OptionalValidation(HANDLE, ulong, byte, ulong*)',
    outputs: 1
  },
  disconnectSahara: {
    signature: 'void QLIB_DisconnectServer_Sahara(HANDLE)',
    sync: true
  },
  disconnectFireHose: {
    signature: 'void QLIB_DisconnectServer_FireHose(HANDLE)',
    sync: true
  },
  connectServerSahara: {
    signature: `
      HANDLE QLIB_QPHONEMS_ConnectServer_Sahara(
        uint, ulong*, ulong*, ulong*, void* pkhash, byte, int, ulong, void* callback
      )`
  },
  connectServerFireHose: {
    signature: 'HANDLE QLIB_QPHONEMS_ConnectServer_FireHose(uint, void* callback)'
  },
  flashProgrammer: {
    signature: 'byte QLIB_QPHONEMS_Sahara_FlashProgrammer(HANDLE, string)',
    validate: true
  },
  fireHoseProgram: {
    signature: 'byte QLIB_QPHONEMS_FireHoseProgram(HANDLE, string, float * imageSizeInMB, float * throughput)',
    outputs: 2
  },
  downloadUserPartitions: {
    signature: `
      unsigned char QLIB_QPHONEMS_DownloadUserPartitions  ( HANDLE  hResourceContext,  
        string  sARMPRG_FileName,  
        char *  sPartitionFileName,  
        void *  pPartitonList,  
        unsigned char  bOverridePrtnTable,  
        unsigned char  bUseTrustedMode,  
        unsigned char  bSkipGoToDownload,  
        unsigned long  iSleepTimeToDOWNLOADmode,  
        unsigned long  iSleepTimeToGOcommand,  
        unsigned long *  iErrorCode  
      ) 
    `,
    outputs: 1
  },
  uploadEmmcSingleImageFireHose: {
    signature: `
      unsigned char QLIB_QPHONEMS_UploadEmmcSingleImage_FireHose  ( HANDLE  hResourceContext,  
        unsigned int  physicalPartitionNumber,  
        char *  startSector,  
        unsigned int  numPartitionSectors,  
        unsigned int  sectorSizeInBytes,  
        string  imagefile,  
        float *  imageSizeInMB,  
        float *  throughput  
      ) 
    `
  },
  uploadEmmcImageFireHose: {
    signature: `
      unsigned char QLIB_QPHONEMS_UploadEmmcImage_FireHose  ( HANDLE  hResourceContext,  
        string  rawprogramfile,  
        string  patchfile,  
        float *  imageSizeInMB,  
        float *  throughput  
      ) 
    `
  },
  backupNVFromMobileToQCN: {
    signature: 'byte QLIB_BackupNVFromMobileToQCN(HANDLE, string, int*)',
    outputs: 1
  },
  switchToEDL: {
    signature: 'byte QLIB_QPHONEMS_SwitchToEDL(HANDLE)',
    validate: true
  }
}
