import { Box, Button, Divider, Grid, IconButton, Modal, Menu, Typography} from "@mui/material";
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
import { useMutation } from "@apollo/client";
import { DELETE_Role } from "../../api/Roles/mutations";
import { RoleUsersList } from "./role-users-list.component";

/* eslint-disable-next-line */
export interface RolesComponentProps {
  visible: boolean;
  closeRoleModel: CallableFunction;
  clearProjId: CallableFunction;
  projId: string;
  userData: { userId: string; firstName: string; lastName: string}[];
  roleId: string;
  roleName: string;

}

export function RolesComponent(props: RolesComponentProps) {
  const [showAddRole, setShowAddRole] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roles, setRoles] = useState<any[]>([]);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [GetRoles, { data: rolesData, error: rolesError, refetch: refetchRoles }] = useLazyQuery(GET_ROLES);
  const [getUsers, { data: usersData, error: usersError }] = useLazyQuery(GET_USERS);


  console.log("userData", usersData)
  const [deleterole] = useMutation(DELETE_Role);

  const handleDeleteRole = async (roleId: string) => {
    console.log("roleId", roleId)
    try {
      await deleterole({ variables: { roleId } });
      refetchRoles();
    } catch (error) {
      console.error('Error deleting Role:', error);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rolesData.getRoles.forEach((role: any) => {
        initialSelectedRoleUsers[role.roleId] = [];
      });
      //setSelectedRoleUsers(initialSelectedRoleUsers);
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
      <Box sx={{ bgcolor: "white", width: "80%", marginX: "auto", marginY: 4, borderRadius: 3, maxHeight: '80vh'  }}>
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
          <AddRolesComponent 
            projId={props.projId} 
            visible={showAddRole}
            closeAddRole={closeAddRole} 
            usersData={usersData?.getUsers?.users || []} />
        </Box>

        <Box sx={{ pb: 4, overflowY: 'auto', overflowX: 'hidden', maxHeight: '450px' }}>
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
                  <RoleUsersList roleUsers={rolesData.users} allUsers={usersData?.getUsers?.users || []}></RoleUsersList>
                </Grid>

              </Grid>
              <Divider sx={{ my: '$5' }} />

            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}

export default RolesComponent;
