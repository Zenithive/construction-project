'use client'

import { AppBar, Box, Button, Checkbox, CircularProgress, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import axios from 'axios';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CREATE_USER } from '../api/user/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation'
import ToastMessage from '../component/toast-message/ToastMessage';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import ViewerComponent from '../component/viewer/viewer.component';
import { GET_APS_MODELS } from '../api/apsforge/queries';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const theme = createTheme();
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup
    .string()
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
});

/* eslint-disable-next-line */
export interface SignupProps { }

// const DynamicComponent = dynamic(() => import("https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css"))


export default function Viewer(props: SignupProps) {
  const Autodesk = typeof window !== "undefined" ? window["Autodesk"] : null;
  const viewerRef = useRef(null)
  const [urn, setUrn] = useState("");
  const [allData, setAllData] = useState([]);
  const [accessToken, setAccessToken] = useState("")

  const getModelsData = ()=>{
    axios.get('http://localhost:3000/api/aps/getApsForgeModels').then(response => {
      setAllData(response.data);
      setUrn(response.data[0].urn)
    });
  }


  useEffect(() => {
    if(!allData.length) getModelsData();
  }, [allData])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css"
      />
      <Script
        src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
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
              <ViewerComponent urn={urn}></ViewerComponent>
            </Box>

          </Box>

        </Container>
      </ThemeProvider>
    </>
  );
}
