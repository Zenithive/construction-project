import {Divider, Modal, Text} from '@nextui-org/react';
import React from 'react';
import * as Yup from 'yup';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { CREATE_ORGANISATION } from '../../api/organisation/mutations';

const OrganisationSchema = Yup.object().shape({
   contact: Yup.string().required('Required'),
   region: Yup.string().required('Required'),
   website: Yup.string().required('Required'),
   orgName: Yup.string().required("Required"),
});

export interface OrganisationTypes {
   region: string;
   website: string;
   contact: string;
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
      orgName: "",
      contact: "",
      orgId: "1r"
    }

   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);
   const [createOrg, { data, error, loading }] = useMutation(CREATE_ORGANISATION);

   const closeHandler = () => {
      setVisible(false);
      formik && formik.resetForm();
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const addNewOrganisation = async (values: OrganisationTypes,{ setSubmitting, resetForm }:any) => {
      setSubmitting(true);
      const res = await createOrg({
         variables: {
            contact: values.contact,
            region: values.region,
            website: values.website,
            orgName: values.orgName,
            orgId: ""
         },
      });


      const orgId:string|null = res.data?.createOrg?.orgId;
      if(orgId){
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
         <Button variant='contained' onClick={handler} sx={{borderRadius: 3}}>
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
                        name="contact"
                        label="Contact"
                        id="contact"
                        autoComplete="contact"
                        value={formik.values.contact}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contact && Boolean(formik.errors.contact)}
                        helperText={formik.touched.contact && formik.errors.contact}
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
