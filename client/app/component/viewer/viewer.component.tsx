'use client'

import { Box } from '@mui/material';
import axios from 'axios';
import { CONFIG } from '../../constants/config.constant';
import { useEffect, useRef, useState } from 'react';
import ToastMessage from '../toast-message/ToastMessage';


/* eslint-disable-next-line */
export interface ViewerCompoentProps {
    urn: string;
}

// const DynamicComponent = dynamic(() => import("https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css"))


export default function ViewerComponent(props: ViewerCompoentProps)  {
    const {urn} = props;
    const loadAutodeskExtensions=['Autodesk.DocumentBrowser', 'Autodesk.VisualClusters'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Autodesk: any = typeof window !== "undefined" ? (window as any)["Autodesk"] : null;
  const viewerRef = useRef(null)
  const [viewer, setViewer] = useState<any>(null)
  const [ accessToken, setAccessToken] = useState("")
  const [ error, setError] = useState(false)

  const getAccessToken = ()=>{
    axios.get(`${CONFIG.server_api}aps/getApsForgeToken`).then(response => {
        setAccessToken(response.data.access_token);
    });
  }



  useEffect(() => {
    if(!accessToken) getAccessToken()
    if (!urn || !accessToken || !viewerRef || !Autodesk)
        return

    // Init viewer
    const options = {
        env: "AutodeskProduction",
        getAccessToken: (onTokenReady: any) => {
            const timeInSeconds = 3600 // Use value provided by Forge Authentication (OAuth) API
            onTokenReady(accessToken, timeInSeconds)
        },
    }

    Autodesk && Autodesk.Viewing.Initializer(options, () => {
        const config = {
            extensions: loadAutodeskExtensions || ['Autodesk.DocumentBrowser', 'Autodesk.VisualClusters']
        };
        const viewer = new Autodesk.Viewing.GuiViewer3D(viewerRef.current, config);
        viewer.start();
        viewer.setTheme('light-theme');
        // viewer
        viewer.resize();


        // Load Document
        const onDocumentLoadSuccess = async (doc: any) => {
            await viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry());

            // load custom extensions
            // const loadExtensionsPromises = (loadCustomExtensions || []).map(element => {
            //     return viewer.loadExtension(element);
            // });

            // // Wait for all extensions to be loaded
            // await Promise.all(loadExtensionsPromises);


            //save the callback for later use inside the click events
            // viewer.customCallbacks = customExtensionsCallbacks
        }

        const onDocumentLoadFailure = (code: any, message: any, errors: any) => {
            console.error({ code, message, errors });
        }

        viewer.setLightPreset(0);
        //if (registerExtensionsCallback) registerExtensionsCallback(viewer);

        setViewer(viewer);

        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);



    });


    return () => {
        if (!viewer) return
        viewer.finish()
        setViewer(null)

        Autodesk.Viewing.shutdown()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [urn, accessToken])


  return (
    <>
        <ToastMessage 
            severity="error"
            openFlag={error ? true : false } 
            message='Problem while loading the viewer. Please try again or contact support.'
          ></ToastMessage>
        <Box ref={viewerRef}></Box>
    </>
  );
}
