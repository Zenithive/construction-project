import {Divider, Modal, Text} from '@nextui-org/react';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UploadFileComponent } from './upload.file.component';
import ToastMessage from '../toast-message/ToastMessage';
import { Box, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { SAVE_FILE_DATA } from '../../api/file/mutations';

const FileObjSchema = Yup.object().shape({
   fileName: Yup.string().required('Required'),
   status: Yup.string().required('Required'),
   docRef: Yup.string().required('Required'),
   revision: Yup.string().required("Required"),
});

 export interface FileMetadataType{
   fileName: string;
   originalName: string;
   path: string;
   size: number;
   extension: string;
 }

 export interface FileSchemaType{
   fileName: string;
   originalname: string;
   path: string;
   orginatorId: string;
   createdDate?: Date;
   updatedDate?: Date;
   extension: string;
   size: number;
   status: string;
   docRef: string;
   revision: string;
   userId: string;
   projectId: string;
   fileId?: string;
 }

 export interface AddFilesProps {
   setListRefresh: React.Dispatch<React.SetStateAction<boolean>>
 }


export const AddFile = ({setListRefresh}:AddFilesProps) => {
   const initValue:FileSchemaType = {
      fileName: "",
      originalname: "",
      path: "",
      orginatorId: "",
      extension: "",
      size: 0,
      status: "",
      docRef: "",
      revision: "",
      userId: "a",
      projectId: "v",
   }
   const [saveFileData, { data, error, loading }] = useMutation(SAVE_FILE_DATA);
   const [visible, setVisible] = React.useState(false);
   const openFileDataModal = () => setVisible(true);
   const fileUploadDialogOpen = () => setIsUploadFileOpen(true);

   const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
    const [fileData, setFileData] = useState({} as FileMetadataType);

   const closeHandler = () => {
      setVisible(false);
      formik.resetForm();
   };

   useEffect(()=>{
      console.log("fileData", fileData)
      if(fileData && fileData?.fileName){
         setInitFileData();
         openFileDataModal();
      }
   }, [fileData]);

   const setInitFileData = () => {
      
      formik.setFieldValue("fileName", fileData.fileName);
      formik.setFieldValue("originalname", fileData.originalName || "");
      formik.setFieldValue("path", fileData.path);
      formik.setFieldValue("extension", fileData.extension || "");
      formik.setFieldValue("size", fileData.size);
   }

   const openViewer = () => {
      
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const submitForm = async (values: FileSchemaType,{ setSubmitting }:any) => {
      setSubmitting(true);
      const res = await saveFileData({
         variables: {
            ...values,
            // fileName: fileData.fileName,
            // originalname: fileData.originalname || "",
            // path: fileData.path,
            // extension: fileData.extension,
            // size: fileData.size,
         },
      });


      const fileName:string|null = res.data?.uploadFile?.fileName;
      if(fileName){
         closeHandler();
         setListRefresh((flag:boolean)=>!flag);
         // setListRefresh((flag:boolean)=>!flag);
         //dispatch(addUser({token : token}));
         //router.push("/dashboard");
      }
      
      setSubmitting(false);
   }

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: FileObjSchema,
      onSubmit: submitForm,
   });

   return (
      <>
         <Button component="label" onClick={fileUploadDialogOpen} sx={{borderRadius: 3}} variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
         </Button>

         <UploadFileComponent closeSet={setIsUploadFileOpen} open={isUploadFileOpen} fileSet={setFileData} ></UploadFileComponent>

         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler}
         >
            <Modal.Header css={{justifyContent: 'start'}}>
               <Text id="modal-title" h4>
                  Add new File
               </Text>

               <ToastMessage 
                  severity="success" 
                  openFlag={data?.createProject?._id ? true : false } 
                  message='File uploaded.'
               ></ToastMessage>

               <ToastMessage 
                  severity="error" 
                  openFlag={error ? true : false } 
                  message='Problem while uploading the file.'
               ></ToastMessage>
            </Modal.Header>
            <Divider css={{my: '$5'}} />
            <Modal.Body css={{py: '$10'}}>
            <Box
               id='save-file-form'
               component="form"
               noValidate
               onSubmit={formik.handleSubmit}
               sx={{ mt: 3 }}
            >
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        id="fileName"
                        label="File Name"
                        name="fileName"
                        autoComplete="fileName"
                        value={formik.values.fileName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.fileName && Boolean(formik.errors.fileName)}
                        helperText={formik.touched.fileName && formik.errors.fileName}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        name="revision"
                        label="Revision"
                        id="revision"
                        autoComplete="revision"
                        value={formik.values.revision}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.revision && Boolean(formik.errors.revision)}
                        helperText={formik.touched.revision && formik.errors.revision}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        name="docRef"
                        label="Doc Ref"
                        id="docRef"
                        autoComplete="docRef"
                        value={formik.values.docRef}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.docRef && Boolean(formik.errors.docRef)}
                        helperText={formik.touched.docRef && formik.errors.docRef}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        name="status"
                        label="Status"
                        id="status"
                        autoComplete="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.status && Boolean(formik.errors.status)}
                        helperText={formik.touched.status && formik.errors.status}
                     />
                  </Grid>
                  
               </Grid>
          </Box>
            </Modal.Body>
            <Divider css={{my: '$5'}} />
            <Modal.Footer>
               <Button disabled={loading} style={{borderRadius: 10}} variant="contained" type='submit' form="save-file-form">
                  Add File
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
