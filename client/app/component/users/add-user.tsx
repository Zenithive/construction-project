import { Divider, Modal, Text } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { Autocomplete, Box, Button, Grid, TextField    } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import {  useMutation } from '@apollo/client';
import { SUBSCRIPTION_LIST } from '../../constants/subscription.constant';
import { CREATE_USER_BY_ADMIN } from '../../api/user/mutations';
import ToastMessage from '../toast-message/ToastMessage';
import { EDITE_USER } from '../../api/user/mutations';
import { useQuery } from '@apollo/client';
import { GET_ALL_ORG } from '../../api/organisation/queries';
import {Stack} from "@mui/material"
import { OrganisationTypes } from '../organisations/add-organisation';


const UserSchema = Yup.object().shape({
   phoneNo: Yup.number().required('Required'),
   email: Yup.string().email('Invalid email').required('Required'),
   lastName: Yup.string().required('Required'),
   firstName: Yup.string().required('Required'),
   subscriptionId: Yup.number().required('Required'),
   orgId: Yup.string().required('Required'),
});

export interface UserTypes {
   email: string;
   lastName: string;
   firstName: string;
   userId: string;
   phoneNo?: string | "";
   subscriptionId?: number;
   orgId?: string;
}

export interface AddUserProps {
   setListRefresh: React.Dispatch<React.SetStateAction<boolean>>
   userData: UserTypes | null;
   setUSERDATA: CallableFunction;
}

export const AddUser = ({ setListRefresh, userData, setUSERDATA }: AddUserProps) => {

   const initValue: UserTypes = {
      email: userData?.email || "",
      lastName: userData?.lastName || "",
      firstName: userData?.firstName || "",
      userId: userData?.userId || "",
      phoneNo: userData?.phoneNo || "",
      subscriptionId: userData?.subscriptionId || 1,
      orgId: userData?.orgId || '',
   }




   useEffect(() => {
      if (userData) {
         formik.setValues(userData);
         formik.setFieldValue("subscriptionId", (userData.subscriptionId && userData.subscriptionId > -1) ? userData.subscriptionId : "");
         handler();
      }
   }, [userData]);


   const defaultSubscriptionOption = SUBSCRIPTION_LIST.find((elem) => elem.key === initValue.subscriptionId);
   const [visible, setVisible] = React.useState(false);
   const [orgListKeyPair, setOrgListKeyPair] = React.useState<{ key: string; value: string }[]>([]);
   const handler = () => setVisible(true);

   const { data: organizationData, refetch: refetchOrg } = useQuery(GET_ALL_ORG, {
      skip: !visible,
   });

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

   const closeHandler = () => {
      setVisible(false);
      formik && formik.resetForm();
      setUSERDATA(null);
   };
   const [createUserByAdmin, { data, error, loading }] = useMutation(CREATE_USER_BY_ADMIN);

 
   const addNewUser = async (values: UserTypes, { setSubmitting }: FormikHelpers<UserTypes>) => {
      setSubmitting(true);
      const res = await createUserByAdmin({
         variables: {
            email: values.email,
            userId: "",
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNo: values.phoneNo,
            orgId:values.orgId,
            subscriptionId: values.subscriptionId
         },
      });


      const userEmail: string | null = res.data?.createUserByAdmin?.email;
      if (userEmail) {
         closeHandler();
         setListRefresh((flag: boolean) => !flag);
      }

      setSubmitting(false);
   }

   const [editUser] = useMutation(EDITE_USER);

   const UpdateUsers = async (values: UserTypes, { setSubmitting }: FormikHelpers<UserTypes>) => {
      setSubmitting(true);
      const res = await editUser({
         variables: {
            email: values.email,
            userId: values.userId,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNo: values.phoneNo,
            orgId: values.orgId,
            subscriptionId: values.subscriptionId
         },
      });

      const userEmail: string | null = res.data?.editUser?.email;
      if (userEmail) {
         closeHandler();
         setListRefresh((flag: boolean) => !flag);
         setUSERDATA(null);
      }

      setSubmitting(false);
   }

   const handleSubmitMethod = (values: UserTypes, formikProps: FormikHelpers<UserTypes>) => {
      if (userData) {
         UpdateUsers(values, formikProps);
      } else {
         const selectedOrg = orgListKeyPair.find((org) => org.key === values.orgId);
         const orgId = selectedOrg ? selectedOrg.key : '';
         addNewUser({ ...values, orgId }, formikProps);
      }
   }

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: UserSchema,
      onSubmit: handleSubmitMethod,
   });


   return (
      <>
         <Button variant='contained' onClick={handler} sx={{ borderRadius: 3 }}>
            Add User
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
                  {userData ? "Edit User" : "Add User"}
               </Text>

               <ToastMessage
                  severity="success"
                  openFlag={data?.createUserByAdmin?.email ? true : false}
                  message='User created.'
               ></ToastMessage>

               <ToastMessage
                  severity="error"
                  openFlag={error ? true : false}
                  message='Problem while creating user.'
               ></ToastMessage>
            </Modal.Header>
            <Divider css={{ my: '$5' }} />
            <Modal.Body css={{ py: '$10' }}>
               <Box
                  id='add-user-form'
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
                           id="firstName"
                           label="First Name"
                           name="firstName"
                           autoComplete="firstName"
                           value={formik.values.firstName}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                           helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           required
                           fullWidth
                           InputProps={{sx: {borderRadius: 3}}}
                           name="lastName"
                           label="Last Name"
                           id="lastName"
                           autoComplete="lastName"
                           value={formik.values.lastName}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                           helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           required
                           fullWidth
                           InputProps={{sx: {borderRadius: 3}}}
                           name="email"
                           label="Email"
                           id="email"
                           autoComplete="email"
                           value={formik.values.email}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           error={formik.touched.email && Boolean(formik.errors.email)}
                           helperText={formik.touched.email && formik.errors.email}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           required
                           fullWidth
                           InputProps={{sx: {borderRadius: 3}}}
                           name="phoneNo"
                           label="Phon No"
                           id="phoneNo"
                           autoComplete="phoneNo"
                           value={formik.values.phoneNo}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                           helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                        />
                     </Grid>
                     <Grid item xs={12}>
                     <Stack spacing={3} sx={{ width: 550 }}>
                        {orgListKeyPair.length ? (
                           <Autocomplete
                              disablePortal
                              onChange={(e, value) => formik.setFieldValue("orgId", value?.key ? value.key : "")}
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
                        </Stack>
                     </Grid>
                     <Grid item xs={12}>
                        <Autocomplete
                           disablePortal
                           onChange={(e, value) => formik.setFieldValue("subscriptionId", (value?.key && value.key > -1) ? value.key : "")}
                           getOptionLabel={(option) => option.value}
                           defaultValue={defaultSubscriptionOption}
                           componentName='subscriptionId'
                           includeInputInList
                           options={SUBSCRIPTION_LIST}
                           renderInput={
                              (params) =>
                                 <TextField
                                    {...params}
                                    InputProps={{...params.InputProps,sx: {borderRadius: 3}}}
                                    id='subscriptionId'
                                    name="subscriptionId"
                                    value={formik.values.subscriptionId}
                                    label="Subscription"
                                    error={formik.touched.subscriptionId && Boolean(formik.errors.subscriptionId)}
                                    helperText={formik.touched.subscriptionId && formik.errors.subscriptionId}
                                 />
                           }
                        />
                     </Grid>
                  </Grid>
               </Box>
            </Modal.Body>
            <Divider css={{ my: '$5' }} />
            <Modal.Footer>
               <Button disabled={loading} style={{ borderRadius: 10 }} variant="contained" type='submit' form="add-user-form">
                  {userData ? "Edit User" : "Add User"}
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
