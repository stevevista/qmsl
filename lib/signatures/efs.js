module.exports = {
  efsDirectory: {
    signature: 'byte QLIB_EfsDirectory(HANDLE, string)'
  },
  EFS2_DIAG_STAT: {
    signature: 'byte QLIB_EFS2_DIAG_STAT(HANDLE, string, ulong*, ulong*, ulong*, ulong*, ulong*, ulong*, ulong*)'
  },
  efsRename: {
    signature: `
      unsigned char QLIB_EFS2_DIAG_RENAME  ( HANDLE  hResourceContext,  
        string  sOldFilePath,  
        string  sNewFilePath,  
        unsigned long *  piErrorNo  
      ) 
    `,
    outputs: 1
  },
  efsWriteMem: {
    signature: 'byte QLIB_EfsWriteMem(HANDLE, void*, long*, string)'
  },
  efsReadMem: {
    signature: `
      unsigned char QLIB_EfsReadMem  ( HANDLE  hResourceContext,  
        char *  dataBuffer,  
        long *  dataBufferSize,  
        string  sEFS_File  
      ) 
    `
  },
  efsDelete: {
    signature: 'byte QLIB_EfsDelete(HANDLE, string)'
  },
  efsDelTree: {
    signature: 'byte QLIB_EfsDelTree(HANDLE, string)'
  },
  efsMkDir: {
    signature: 'byte QLIB_EfsMkDir(HANDLE, string)'
  },
  efsRmDir: {
    signature: 'byte QLIB_EfsRmDir(HANDLE, string)'
  },
  efsRmTree: {
    signature: 'byte QLIB_EfsRmTree(HANDLE, string)'
  }
}
