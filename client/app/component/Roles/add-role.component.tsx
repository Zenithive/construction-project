import { Box, Button, Grid, Modal, TextField, Typography, colors } from "@mui/material";
import ToastMessage from "../toast-message/ToastMessage";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_ROLE } from "../../api/Roles/mutations";
import { useFormik } from "formik";
import * as Yup from 'yup';

/* eslint-disable-next-line */
export interface RolesComponentProps {
  visible: boolean;
  closeAddRole: CallableFunction;
}

const RoleSchema = Yup.object().shape({
  roleName: Yup.string().required('Required'),
});

export function AddRolesComponent(props: RolesComponentProps) {

  const [createNewRole, { data, error, loading }] = useMutation(CREATE_NEW_ROLE);

  const closeHandler = () => {
    props.closeAddRole();
  }

  const initValue = {
    roleName: ""
  }

  const addRole = async (values: {roleName: string},{ setSubmitting, resetForm }:any) => {
    setSubmitting(true);
    const res = await createNewRole({
       variables: {
          projId: "",
          roleName: values.roleName,
          roleId: "",
          orginatorId: "",
          orgId: "1r"
       },
    });


    const roleId:string|null = res.data?.createNewRole?.roleId;
    if(roleId){
       resetForm();
       closeHandler();
      //  setListRefresh((flag:boolean)=>!flag);
       //dispatch(addUser({token : token}));
       //router.push("/dashboard");
    }
    
    setSubmitting(false);
 }

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: RoleSchema,
    onSubmit: addRole,
  });
  
  return (
    <>
          {props.visible ? <Box
            id='add-role-form'
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <ToastMessage 
                  severity="success" 
                  openFlag={data?.createNewRole?.roleId ? true : false } 
                  message='Role created.'
               ></ToastMessage>

               <ToastMessage 
                  severity="error" 
                  openFlag={error ? true : false } 
                  message='Problem while creating role.'
               ></ToastMessage>

            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  id="roleName"
                  label="Role Name"
                  name="roleName"
                  autoComplete="off"
                  size="small"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.roleName && Boolean(formik.errors.roleName)}
                  helperText={formik.touched.roleName && formik.errors.roleName}
                />
              </Grid>
              <Grid item xs={1}>
                <Button disabled={loading} size="small" style={{borderRadius: 10}} form="add-role-form" variant="contained" type='submit'>
                    Submit
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button disabled={loading} size="small" onClick={closeHandler} style={{borderRadius: 10}} variant="contained" type='button' color="inherit" >
                    Cancel
                </Button>
              </Grid>

            </Grid>
          </Box> : <></>}
    </>
  );
}

export default AddRolesComponent;
