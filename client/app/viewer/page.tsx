'use client'

import { AppBar, Box, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import ApsViewerComponent from '../component/viewer/aps-viewer.component';
import { CONFIG } from '../constants/config.constant';
import { useSearchParams } from 'next/navigation'


// Sachin code 
import DownloadIcon from '@mui/icons-material/Download';
import { GET_ONE_FILE } from '../api/file/queries';
import { useLazyQuery } from '@apollo/client';

import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


const theme = createTheme();

export default function Viewer() {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [revisionId, setRevisionId] = useState("");
  const [isJSLoader, setIsJSLoader] = useState(true);
  const searchParams = useSearchParams()

  useEffect(() => {
    const revisionId = searchParams.get('id');

    if (revisionId) {
      setRevisionId(revisionId);
      GetSingleFile(revisionId);
    }
  }, [revisionId])


  const [GetOneFile, { loading, error, data }] = useLazyQuery(GET_ONE_FILE);

  const [fileData, setFileData] = useState({
    tmpData: null, // s
    data: null,    // s
    originalname: '',
    urn: ""
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
      urn: tmpData?.data?.getOneFile?.apsUrnKey || '',
      originalname: tmpData?.data?.getOneFile?.originalname || ''
    }));

  }


  const generateDownloadUrl = () => {

    const urnId = searchParams.get('id');
    const downloadUrl = `${CONFIG.server_api}files/downloadFile/${urnId}`
    const fileName = fileData.originalname || 'Untitled';

    const anchorElement = document.createElement('a');
    anchorElement.href = downloadUrl;
    anchorElement.download = fileName;
    anchorElement.click();
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0/style.css"
      />
      <Script
        src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0/viewer3D.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log(`script loaded correctly, window.FB has been populated`);
          setIsJSLoader(false);
        }}
      />
      <ThemeProvider theme={theme}>
        <Box sx={{ paddingX: 0 }}>
          <CssBaseline />

          <Box
            sx={{ display: 'flex', overflowX: 'hidden' }}
          >
            <AppBar component="nav">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, overflowX: 'hidden' }}>
                  Viewer/
                  {fileData.originalname}
                </Typography>
                <DownloadIcon className='Download-button' onClick={generateDownloadUrl} />
              </Toolbar>
            </AppBar>
            <Box >
              {isJSLoader ? <h1>
                {/* Loading.... */}
                <CircularProgress />
              </h1> : <ApsViewerComponent urn={fileData.urn}></ApsViewerComponent>}
            </Box>

          </Box>

        </Box>
      </ThemeProvider>
    </>
  );
};