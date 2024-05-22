import { Divider, Modal, Text } from '@nextui-org/react';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UploadFileComponent } from './upload.file.component';
import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { toggleUploadModalInterface, FolderIdInterface } from '../../files/page';
import { useAppSelector } from '../../reducers/hook.redux';

import { CONFIG } from '../../constants/config.constant';
import axios from 'axios';
import { RootState } from '../../reducers/store';
import ToastMessage from '../toast-message/ToastMessage';
import { GENERATE_APS_URN_KEY } from '../../api/file/queries';
import { useQuery } from '@apollo/client';



const FileObjSchemaNew = Yup.object().shape({
   files: Yup.array()
      .of(
         Yup.object().shape({
            fileName: Yup.string().required('Required'),
            status: Yup.string().required('Required'),
            docRef: Yup.string().required('Required'),
            revision: Yup.string().required("Required")
         })
      )
      .required('Must have files')
});

export interface FileMetadataType {
   fileName: string;
   originalName: string;
   path: string;
   size: number;
   extension: string;
   folderId: string;

}

export interface FileSchemaType {
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
   folderId: string;  // this is the id of the parent folder
}

export interface FileSchemaArrayType {
   files: Array<FileSchemaType>
}

export interface AddFilesProps {
   setListRefresh: React.Dispatch<React.SetStateAction<boolean>>;
   toggleUploadModalHook: toggleUploadModalInterface;
   folderIdHook: FolderIdInterface;

}

export const AddFile = ({ setListRefresh, toggleUploadModalHook, folderIdHook }: AddFilesProps) => {

   const initValue: FileSchemaArrayType = {
      files: [
         {
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
            folderId: ""
         }
      ]
   }

   const [visible, setVisible] = React.useState(false);
   const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
   const [fileData, setFileData] = useState([] as Array<Array<FileMetadataType>>);
   const [allFilesUploaded, setAllFilesUploaded] = useState(false);
   const openFileDataModal = () => setVisible(true);
   const fileUploadDialogOpen = () => setIsUploadFileOpen(true);
   const [fileIdForURN, setFileIdForURN] = React.useState<Array<string>>([]);

   const GenerateApsUrnKey = ({fileId}: {fileId: string}) => {
      const { data, error } = useQuery(GENERATE_APS_URN_KEY , {
         variables : {fileId: (fileId || [])},
         skip: !fileId
      });

      useEffect(()=>{
         if (data || error) {
            setFileIdForURN((val)=>val.filter(tmpVal => tmpVal.indexOf(fileId) == -1));
            setListRefresh((boolFlag:boolean)=>!boolFlag);
         }
      }, [data, error]);

      return (
         <>
            <ToastMessage 
               severity="success" 
               openFlag={data?.createProject?._id ? true : false } 
               message="File's APS URN key generated."
            ></ToastMessage>

            <ToastMessage 
               severity="error" 
               openFlag={error ? true : false } 
               title='Problem while generating APS URN key.'
               message={error?.message || ""}
            ></ToastMessage>
         </>
      );
   }


   const closeHandler = () => {
      setIsUploadFileOpen(false);
      toggleUploadModalHook.setIsUploadModalOpen(false);
      setVisible(false);
   };

   useEffect(() => {
      if (allFilesUploaded) {
         setInitFileData();
         openFileDataModal();
         // setVisible(true);
      }
   }, [allFilesUploaded]);


   useEffect(() => {

      if (toggleUploadModalHook.isUploadModalOpen) {
         fileUploadDialogOpen();
      } else {
         toggleUploadModalHook.setIsUploadModalOpen(false);
      }
   }, [fileData, toggleUploadModalHook.isUploadModalOpen, folderIdHook.folderId, isUploadFileOpen]);

   const stripTimestamp = (fileName: string) => {
      const parts = fileName.split('-');
      if (parts.length > 1 && !isNaN(Number(parts[0]))) {
         const nameWithoutTimestamp = parts.slice(1).join('-');
         const extensionIndex = nameWithoutTimestamp.lastIndexOf('.');
         const baseName = nameWithoutTimestamp.substring(0, extensionIndex);
         const extension = nameWithoutTimestamp.substring(extensionIndex);
         return baseName + extension;
      }
      return fileName;
   };



   const setInitFileData = () => {

      for (let index = 0; index < fileData.length; index++) {
         const element = fileData[index][0];
         const cleanFileName = stripTimestamp(element.fileName).replace(/(\.[^.]+)\1$/, '$1');
         formik.setFieldValue(`files.${index}.fileName`, cleanFileName);
         formik.setFieldValue(`files.${index}.originalName`, element.originalName);
         formik.setFieldValue(`files.${index}.orginatorId`, "");
         formik.setFieldValue(`files.${index}.projectId`, "");
         formik.setFieldValue(`files.${index}.path`, element.path);
         formik.setFieldValue(`files.${index}.extension`, element.extension);
         formik.setFieldValue(`files.${index}.size`, element.size);
         formik.setFieldValue(`files.${index}.folderId`, folderIdHook.folderId);
         formik.setFieldValue(`files.${index}.userId`, userId);
      }

   };


   const userId = useAppSelector((state: RootState) => state.user.user.userId);
   const submitForm = async (values: FileSchemaArrayType, { resetForm, setSubmitting }: FormikHelpers<FileSchemaArrayType>) => {
      setSubmitting(true);

      const filesWithUserId = values.files.map(file => ({
         ...file,
         userId: userId ?? '',
      }));

      try {
         const response = await axios.post(`${CONFIG.server_api}files/post`, filesWithUserId, {
            headers: { 'Content-Type': 'application/json' },
         });

         if (response.status === 201) {
            setListRefresh((boolFlag: boolean) => !boolFlag);
            toggleUploadModalHook.setIsUploadModalOpen(false);
            closeHandler();
            resetForm();
            setAllFilesUploaded(false);
            const tmpFileIdsArray = [];
            for (let index = 0; index < response.data.length; index++) {
               const element = response.data[index];
               if(element.apsUrnKey === "PENDING"){
                  tmpFileIdsArray.push(element.fileId)
               }
            }
            setFileIdForURN(tmpFileIdsArray);
            setFileData([]);
         }
      } catch (error) {
         console.error('Error saving files:', error);
      } finally {
         setSubmitting(false);
      }
   }
   const formik = useFormik({
      initialValues: initValue,
      validationSchema: FileObjSchemaNew,
      onSubmit: submitForm,
   });

   return (
      <>
         <Button component="label"
            onClick={fileUploadDialogOpen}
            sx={{ borderRadius: 3 }} variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
         </Button>

         <UploadFileComponent closeSet={() => {            
            closeHandler()
         }} open={isUploadFileOpen} fileSet={setFileData}
            setAllFilesUploaded={setAllFilesUploaded}
         ></UploadFileComponent>

         {fileIdForURN.map((singleFieldId: string)=>(
            <>
               {singleFieldId ? <GenerateApsUrnKey fileId={singleFieldId} /> : ""}
            </>
         ))}

         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="1000px"
            open={visible}
            onClose={closeHandler}
         >
            <Modal.Header css={{ justifyContent: 'start' }}>
               <Text id="modal-title" h4>
                  Add new Files
               </Text>

            </Modal.Header>
            <Divider css={{ my: '$5' }} />
            <Modal.Body css={{ py: '$10' }}>
               <Box
                  id="save-file-form"
                  component="form"
                  noValidate
                  onSubmit={formik.handleSubmit}
                  sx={{ mt: 3 }}
               >

                  <TableContainer>
                     <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                           <TableRow>
                              <TableCell>
                                 <Typography variant="subtitle1" fontWeight="bold">File Name</Typography>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="subtitle1" fontWeight="bold">Revision</Typography>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="subtitle1" fontWeight="bold">Doc.Ref</Typography>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>


                           {formik.values.files.length ? formik.values.files.map((file, index) => (
                              <TableRow key={index}>
                                 <TableCell>
                                    <TextField
                                       required
                                       fullWidth
                                       id={`fileName-${index}`}
                                       name={`files.${index}.fileName`}
                                       autoComplete="fileName"
                                       value={file.fileName}
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                    />
                                 </TableCell>
                                
                                 <TableCell colSpan={1} sx={{ pr: 3 }}>
                                    <TextField
                                       required
                                       fullWidth
                                       id={`revision-${index}`}
                                       name={`files.${index}.revision`}
                                       autoComplete="revision"
                                       value={file.revision}
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                    // error={formik.touched.revision && Boolean(formik.errors.revision)}
                                    // helperText={formik.touched.revision && formik.errors.revision}

                                    />
                                 </TableCell>
                                 {/* <TableCell> */}
                                 <TableCell colSpan={1} sx={{ pr: 3 }}>
                                    <TextField
                                       required
                                       fullWidth
                                       id={`docRef-${index}`}
                                       name={`files.${index}.docRef`}
                                       autoComplete="docRef"
                                       value={file.docRef}
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                    // error={formik.touched.docRef && Boolean(formik.errors.docRef)}
                                    // helperText={formik.touched.docRef && formik.errors.docRef}
                                    />
                                 </TableCell>
                                 <TableCell>
                                    <TextField
                                       required
                                       fullWidth
                                       id={`status-${index}`}
                                       name={`files.${index}.status`}
                                       autoComplete="status"
                                       value={file.status}
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                    // error={formik.touched.status && Boolean(formik.errors.status)}
                                    // helperText={formik.touched.status && formik.errors.status}
                                    />
                                 </TableCell>

                              </TableRow>
                           )) : <TableRow><TableCell></TableCell></TableRow>}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </Box>
            </Modal.Body>
            <Divider css={{ my: '$5' }} />
            <Modal.Footer>
               {formik.isSubmitting ? <CircularProgress size={20} /> : <Button
                  style={{ borderRadius: 10 }}
                  variant="contained"
                  type='submit'
                  form="save-file-form"
               >
                  Add File
               </Button>}
            </Modal.Footer>
         </Modal>
      </>
   );
};




