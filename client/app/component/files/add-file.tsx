import { Divider, Modal, Text } from '@nextui-org/react';
import Button from '@mui/material/Button';
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UploadFileComponent } from './upload.file.component';
import ToastMessage from '../toast-message/ToastMessage';
import { Box, Grid, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SAVE_FILE_DATA } from '../../api/file/mutations';
import { toggleUploadModalInterface, FolderIdInterface } from 'client/app/files/page';
import { useAppDispatch, useAppSelector } from 'client/app/reducers/hook.redux';
import { addUser } from 'client/app/reducers/userReducer';

import { useQuery } from '@apollo/client';
import { GET_FILES_BY_FOLDER_ID } from 'client/app/api/file/queries';
import { CONFIG } from 'client/app/constants/config.constant';
import axios from 'axios';
import { useRouter } from 'next/router';
import { RootState } from 'client/app/reducers/store';



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
   const [fileData, setFileData] = useState([] as Array<FileMetadataType>);
   const [saveFileData, { data, error, loading }] = useMutation(SAVE_FILE_DATA);
   const [allFilesUploaded, setAllFilesUploaded] = useState(false); // Flag for all files uploaded
   const openFileDataModal = () => setVisible(true);
   const fileUploadDialogOpen = () => setIsUploadFileOpen(true);


   const closeHandler = () => {
      setVisible(false);
      // formik.resetForm(); // remove 
   };


   useEffect(() => {
      console.log("fileData", fileData)
      console.log("folderIdHook.folderId", folderIdHook.folderId)

      if (allFilesUploaded) {
         setInitFileData();
         openFileDataModal();
         // setVisible(true);
      }

      if (toggleUploadModalHook.isUploadModalOpen) {
         fileUploadDialogOpen();
      } else {
         toggleUploadModalHook.setIsUploadModalOpen(false);
      }
   }, [fileData, toggleUploadModalHook.isUploadModalOpen, folderIdHook.folderId, isUploadFileOpen, allFilesUploaded]);

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
         // const cleanFileName = stripTimestamp(element.fileName);
         const cleanFileName = stripTimestamp(element.fileName).replace(/(\.[^.]+)\1$/, '$1');
         console.log("element", element)
         // formik.setFieldValue(`files.${index}.fileName`, element.fileName);
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

      console.log("formik.value", formik.values)

   };


   const userId = useAppSelector((state: RootState) => state.user.user.userId);
   // console.log("userId", userId)
   const submitForm = async (values: FileSchemaArrayType, { resetForm, setSubmitting }: FormikHelpers<FileSchemaArrayType>) => {
      setSubmitting(true);


      const filesWithUserId = values.files.map(file => ({
         ...file,
         userId: userId ?? '', // Ensure userId is added to each file object
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
            setIsUploadFileOpen(false);
            toggleUploadModalHook.setIsUploadModalOpen(false);
            closeHandler()
         }} open={isUploadFileOpen} fileSet={setFileData}
            setAllFilesUploaded={setAllFilesUploaded}
         ></UploadFileComponent>



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
               {/* {JSON.stringify(formik)} */}
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
                                 {/* <TableCell colSpan={3}> Set colSpan to the number of columns you want it to span */}
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

                                 {/* <TableCell colSpan={1} sx={{ pr: 3 }}>
                                    <Select
                                       required
                                       fullWidth
                                       id={`status-${index}`}
                                       name={`files.${index}.status`}
                                       value={file.status}
                                       onChange={formik.handleChange}
                                       onBlur={formik.handleBlur}
                                    >
                                       <MenuItem value="Open">Open</MenuItem>
                                       <MenuItem value="Closed">Closed</MenuItem>
                                    </Select>
                                 </TableCell>  */}
                              </TableRow>
                           )) : <TableRow><TableCell>""</TableCell></TableRow>}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </Box>
            </Modal.Body>
            <Divider css={{ my: '$5' }} />
            <Modal.Footer>
               <Button
                  disabled={loading}
                  style={{ borderRadius: 10 }}
                  variant="contained"
                  type='submit'
                  form="save-file-form"
               >
                  Add File
               </Button>
            </Modal.Footer>
         </Modal>



      </>
   );
};




