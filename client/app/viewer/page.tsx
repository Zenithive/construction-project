'use client'

import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import axios from 'axios';

import Script from 'next/script';
import { useEffect,  useState } from 'react';
import ViewerComponent from '../component/viewer/viewer.component';
import { CONFIG } from '../constants/config.constant';
import { useSearchParams } from 'next/navigation'


const theme = createTheme();

export default function Viewer() {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [urn, setUrn] = useState("");
  const [isJSLoader, setIsJSLoader] = useState(true);
  const [allData, setAllData] = useState([]);

  const searchParams = useSearchParams()
 
  

  const getModelsData = ()=>{
    axios.get(`${CONFIG.server_api}aps/getApsForgeModels`).then(response => {
      setAllData(response.data);
      setUrn(response.data[0].urn)
    });
  }


  useEffect(() => {
    const urnId = searchParams.get('id');
    if(urnId && !urn) {
      setUrn(urnId);
      console.log("urnId", urnId)
    }
  }, [urn])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0/style.css"
      />
      <Script
        src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0/viewer3D.js"
        strategy="lazyOnload"
        onLoad={() =>{
          console.log(`script loaded correctly, window.FB has been populated`);
          setIsJSLoader(false);
        }}
      />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xl" sx={{ padding: 0 }}>
          <CssBaseline />

          <Box
            sx={{ display: 'flex'}}
          >
            <AppBar component="nav">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Viewer
                </Typography>
              </Toolbar>
            </AppBar>
            <Box component="main" >
              {isJSLoader ? <h1>Loading....</h1> : <ViewerComponent urn={urn}></ViewerComponent>}
            </Box>

          </Box>

        </Container>
      </ThemeProvider>
    </>
  );
}
