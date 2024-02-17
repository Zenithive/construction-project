import {Divider, Modal, Text} from '@nextui-org/react';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import ToastMessage from '../toast-message/ToastMessage';
import { Box, Button, Grid, TextField } from '@mui/material';
import { CREATE_PROJECT } from '../../api/project/mutations';


export interface ProjectTypes {
   projName: string;
   region: string;
   status: string;
   website: string;
   orgName: string;
   orgId: string;
 }

export interface AddProjectProps {
   setListRefresh: React.Dispatch<React.SetStateAction<boolean>>
 }


const ProjectSchema = Yup.object().shape({
   projName: Yup.string().required('Required'),
   region: Yup.string().required('Required'),
   status: Yup.string().required('Required'),
   website: Yup.string().required('Required'),
   orgName: Yup.string().required("Required"),
});

export const AddProject = ({setListRefresh}:AddProjectProps) => {
   const initValue: ProjectTypes = {
      projName: "",
      region: "",
      website: "",
      status: "",
      orgName: "",
      orgId: "1r"
    }
    
   const [createProject, { data, error, loading }] = useMutation(CREATE_PROJECT);
   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);

   const closeHandler = () => {
      setVisible(false);
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const addProject = async (values: ProjectTypes,{ setSubmitting, resetForm }:any) => {
      setSubmitting(true);
      const res = await createProject({
         variables: {
            projId: "",
            projName: values.projName,
            region: values.region,
            status: values.status,
            website: values.website,
            orgName: values.orgName,
            orgId: "1r"
         },
      });


      const projId:string|null = res.data?.createProject?.projId;
      if(projId){
         resetForm();
         closeHandler();
         setListRefresh((flag:boolean)=>!flag);
         //dispatch(addUser({token : token}));
         //router.push("/dashboard");
      }
      
      setSubmitting(false);
   }

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: ProjectSchema,
      onSubmit: addProject,
    });

   return (
      <>
         <Button variant='contained' onClick={handler} sx={{borderRadius: 3}}>
            Add Project
         </Button>

         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler}
         >
            <Modal.Header css={{justifyContent: 'start'}}>
               <Text id="modal-title" h4>
                  Add new project
               </Text>

               <ToastMessage 
                  severity="success" 
                  openFlag={data?.createProject?._id ? true : false } 
                  message='Project created.'
               ></ToastMessage>

               <ToastMessage 
                  severity="error" 
                  openFlag={error ? true : false } 
                  message='Problem while creating project.'
               ></ToastMessage>
            </Modal.Header>
            <Divider css={{my: '$5'}} />
            <Modal.Body css={{py: '$10'}}>
            <Box
               id='add-project-form'
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
                        id="projName"
                        label="Project Name"
                        name="projName"
                        autoComplete="projName"
                        value={formik.values.projName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.projName && Boolean(formik.errors.projName)}
                        helperText={formik.touched.projName && formik.errors.projName}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        name="region"
                        label="Region"
                        id="region"
                        autoComplete="region"
                        value={formik.values.region}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.region && Boolean(formik.errors.region)}
                        helperText={formik.touched.region && formik.errors.region}
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
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        name="website"
                        label="Website"
                        id="website"
                        autoComplete="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.website && Boolean(formik.errors.website)}
                        helperText={formik.touched.website && formik.errors.website}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        name="orgName"
                        label="Organisation Name"
                        id="orgName"
                        autoComplete="orgName"
                        value={formik.values.orgName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orgName && Boolean(formik.errors.orgName)}
                        helperText={formik.touched.orgName && formik.errors.orgName}
                     />
                  </Grid>               
               </Grid>
          </Box>
            </Modal.Body>
            <Divider css={{my: '$5'}} />
            <Modal.Footer>
               <Button disabled={loading} style={{borderRadius: 10}} variant="contained" type='submit' form="add-project-form">
                  Add Project
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
