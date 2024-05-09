'use client'

import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ToastMessage from '../toast-message/ToastMessage';
import { CONFIG } from '../../constants/config.constant';


/* eslint-disable-next-line */
export interface ViewerCompoentProps {
    revisionId: string;
}

export default function WebViewerComponent(props: ViewerCompoentProps) {
    const { revisionId } = props;
    const viewerRef = useRef<HTMLDivElement>(null)
    const [viewer, setViewer] = useState<any>(null)
    const [error, setError] = useState(false);
    const beenInitialised = useRef<Boolean>(false);




    useEffect(() => {

        const callView = async () => {
            try {
                console.log("CONFIG.pdftron_web_viewer_key", CONFIG.pdftron_web_viewer_key)
                const WebViewer = await import('@pdftron/webviewer');
                const docx = await WebViewer.default(
                    {
                        path: '/lib',
                        licenseKey: CONFIG.pdftron_web_viewer_key,//'demo:1713377310356:7fec63a3030000000019570e975695a71a7b7a7e9b6c8c3c5f510461a8',
                        //initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
                        initialDoc: `${CONFIG.server_api}files/renderPdfTronFile?id=${revisionId}` // 'http://localhost:3000/api/files/renderPdfTronFile',
                    },
                    viewerRef.current as HTMLDivElement,
                )
                const { Core, UI } = docx;
                const { documentViewer, annotationManager, Annotations, Tools } = Core;
            } catch (error) {
                console.log('viewer error ==> ', error)
            }
        }

        revisionId && callView();
    }, [revisionId])


    return (
        <>
            <ToastMessage
                severity="error"
                openFlag={error ? true : false}
                message='Problem while loading the viewer. Please try again or contact support.'
            ></ToastMessage>
            <Box className="webViewer" ref={viewerRef} id="test" sx={{ height: 'calc(100vh - 73px)' }}></Box>

        </>
    );
}
