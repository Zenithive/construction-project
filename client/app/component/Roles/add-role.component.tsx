import { Box, Button, Checkbox, Chip, Grid, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField} from "@mui/material";
import ToastMessage from "../toast-message/ToastMessage";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_ROLE } from "../../api/Roles/mutations";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";
import { UserTypes } from "../users/add-user";

/* eslint-disable-next-line */
export interface RolesComponentProps {
  visible: boolean;
  closeAddRole: ()=> void;
  projId: string;
  roleId?: string;
  usersData: Array<UserTypes>
}

export interface RoleFormValues {
  roleName: string;
  users: Array<string>;
}

export interface RolesSchema{
  roleName: string;
  roleId: string;
  orginatorId: string;
  users: Array<string>;
  orgId: string;
  projId: string;
}

const RoleSchema = Yup.object().shape({
  roleName: Yup.string().required('Required'),
  users: Yup.array().of(Yup.string().required("String is required"))
});

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function AddRolesComponent(props: RolesComponentProps) {

  const [createNewRole, { data, error, loading }] = useMutation(CREATE_NEW_ROLE);
  const [selectedRoleUsers, setSelectedRoleUsers] = useState<Array<string>>([]);

  const closeHandler = () => {
    props.closeAddRole();
    setSelectedRoleUsers([]);
  }

  const initValue: RoleFormValues = {
    roleName: "",
    users: []
  }

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    console.log("value", value)
    setSelectedRoleUsers(value as Array<string>);
  };

  const addRole = async (values: RoleFormValues,{ setSubmitting, resetForm }:FormikHelpers<RoleFormValues> ) => {
    setSubmitting(true);
    const res = await createNewRole({
       variables: {
          projId: props.projId,
          roleName: values.roleName,
          roleId: "",
          orginatorId: "",
          orgId: "1r",
          users: selectedRoleUsers
       },
    });


    const roleId:string|null = res.data?.createNewRole?.roleId;
    if(roleId){
       resetForm();
       closeHandler();
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
                <Select
                    sx={{ width: '100%', height: '40px' }}
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedRoleUsers || []}
                    onChange={(event) => handleChange(event)}
                    input={<OutlinedInput label="Users" id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedRoleUsers?.map((userId) => (
                          <Chip key={userId} label={props.usersData.find((user: UserTypes) => user.userId === userId)?.firstName} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {props.usersData.map((users: UserTypes) => {
                      return (
                        <MenuItem key={users.userId} value={users.userId}>
                          <Checkbox checked={(selectedRoleUsers || []).includes(users.userId)} />
                          <ListItemText primary={users.firstName} />
                        </MenuItem>
                      );
                    })}
                  </Select>
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
