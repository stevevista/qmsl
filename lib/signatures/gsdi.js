module.exports = {
  MMGSDI_CLIENT_ID_AND_EVT_REG_CMD: {
    signature: `
      unsigned char QLIB_MMGSDI_CLIENT_ID_AND_EVT_REG_CMD  ( HANDLE  hResourceContext,  
        unsigned long *  status,  
        unsigned long *  client_id_low,  
        unsigned long *  client_id_high  
      )
    `,
    outputs: 3
  }
}
