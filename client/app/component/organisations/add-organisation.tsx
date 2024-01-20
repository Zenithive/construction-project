import {Divider, Modal, Text} from '@nextui-org/react';
import React from 'react';
import * as Yup from 'yup';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '../../api/project/mutations';

const OrganisationSchema = Yup.object().shape({
   contacts: Yup.string().email('Invalid email').required('Required'),
   region: Yup.string().required('Required'),
   status: Yup.string().required('Required'),
   website: Yup.string().required('Required'),
   orgName: Yup.string().required("Required"),
});

export interface OrganisationTypes {
   region: string;
   status: string;
   website: string;
   contacts: string;
   orgName: string;
   orgId: string;
 }

 export interface AddOrganisationProps {
   setListRefresh: React.Dispatch<React.SetStateAction<boolean>>
 }

export const AddOrganisation = ({setListRefresh}:AddOrganisationProps) => {
   const initValue: OrganisationTypes = {
      region: "",
      website: "",
      status: "",
      orgName: "",
      contacts: "",
      orgId: "1r"
    }

   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);
   const [createProject, { data, error, loading }] = useMutation(CREATE_PROJECT);

   const closeHandler = () => {
      setVisible(false);
      console.log('closed');
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const addNewOrganisation = async (values: OrganisationTypes,{ setSubmitting, resetForm }:any) => {
      setSubmitting(true);
      const res = await createProject({
         variables: {
            id: Math.floor(Math.random() * 10000),
            contacts: values.contacts,
            region: values.region,
            status: values.status,
            website: values.website,
            orgName: values.orgName,
            orgId: "1r"
         },
      });


      const projId:string|null = res.data?.createProject?._id;
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
      validationSchema: OrganisationSchema,
      onSubmit: addNewOrganisation,
    });

   return (
      <>
         <Button variant='contained' onClick={handler} style={{borderRadius: 10}}>
            Add Organisation
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
                  Add new organisation
               </Text>
            </Modal.Header>
            <Divider css={{my: '$5'}} />
            <Modal.Body css={{py: '$10'}}>
            <Box
               id='add-org-form'
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
                        id="orgName"
                        label="Organisation Name"
                        name="orgName"
                        autoComplete="orgName"
                        value={formik.values.orgName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orgName && Boolean(formik.errors.orgName)}
                        helperText={formik.touched.orgName && formik.errors.orgName}
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
                        name="contacts"
                        label="Contact"
                        id="contacts"
                        autoComplete="contacts"
                        value={formik.values.contacts}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contacts && Boolean(formik.errors.contacts)}
                        helperText={formik.touched.contacts && formik.errors.contacts}
                     />
                  </Grid>               
               </Grid>
          </Box>
            </Modal.Body>
            <Divider css={{my: '$5'}} />
            <Modal.Footer>
               <Button disabled={loading} style={{borderRadius: 10}} variant="contained" type='submit' form="add-org-form">
                  Add Organisation
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
