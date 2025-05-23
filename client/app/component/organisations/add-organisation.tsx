import { Divider, Modal, Text } from '@nextui-org/react';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { CREATE_ORGANISATION } from '../../api/organisation/mutations';
import { EDITE_ORGANISATION } from '../../api/organisation/mutations';

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
   organizationData: OrganisationTypes | null;
   setOrganizationData: CallableFunction;
}

export const AddOrganisation = ({ setListRefresh, organizationData, setOrganizationData }: AddOrganisationProps) => {
   const initValue: OrganisationTypes = {
      region: organizationData?.region || "",
      website: organizationData?.website || "",
      orgName: organizationData?.orgName || "",
      contact: organizationData?.contact || "",
      orgId: organizationData?.orgId || "1r"
    }


   useEffect(() => {
      if (organizationData) {
         formik.setValues(organizationData);
         handler();
      }
   }, [organizationData]);


   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);
   const [createOrg, { loading }] = useMutation(CREATE_ORGANISATION);
   const[editOrg]=useMutation(EDITE_ORGANISATION);

   const closeHandler = () => {
      setVisible(false);
      formik && formik.resetForm();
      setOrganizationData(null);
   };


   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const addNewOrganisation = async (values: OrganisationTypes, { setSubmitting, resetForm }: any) => {
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


      const orgId: string | null = res.data?.createOrg?.orgId;
      if (orgId) {
         closeHandler();
         setListRefresh((flag: boolean) => !flag);

      }

      setSubmitting(false);
   }



    const updateOrg = async (values: OrganisationTypes,{ setSubmitting, resetForm }:FormikHelpers<OrganisationTypes>) => {
      setSubmitting(true);
      const res = await editOrg({
         variables: {
            contact: values.contact,
            region: values.region,
            website: values.website,
            orgName: values.orgName,
            orgId: values.orgId,
         },
      });


      const orgId: string | null = res.data?.editOrg?.orgId;
      if (orgId) {
         closeHandler();
         setListRefresh((flag: boolean) => !flag);
         setOrganizationData(null);
      }

      setSubmitting(false);
   }

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: OrganisationSchema,
      onSubmit: organizationData ? updateOrg : addNewOrganisation,
   });

   return (
      <>
         <Button variant='contained' onClick={handler} sx={{ borderRadius: 3 }}>
            Add Organisation
         </Button>
         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler}
         >

            <Modal.Header css={{ justifyContent: 'start' }}>
               <Text id="modal-title" h4>
                  {organizationData ? "Edit Organisation" : "Add Organisation"}
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
                        InputProps={{sx: {borderRadius: 3}}}
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
                        InputProps={{sx: {borderRadius: 3}}}
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
                        InputProps={{sx: {borderRadius: 3}}}
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
                        InputProps={{sx: {borderRadius: 3}}}
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
            <Divider css={{ my: '$5' }} />
            <Modal.Footer>
               {loading ? <CircularProgress size={20} /> : <Button disabled={loading} style={{ borderRadius: 10 }} variant="contained" type='submit' form="add-org-form">
                  {organizationData ? "Edit Organisation" : "Add Organisation"}
               </Button>}
            </Modal.Footer>
         </Modal>
      </>
   );
};
