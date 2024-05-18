import { Box, Button, Checkbox, Chip, Grid, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField} from "@mui/material";
import ToastMessage from "../toast-message/ToastMessage";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_ROLE } from "../../api/Roles/mutations";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';
import { useState, useEffect } from "react";
import { UserTypes } from "../users/add-user";
import { EDITE_ROLES } from "../../api/Roles/mutations";
import { Role, User } from "./role.component";

export interface RolesComponentProps {
  visible: boolean;
  closeAddRole: () => void;
  projId: string;
  roleId?: string;
  roleDetails?: Role | null;
  usersData: User[];
   onUserSelectionChange?: (selectedUsers: string[]) => void;
  editable?:boolean;
}


export interface RoleFormValues {
  roleName: string;
  users: string[];
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
  const [createNewRole, { data: createData, error: createError, loading: createLoading }] = useMutation(CREATE_NEW_ROLE);
  const [editRole, {  error: updateError, loading: updateLoading }] = useMutation(EDITE_ROLES);
  const [selectedRoleUsers, setSelectedRoleUsers] = useState<string[]>([]);

  useEffect(() => {
    console.log("props.roleDetails", props.roleDetails)
    if (props.roleDetails && props.roleDetails.users) {
      setSelectedRoleUsers(props.roleDetails.users);
    } else {
      setSelectedRoleUsers([]); 
    }
  }, [props.roleDetails]);

  const closeHandler = () => {
    props.closeAddRole();
    setSelectedRoleUsers([]);
  };

  const initialValues: RoleFormValues = props.roleDetails ? {
    roleName: props.roleDetails.roleName,
    users: props.roleDetails.users
  } : {
    roleName: "",
    users: [],
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedRoleUsers(value as string[]);
  };

  const addOrUpdateRole = async (values: RoleFormValues, { setSubmitting, resetForm }: FormikHelpers<RoleFormValues>) => {
    setSubmitting(true);
    try {
      if (props.roleDetails) { 
        await editRole({
          variables: {
            roleId: props.roleDetails.roleId,
            roleName: values.roleName,
            orginatorId: "",
            projId: props.projId,
            orgId: "1r",
            users: selectedRoleUsers
          },
        });
      } else { 
        await createNewRole({
          variables: {
            roleName: values.roleName,
            roleId: "",
            orginatorId: "",
            projId: props.projId,
            orgId: "1r",
            users: selectedRoleUsers
          },
        });
      }
      resetForm();
      closeHandler();
    } catch (error) {
      console.error('Error:', error);
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RoleSchema,
    onSubmit: addOrUpdateRole,
  });

  return (
    <>
      {props.visible ? 
        <Box
          id='add-role-form'
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 3 }}
        >
          <ToastMessage
            severity="success"
            openFlag={createData?.createNewRole?.roleId ? true : false}
            message='Role created.'
          />
          <ToastMessage
            severity="error"
            openFlag={createError || updateError ? true : false}
            message='Problem while creating or updating role.'
          />  
          <Grid container spacing={2}>
            <Grid item xs={3}>
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
                value={formik.values.roleName}
                disabled={props.roleDetails?.isDefaultRole || false}
              />
            </Grid>
            <Grid item xs={7}>
              <Select
                sx={{ width: '100%' ,position:"relative",bottom:10}}
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedRoleUsers || []}
                onChange={(event) => handleChange(event)}
                input={<OutlinedInput label="Users" id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: "wrap", gap: 0.5 }}>
                  {selectedRoleUsers?.map((userId) => {
                      const user = props.usersData.find((user: User) => user.userId === userId) as UserTypes; 
                      return (
                        <Chip key={userId} label={`${user?.firstName} ${user?.lastName}`} /> 
                  )})}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {props.usersData.map((user: User) => {
                  return (
                    <MenuItem key={user.userId} value={user.userId}>
                      <Checkbox checked={(selectedRoleUsers || []).includes(user.userId)} />
                      <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={1}>
              <Button disabled={createLoading || updateLoading} size="small" style={{ borderRadius: 10}} form="add-role-form" variant="contained" type='submit'>
                Submit
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button disabled={createLoading || updateLoading} size="small" onClick={closeHandler} style={{ borderRadius: 10 }} variant="contained" type='button' color="inherit" >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box> 
      : <></>}
    </>
  );
}

export default AddRolesComponent;
