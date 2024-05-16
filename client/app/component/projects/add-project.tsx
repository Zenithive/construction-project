import {Divider, Modal, Text} from '@nextui-org/react';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import ToastMessage from '../toast-message/ToastMessage';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import { CREATE_PROJECT } from '../../api/project/mutations';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '../../reducers/hook.redux';
import { GET_ALL_ORG } from '../../api/organisation/queries';
import { OrganisationTypes } from '../organisations/add-organisation';


export interface ProjectTypes {
   projName: string;
   region: string;
   status: string;
   website: string;
   orgName: string;
   orgId: string;
   projId?: string;
 }

export interface AddProjectProps {
   setListRefresh: React.Dispatch<React.SetStateAction<boolean>>
 }


const ProjectSchema = Yup.object().shape({
   projName: Yup.string().required('Required'),
   region: Yup.string().required('Required'),
   status: Yup.string().required('Required'),
   website: Yup.string().required('Required'),
   orgId: Yup.string().required("Required"),
});

export const AddProject = ({setListRefresh}:AddProjectProps) => {
   const [orgListKeyPair, setOrgListKeyPair] = React.useState<{ key: string; value: string }[]>([]);
   const userDetails:UserSchema = useAppSelector(selectUserSession);
   const [visible, setVisible] = React.useState(false);

   const { data: organizationData, refetch: refetchOrg } = useQuery(GET_ALL_ORG, {
      skip: !visible,
   });
   
   const initValue: ProjectTypes = {
      projName: "",
      region: "",
      website: "",
      status: "",
      orgName: "",
      orgId: ""
    }
    
   const [createProject, { data, error, loading }] = useMutation(CREATE_PROJECT);
   
   const handler = () => setVisible(true);

   const closeHandler = () => {
      setVisible(false);
   };

   useEffect(() => {
      if (visible) {
         refetchOrg();
      }
   }, [visible]);

   useEffect(() => {
      if (organizationData && organizationData.getAllOrganisation) {
         const tmpOrgList = organizationData.getAllOrganisation.map((elem:OrganisationTypes)=>{
            return {
               key: elem.orgId,
               value: elem.orgName
            }
         });
         setOrgListKeyPair(tmpOrgList)
      }
      else{
         setOrgListKeyPair([])

      }
   }, [organizationData]);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const addProject = async (values: ProjectTypes,{ setSubmitting, resetForm }:any) => {
      setSubmitting(true);
      const res = await createProject({
         variables: {
            projId:"",
            orginatorId: userDetails.userId,
            projName: values.projName,
            region: values.region,
            status: values.status,
            website: values.website,
            orgName: values.orgName,
            orgId: values.orgId
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
                        InputProps={{sx: {borderRadius: 3}}}
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
                        InputProps={{sx: {borderRadius: 3}}}
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
                     {/* <TextField
                        required
                        fullWidth
                        name="orgName"
                        InputProps={{sx: {borderRadius: 3}}}
                        label="Organisation Name"
                        id="orgName"
                        autoComplete="orgName"
                        value={formik.values.orgName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.orgName && Boolean(formik.errors.orgName)}
                        helperText={formik.touched.orgName && formik.errors.orgName}
                     /> */}

                        {orgListKeyPair.length ? (
                           <Autocomplete
                              disablePortal
                              onChange={(e, value) => {formik.setFieldValue("orgId", value?.key ? value.key : "");formik.setFieldValue("orgName", value?.value ? value.value : "")}}
                              getOptionLabel={(option) => option.value}
                              value={orgListKeyPair.find((org) => org.key === formik.values.orgId) || null}
                              includeInputInList
                              options={orgListKeyPair || []}
                              renderInput={(params) => (
                              <TextField
                                 {...params}
                                 id='orgId'
                                 InputProps={{...params.InputProps,sx: {borderRadius: 3}}}
                                 name="orgId"
                                 value={formik.values.orgId}
                                 label="Organisation"
                                 error={formik.touched.orgId && Boolean(formik.errors.orgId)}
                                 helperText={formik.touched.orgId && formik.errors.orgId}
                              />
                              )}
                           />
                        ) : (
                           ""
                        )}
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
