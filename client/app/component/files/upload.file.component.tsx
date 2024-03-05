import {Divider, Modal, Text} from '@nextui-org/react';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import { CONFIG } from '../../constants/config.constant';

const UploadFIleSchema = Yup.object().shape({
   fileName: Yup.string().required('Required'),
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

 interface UploadFileProps{
   fileSet: CallableFunction;
   closeSet: CallableFunction;
   open: boolean;
 }

 export interface UploadFileTypes {
   fileName: string;
 }

export const UploadFileComponent = (props: UploadFileProps) => {
   const [visible, setVisible] = useState(props.open || false);
   const [tmpFile, setTmpFile] = useState(null as any);

   useEffect(()=>{
      if(visible !== props.open){
         formik.resetForm();
         setTmpFile(null);
         setVisible(props.open)
      }
   }, [props.open]);

   const closeHandler = () => {
      setVisible(false);
      props.closeSet(false);
   };

   const initValue = {
      fileName: ""
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const uploadFile = async (values: UploadFileTypes,{ setSubmitting, resetForm }:any) => {
      const formData = new FormData();
      formData.append("fileName", tmpFile[0]);

      axios.post(`${CONFIG.server_api}files/upload`, formData, { headers: {"Content-Type": "multipart/form-data" } }).then(response => {
         response.data && props.fileSet(response.data);
         closeHandler();
         resetForm();
       });
   }

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: UploadFIleSchema,
      onSubmit: uploadFile,
    });

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
      formik.handleChange(event);
      if(event && event?.target){
         setTmpFile(event?.target?.files);
      }

    }

   return (
      <>
         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler}
         >
            <Modal.Header css={{justifyContent: 'start'}}>
               <Text id="modal-title" h4>
                  Upload new File
               </Text>
            </Modal.Header>
            <Divider css={{my: '$5'}} />
            <Modal.Body css={{py: '$10'}}>
               <Box
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
                           {formik.values.fileName || "Upload file"}
                           <VisuallyHiddenInput type="file" name="fileName" onChange={onFileChange} />
                           {/* <VisuallyHiddenInput type="file" name="fileName" onChange={(event)=>{
                                 if(event && event?.target && event?.target.files) setTmpFile(event?.target?.files[0] || "")
                              }} 
                           /> */}
                        </Button>

                        
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
            <Divider css={{my: '$5'}} />
            <Modal.Footer>
               <Button variant='contained' type='submit' sx={{borderRadius: 3}} form="upload-file-form">
                  Upload File
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
