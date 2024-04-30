import { Divider, Modal, Text } from '@nextui-org/react';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import { CONFIG } from '../../constants/config.constant';
import { BooleanLiteral } from 'typescript';

const UploadFIleSchema = Yup.object().shape({
   // fileName: Yup.string().required('Required'),
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
}

export interface UploadFileTypes {
   // fileName: string;
   fileName: File[];
}

export const UploadFileComponent = (props: UploadFileProps) => {
   const [visible, setVisible] = useState(props.open || false);
   const [selectedFiles, setSelectedFiles] = useState<FileList>([]);
   // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const [fileNames, setFileNames] = useState<string[]>([]);

   useEffect(() => {
      if (visible !== props.open) {
         formik.resetForm();

         setSelectedFiles([]);
         setFileNames([]);
         setVisible(props.open)
      }
   }, [props.open]);

   const closeHandler = (resetFileFlag: boolean) => {
      setVisible(false);
      props.closeSet(false);
      resetFileFlag && props.fileSet("");
   };

   const initValue = {
   
      fileName: []
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   // const uploadFile = async (values: UploadFileTypes, { setSubmitting, resetForm }: any) => {
   //    const formData = new FormData();
   //    formData.append("fileName", tmpFile[0]);
   //    

   //    axios.post(`${CONFIG.server_api}files/upload`, formData, { 
   // headers: { "Content-Type": "multipart/form-data" } }).then(response => {
   //       response.data && props.fileSet(response.data);
   //       closeHandler(false);
   //       resetForm();
   //    });
   // }

   // const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
   //    event.preventDefault(); // Prevent default form submission
   //    formik.handleSubmit(event); // Call formik's handleSubmit method
   //  };

   const uploadFile = async () => {
      // console.log("Hello")
      // const formData = new FormData();
      // selectedFiles.forEach(file => formData.append('files[]', file));

      if (selectedFiles.length > 0) {
         // formData.append('fileName', selectedFiles[0]);
         // selectedFiles.forEach(file => formData.append('fileName', file));  ForEach Loop  
         
         for (let i = 0; i < selectedFiles.length; i++) {   // for Loop method
            const formData = new FormData();
            formData.append('files', selectedFiles[i]);
            try {
               const response = await axios.post(`${CONFIG.server_api}files/upload`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
               });
   
               props.fileSet(response.data); // Assuming the response contains the file info or reference
               closeHandler(false);
               formik.resetForm();
            } catch (error) {
               console.error('Error uploading files:', error);
               // Handle error as needed
            }
         }

      }
      else {
         console.error('No file selected');
         // Optionally handle the case where no file is selected
      }
   };

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: UploadFIleSchema,
      onSubmit: uploadFile,
   });

   const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

      //formik.handleChange(event);       
      // if (event && event?.target) {
      //    setTmpFile(event?.target?.files);
      // }

      if (event && event.target && event.target.files) {
         const filesArray = Array.from(event.target.files);
         setSelectedFiles(event.target.files);
         setFileNames(filesArray.map(file => file.name));
         formik.setFieldValue('fileName', filesArray.map(file => file.name));
         // formik.setFieldValue('fileName', filesArray);

      }

   }

   const removeFile = (fileName: string) => {
      const updatedFiles = selectedFiles.filter(file => file.name !== fileName);
      setSelectedFiles(updatedFiles);
      setFileNames(updatedFiles.map(file => file.name));
      formik.setFieldValue('fileName', updatedFiles);
   }



   return (
      <>
         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler.bind(this, true)}
         >
            <Modal.Header css={{ justifyContent: 'start' }}>
               <Text id="modal-title" h4>
                  Upload new Files
               </Text>
            </Modal.Header>
            <Divider css={{ my: '$5' }} />
            <Modal.Body css={{ py: '$10' }}>
               {/* <Box
                  id='upload-file-form'
                  component="form"
                  noValidate
                  onSubmit={formik.handleSubmit}
                  sx={{ mt: 3 }}
               >
                  <Grid container spacing={2}>
                     <Grid item xs={12}>  
                        <Button
                           component="label"
                           variant="contained"
                           startIcon={<CloudUploadIcon />}
                        >
                           {formik.values.fileName

                              || "Upload file"}
                           <VisuallyHiddenInput type="file" name="fileName" onChange={onFileChange} />
                           {/* <VisuallyHiddenInput type="file" name="fileName" onChange={(event)=>{
                                 if(event && event?.target && event?.target.files) setTmpFile(event?.target?.files[0] || "")
                              }} 
                           /> */}
               {/* </Button> */}


               {/* <TextField
                           required
                           fullWidth
                           id="projName"
                           label="Project Name"
                           name="projName"
                           autoComplete="projName"
                           value={formik.values.projName}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           error={formik.touched.projName && Boolean(formik.errors.projName)}
                           helperText={formik.touched.projName && formik.errors.projName}
                        /> */}

               {/* {formik.values.fileName && ( */}
               {/* <CloseIcon onClick={() => { */}
               {/* formik.setFieldValue('fileName', ''); */}
               {/* setTmpFile(null); */}
               {/* }} /> */}
               {/* )} */}
               {/* </Grid> */}
               {/* </Grid> */}
               {/* </Box> */}

               <Box
                  id='upload-file-form'
                  component="form"
                  noValidate
                  onSubmit={formik.handleSubmit}
                  // onSubmit={onSubmitHandler}
                  sx={{ mt: 3 }}
               >
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        {fileNames.map((fileName, index) => (
                           <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{fileName}</span>
                              <CloseIcon onClick={() => removeFile(fileName)} />
                           </Box>
                        ))}
                     </Grid>
                     <Grid item xs={12}>
                        <Button
                           component="label"
                           variant="contained"
                           startIcon={<CloudUploadIcon />}

                        >
                           Upload file
                           <VisuallyHiddenInput multiple={true} type="file" name="fileName" onChange={onFileChange} />
                        </Button>
                     </Grid>
                  </Grid>
               </Box>





               {/* <Flex
                  direction={'column'}
                  css={{
                     'flexWrap': 'wrap',
                     'gap': '$8',
                     '@lg': {flexWrap: 'nowrap', gap: '$12'},
                  }}
               >

                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} onChange={}>
                        Upload file
                        <VisuallyHiddenInput type="file" />
                     </Button>
                  </Flex>
               </Flex> */}
            </Modal.Body>
            <Divider css={{ my: '$5' }} />
            <Modal.Footer>
               <Button variant='contained' type='submit' sx={{ borderRadius: 3 }} form="upload-file-form" >
                  Upload Files
               </Button>

               {/* {JSON.stringify(formik)} */}
            </Modal.Footer>
         </Modal>
      </>
   );
};
