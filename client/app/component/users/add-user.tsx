import {Divider, Modal, Text} from '@nextui-org/react';
import React,{useEffect} from 'react';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { SUBSCRIPTION_LIST } from '../../constants/subscription.constant';
import { CREATE_USER_BY_ADMIN } from '../../api/user/mutations';
import ToastMessage from '../toast-message/ToastMessage';
import { EDITE_USER } from '../../api/user/mutations';



const UserSchema = Yup.object().shape({
   phoneNo: Yup.number().required('Required'),
   email: Yup.string().email('Invalid email').required('Required'),
   lastName: Yup.string().required('Required'),
   firstName: Yup.string().required('Required'),
   subscriptionId: Yup.number().required('Required'),
   //billToOrgId: Yup.string().required('Required'),
});

export interface UserTypes {
   email: string;
   lastName: string;
   firstName: string;
   userId: string;
   phoneNo?: string | "";
   subscriptionId?: number;
 }

 export interface AddUserProps {
   setListRefresh: React.Dispatch<React.SetStateAction<boolean>>
   userData:UserTypes|null;
   setUSERDATA:CallableFunction;
 }

export const AddUser = ({setListRefresh,userData,setUSERDATA}:AddUserProps) => {
   const initValue: UserTypes = {
      email:userData?.email||"",
      lastName:userData?.lastName|| "",
      firstName:userData?.firstName||"",
      userId: userData?.userId||"",
      phoneNo:userData?.phoneNo|| "",
      subscriptionId:userData?.subscriptionId||1
   }

   useEffect(() => {
      if (userData) {
         console.log("userData", userData)
         formik.setValues(userData); 
         formik.setFieldValue("subscriptionId", (userData.subscriptionId && userData.subscriptionId > -1) ? userData.subscriptionId : "");
         handler();
         //userData ? UpdateUsers : 
      }
   }, [userData]);
   

   const defaultSubscriptionOption = SUBSCRIPTION_LIST.find((elem) => elem.key === initValue.subscriptionId);
   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);

 
   const closeHandler = () => {
      setVisible(false);
      formik && formik.resetForm();
      setUSERDATA(null);
   };
   const [createUserByAdmin, { data, error, loading }] = useMutation(CREATE_USER_BY_ADMIN);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const addNewUser = async (values: UserTypes,{ setSubmitting }:any) => {
      console.log("createUser",createUserByAdmin)
      console.log("values",values)
      setSubmitting(true);
      const res = await createUserByAdmin({
         variables: {
            email: values.email,
            userId: "",
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNo: values.phoneNo,
            subscriptionId: values.subscriptionId
         },
      });


      const userEmail:string|null = res.data?.createUserByAdmin?.email;
      if(userEmail){
         closeHandler();
         setListRefresh((flag:boolean)=>!flag);
      }
      
      setSubmitting(false);
   }

   const [editUser]=useMutation(EDITE_USER);

    const UpdateUsers = async (values: UserTypes,{ setSubmitting }:any) => {
      console.log("editUser",editUser);
      console.log("values",values)
      setSubmitting(true);
      const res = await editUser({
         variables: {
            email: values.email,
            userId: values.userId,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNo: values.phoneNo,
            subscriptionId: values.subscriptionId
         },
      });
      console.log("res",res);

      const userEmail:string|null = res.data?.editUser?.email;
      if(userEmail){
         closeHandler();
         setListRefresh((flag:boolean)=>!flag);
         setUSERDATA(null);
      }
      
      setSubmitting(false);
      console.log(UpdateUsers);
   }

   const handleSubmitMethod = (values: UserTypes,{ setSubmitting }:any) => {
      if(userData){
         UpdateUsers(values,{ setSubmitting });
      }else{

         addNewUser(values,{ setSubmitting });
      }
   }

   const formik = useFormik({
      initialValues: initValue,
      validationSchema: UserSchema,
      onSubmit: handleSubmitMethod,
    });


   return (
      <>
         <Button variant='contained' onClick={handler} sx={{borderRadius: 3}}>
            Add User
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
               {userData ? "Edit User" : "Add User"}
               </Text>

               <ToastMessage 
                  severity="success" 
                  openFlag={data?.createUserByAdmin?.email ? true : false } 
                  message='User created.'
               ></ToastMessage>

               <ToastMessage 
                  severity="error" 
                  openFlag={error ? true : false } 
                  message='Problem while creating user.'
               ></ToastMessage>
            </Modal.Header>
            <Divider css={{my: '$5'}} />
            <Modal.Body css={{py: '$10'}}>
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
                                 id='subscriptionId'
                                 name="subscriptionId"                         
                                 value={ formik.values.subscriptionId } 
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
            <Divider css={{my: '$5'}} />
            <Modal.Footer>
               <Button disabled={loading} style={{borderRadius: 10}} variant="contained" type='submit' form="add-user-form">
               {userData ? "Edit User" : "Add User"}
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
