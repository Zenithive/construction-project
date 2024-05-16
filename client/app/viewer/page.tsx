'use client'

import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import axios from 'axios';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import ViewerComponent from '../component/viewer/viewer.component';
import { CONFIG } from '../constants/config.constant';
import { useSearchParams } from 'next/navigation'


// Sachin code 
import DownloadIcon from '@mui/icons-material/Download';
import App from 'next/app';
import { GET_ONE_FILE } from '../api/file/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GetSingleFileInput } from '../../../api/src/app/file/file.schema';

import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { AddBoxTwoTone } from '@mui/icons-material';
// import Box from '@mui/material/Box';







const theme = createTheme();

export default function Viewer() {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [urn, setUrn] = useState("");
  const [isJSLoader, setIsJSLoader] = useState(true);
  const [allData, setAllData] = useState([]);

  const searchParams = useSearchParams()



  const getModelsData = () => {
    axios.get(`${CONFIG.server_api}aps/getApsForgeModels`).then(response => {
      setAllData(response.data);
      setUrn(response.data[0].urn)
    });
  }

  useEffect(() => {
    const urnId = searchParams.get('id');

    if (urnId && !urn) {
      setUrn(urnId);
      console.log("urnId", urnId)
      GetSingleFile(urnId);
    }
  }, [urn])


  const [GetOneFile, { loading, error, data }] = useLazyQuery(GET_ONE_FILE);

  const [fileData, setFileData] = useState({
    tmpData: null, // s
    data: null,    // s
    originalname: ''
  }
  );
  const GetSingleFile = async (urn: string) => {
    // Define state variables to store file data
    const tmpData = await GetOneFile({
      variables: {
        urn
      }
    });

    // Sachin Code

    setFileData((prevData) => ({
      ...prevData,
      tmpDatas: tmpData,
      originalname: tmpData?.data?.getOneFile?.originalname || ''
    }));

    console.log("tmpData", tmpData);
    console.log("data", data);

    // Fetch file details using GraphQL query
  }




  //////  Downlaod file ////////////


  const generateDownloadUrl = (tmpData: any) => {


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
              </h1> : <ViewerComponent urn={urn}></ViewerComponent>}
            </Box>

          </Box>

        </Box>
      </ThemeProvider>
    </>
  );
};