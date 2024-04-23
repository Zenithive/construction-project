import { Box, Button, Divider, Grid, IconButton, MenuItem, Modal, Menu, Typography, ListItemText } from "@mui/material";
import { Tooltip } from '@nextui-org/react';
import { DeleteIcon } from '../icons/table/delete-icon';
import ToastMessage from "../toast-message/ToastMessage";
import AddRolesComponent from "./add-role.component";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ROLES } from "../../api/Roles/queries";
import { GET_USERS } from "../../api/user/queries"
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useMutation } from "@apollo/client";
import { DELETE_Role } from "../../api/Roles/mutations";
import Chip from '@mui/material/Chip';
import { UPDATE_Role } from "../../api/Roles/mutations";


/* eslint-disable-next-line */
export interface RolesComponentProps {
  visible: boolean;
  closeRoleModel: CallableFunction;
  clearProjId: CallableFunction;
  projId: string;
  userData: { userId: string; firstName: string; }[];
  roleId: string;
  roleName: string;

}

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

export function RolesComponent(props: RolesComponentProps) {

  const [showAddRole, setShowAddRole] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleUsers, setSelectedRoleUsers] = useState<{ [key: string]: string[] }>({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [GetRoles, { data: rolesData, error: rolesError, refetch: refetchRoles }] = useLazyQuery(GET_ROLES);
  const [getUsers, { data: usersData, loading: usersLoading, error: usersError }] = useLazyQuery(GET_USERS);


  console.log("userData", usersData)
  const [deleterole] = useMutation(DELETE_Role);

  const handleDeleteRole = async (roleId: string) => {
    console.log("roleId", roleId)
    try {
      // Execute the deleteProject mutation with the projectId as variable
      await deleterole({ variables: { roleId } });
      // Refetch projects after deletion
      refetchRoles();
    } catch (error) {
      console.error('Error deleting Role:', error);
    }
  };

  const [updateRole] = useMutation(UPDATE_Role);

  const handleUpdate = async () => {
    try {

      const arrayTmp = [];

      for (const key in selectedRoleUsers) {
        if (Object.prototype.hasOwnProperty.call(selectedRoleUsers, key)) {
          const element = selectedRoleUsers[key];
          arrayTmp.push({
            roleId: key,
            userIds: selectedRoleUsers[key]
          })
        }
      }

      console.log("arrayTmp", arrayTmp)
      console.log("selectedRoleUsers", selectedRoleUsers)



      await updateRole({
        variables: arrayTmp
      });

      console.log("Roles updated successfully!");
    } catch (error) {
      console.error('Error updating roles:', error);
    }
  };





  useEffect(() => {
    if (props.projId) {
      GetRoles({
        variables: {
          projId: props.projId
        }
      });
    }
  }, [props.projId]);

  useEffect(() => {
    if (props.visible) {
      getUsers({
        variables: { pageSize: -1, currentPage: -1 },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "network-only"

      });
    }
  }, [props.visible]);

  useEffect(() => {
    if (rolesData && rolesData.getRoles) {
      const initialSelectedRoleUsers: { [key: string]: string[] } = {};
      rolesData.getRoles.forEach((role: any) => {
        initialSelectedRoleUsers[role.roleId] = [];
      });
      setSelectedRoleUsers(initialSelectedRoleUsers);
      setRoles(rolesData.getRoles);
    }
  }, [rolesData]);


  const closeAddRole = () => {
    setShowAddRole(false);
    refetchRoles();
  }

  const closeHandler = () => {
    props.closeRoleModel()
    props.clearProjId()
  }



  const handleChange = (event: SelectChangeEvent<string[]>, roleId: string, child: any) => {
    const {
      target: { value },
    } = event;

    setSelectedRoleUsers((prevUsers: { [key: string]: string[] }) => ({
      ...prevUsers,
      [roleId]: value as string[],
    }));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.visible}
      onClose={closeHandler}
    >
      <Box sx={{ bgcolor: "white", width: "80%", marginX: "auto", marginY: 4, borderRadius: 3 }}>
        <Box sx={{ paddingX: 3, paddingY: 2, }} component={"div"}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={1}>
              <Typography id="modal-title" component={"h4"}>
                Roles
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowAddRole(true)} size="small">
                Add new Role
              </Button>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'end' }}>
              <IconButton aria-describedby="id" onClick={closeHandler} sx={{ p: 0, right: 0 }}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={20}>
              <Menu
                id="users-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
              </Menu>
            </Grid>
          </Grid>
          <ToastMessage severity="error" openFlag={rolesError || usersError ? true : false} message="Problem while fetching data." />
        </Box>
        <Divider sx={{ my: '$5' }} />

        <Box sx={{ px: 3 }}>
          <AddRolesComponent projId={props.projId} visible={showAddRole} closeAddRole={closeAddRole} />
        </Box>

        <Box sx={{ pb: 4, overflow: 'hidden' }}>
          {roles.map((rolesData, index) => (
            <React.Fragment key={index}>
              <Grid sx={{ display: 'flex', py: 1 }} container spacing={3}>
                <Grid item xs={1}>{rolesData.roleName !== 'Admin' ? (
                  <Tooltip
                    content="Delete Role"
                    color="error"
                    onClick={() => handleDeleteRole(rolesData.roleId)}
                  >
                    <IconButton sx={{ pl: 3 }}>
                      <DeleteIcon size={20} fill="#FF0080" />
                    </IconButton>
                  </Tooltip>
                ) : ""}</Grid>
                <Grid item xs={3}>{rolesData.roleName}</Grid>
                <Grid item xs={8} sx={{ pr: 4 }}>
                  <Select
                    sx={{ width: '100%' }}
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedRoleUsers[rolesData.roleId] || []}
                    onChange={(event, child) => handleChange(event, rolesData.roleId, child)}
                    input={<OutlinedInput label="Users" id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedRoleUsers[rolesData.roleId]?.map((userId) => (
                          <Chip key={userId} label={usersData?.getUsers.users.find((user: any) => user.userId === userId)?.firstName} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {usersData?.getUsers?.users?.map((users: any) => {
                      return (
                        <MenuItem key={users.userId} value={users.userId}>
                          <Checkbox checked={(selectedRoleUsers[rolesData.roleId] || []).includes(users.userId)} />
                          <ListItemText primary={users.firstName} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>

              </Grid>
              <Divider sx={{ my: '$5' }} />

            </React.Fragment>
          ))}
          <Box sx={{ pb: 2, overflow: 'hidden' }}>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', pr: 4, pt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default RolesComponent;
