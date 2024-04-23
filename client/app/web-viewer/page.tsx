'use client'

import { AppBar, Box, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import WebViewerComponent from '../component/viewer/web-viewer.component';
import { CONFIG } from '../constants/config.constant';
import { useSearchParams } from 'next/navigation'


// Sachin code 
import DownloadIcon from '@mui/icons-material/Download';
import { GET_ONE_FILE } from '../api/file/queries';
import { useLazyQuery } from '@apollo/client';

import * as React from 'react';


const theme = createTheme();

export default function WebViewer() {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [revisionId, setRevisionId] = useState("");
  const searchParams = useSearchParams()

  useEffect(() => {
    const revId = searchParams.get('id');

    if (revId && !revisionId) {
      setRevisionId(revId);
      console.log("revId", revId)
      GetSingleFile(revId);
    }
  }, [revisionId])



  // *********** SACHIN CODE TO GET FILE FROM DB ************
  const [GetOneFile, { loading, error, data }] = useLazyQuery(GET_ONE_FILE);

  const [fileData, setFileData] = useState({
    tmpData: null, // s
    data: null,    // s
    originalname: ''
  }
  );
  const GetSingleFile = async (revisionId: string) => {
    // Define state variables to store file data
    const tmpData = await GetOneFile({
      variables: {
        revisionId
      }
    });


    setFileData((prevData) => ({
      ...prevData,
      tmpDatas: tmpData,
      originalname: tmpData?.data?.getOneFile?.originalname || ''
    }));

  }


  const generateDownloadUrl = () => {

    const revId = searchParams.get('id');
    const downloadUrl = `${CONFIG.server_api}files/downloadFile/${revId}`
    const fileName = fileData.originalname || 'Untitled';

    const anchorElement = document.createElement('a');
    anchorElement.href = downloadUrl;
    anchorElement.download = fileName;
    anchorElement.click();
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ paddingX: 0 }}>
          <CssBaseline />

          <Box
            sx={{ display: 'flex', overflowX: 'hidden', flexDirection: "column" }}
          >
            <AppBar component="nav" sx={{position: 'relative', mb: 1}}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, overflowX: 'hidden' }}>
                  Viewer/
                  {fileData.originalname}
                </Typography>
                <DownloadIcon className='Download-button' onClick={generateDownloadUrl} />
              </Toolbar>
            </AppBar>
            <Box sx={{height:'100%'}}>
              <WebViewerComponent revisionId={revisionId}></WebViewerComponent>
            </Box>

          </Box>

        </Box>
      </ThemeProvider>
    </>
  );
};