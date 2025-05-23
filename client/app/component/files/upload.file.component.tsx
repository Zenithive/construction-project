import { Divider, Modal, Text } from '@nextui-org/react';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid, LinearProgress } from '@mui/material';
import axios from 'axios';
import { CONFIG } from '../../constants/config.constant';
import CircularProgress from '@mui/material/CircularProgress';



const UploadFIleSchema = Yup.object().shape({
   fileName: Yup.array().min(1, 'At least one file is required')
});

const VisuallyHiddenInput = styled('input')({
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: 1,
   overflow: 'hidden',
   position: 'absolute',
   bottom: 0,
   left: 0,
   whiteSpace: 'nowrap',
   width: 1,
});

interface UploadFileProps {
   fileSet: CallableFunction;
   closeSet: CallableFunction;
   open: boolean;
   setAllFilesUploaded: CallableFunction;
}

export interface UploadFileTypes {
   fileName: File[];
}

export const UploadFileComponent = (props: UploadFileProps) => {
   const [visible, setVisible] = useState(props.open || false);
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const [fileNames, setFileNames] = useState<string[]>([]);
   const [totalUploadedFiles, setTotalUploadedFiles] = useState(0);
   const [loading, setLoading] = useState(false); // Loading state for the button
   const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
   const [uploading, setUploading] = useState(false); // Flag to track upload in progress




   useEffect(() => {
      if (selectedFiles.length > 0 && totalUploadedFiles === selectedFiles.length) {
         // If all files are uploaded, set the flag to true
         props.setAllFilesUploaded(true);
         closeHandler();
         formik.resetForm();
        
      }
   }, [totalUploadedFiles, selectedFiles]);



   useEffect(() => {
      if (visible !== props.open) {
         formik.resetForm();
         setSelectedFiles([]);
         setFileNames([]);
         setVisible(props.open);
         props.setAllFilesUploaded(false);
      }
   }, [props.open]);



   const closeHandler = () => {
      setVisible(false);
      props.closeSet(false)
      setUploading(false);
      setLoading(false);
      setTotalUploadedFiles(0);
      setUploadProgress(0);
      // resetFileFlag && props.fileSet("");
   };

   const initValue = {
      fileName: []
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const uploadFile = async () => {
      if (selectedFiles.length > 0) {
         try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tmpArray: any[] = [];
            setUploading(true); 
            setLoading(true);

            selectedFiles.forEach(async (file) => {
               const formData = new FormData();
               formData.append('fileName', file)
               const response = await axios.post(`${CONFIG.server_api}files/upload`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                  onUploadProgress: progressEvent => {
                     const progress = Math.round((progressEvent.loaded / (progressEvent?.total || 0)) * 100);
                     setUploadProgress(progress); // Update upload progress
                  }
               });

               tmpArray.push(response.data);
               props.fileSet(tmpArray);
               setTotalUploadedFiles(prevState => prevState + 1); // Increment totalUploadedFiles by 1

            });

         }

         catch (error) {
            console.error('Error uploading files:', error);

            setLoading(false);
            setUploading(false);
            setUploadProgress(0);
         }
      } else {
         console.error('No file selected');
      }
   };

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: UploadFIleSchema,
      onSubmit: uploadFile,
   });

   const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event && event.target && event.target.files) {
         const filesArray = Array.from(event.target.files);
         setSelectedFiles(filesArray);
         setFileNames(filesArray.map(file => file.name));
         formik.setFieldValue('fileName', filesArray.map(file => file.name));
      }
   }

   const removeFile = (fileName: string) => {
      const updatedFiles = selectedFiles.filter(file => file.name !== fileName);
      setSelectedFiles(updatedFiles);
      setFileNames(updatedFiles.map(file => file.name));
      formik.setFieldValue('fileName', updatedFiles.map(file => file.name));
   }



   return (
      <>
         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler.bind(this)}
         >
            <Modal.Header css={{ justifyContent: 'start' }}>
               <Text id="modal-title" h4>
                  Upload new Files
               </Text>
            </Modal.Header>
            <Divider css={{ my: '$5' }} />
            <Modal.Body css={{ py: '$10' }}>
               <Box
                  id="upload-file-form"
                  component="form"
                  noValidate
                  onSubmit={formik.handleSubmit}
                  sx={{ mt: 3 }}
               >
                  <Grid container spacing={2}>
                     <Grid item xs={12}>


                        {fileNames.map((fileName, index) => (
                           <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{fileName}</span>
                              {selectedFiles[index] && uploading && (
                                 <Box sx={{ position: 'relative', width: '30px', height: '30px' }}>
                                    <CircularProgress size={30} color="primary" variant="determinate" value={uploadProgress} />
                                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', fontSize: '0.6rem' }}>{uploadProgress}%</span>
                                 </Box>
                              )}
                              {!uploading && (
                                 <CloseIcon onClick={() => removeFile(fileName)} />
                              )}
                           </Box>
                        ))}



                     </Grid>
                     <Grid item xs={12}>
                        {!uploading ? (
                           <Button
                              component="label"
                              variant="contained"
                              startIcon={<CloudUploadIcon />}
                              disabled={loading} // Disable the button when loading
                           >
                              {loading ? (
                                 <CircularProgress size={24} color="inherit" />
                              ) : (
                                 'Upload file'
                              )}
                              <VisuallyHiddenInput multiple={true} type="file" name="fileName" onChange={onFileChange} />
                           </Button>
                        ) : (
                           <LinearProgress variant="determinate" value={uploadProgress} />
                        )}
                     </Grid>
                  </Grid>
               </Box>
            </Modal.Body>
            <Divider css={{ my: '$5' }} />
            <Modal.Footer>
               {!uploading && (
                  <Button
                     variant="contained"
                     type="submit"
                     sx={{ borderRadius: 3 }}
                     form="upload-file-form"
                     onClick={() => {
                        // props.closeSet(false); // Close UploadFileComponent modal if open
                        // props.toggleUploadModalHook.setIsUploadModalOpen(true); // Open AddFile modal
                     }}
                  >
                     Upload New Files
                  </Button>
               )}
            </Modal.Footer>
         </Modal>
      </>
   );
};

