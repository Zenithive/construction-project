import { Box, Button, Divider, Grid, IconButton, Modal, Typography} from "@mui/material";
import { Tooltip } from '@nextui-org/react';
import { DeleteIcon } from '../icons/table/delete-icon';
import ToastMessage from "../toast-message/ToastMessage";
import AddRolesComponent from "./add-role.component";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ROLES } from "../../api/Roles/queries";
import { GET_USERS } from "../../api/user/queries";
import { useMutation } from "@apollo/client";
import { DELETE_Role } from "../../api/Roles/mutations";
import { RoleUsersList } from "./role-users-list.component";
import { EditIcon } from "../icons/table/edit-icon";
import { UserTypes } from "../users/add-user";

/* eslint-disable-next-line */
export interface RolesComponentProps {
  visible: boolean;
  closeRoleModel: () => void;
  clearProjId: () => void;
  projId: string;
  roleId: string;
  roleName: string;
  usersData?: User[];
  roleDetails?: Role | null;
  onUserSelectionChange?: (selectedUsers: string[]) => void;
}

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
}


export interface Role {
  roleId: string;
  isDefaultRole?: boolean;
  roleName: string;
  users: Array<string>;
}

interface UsersData {
  getUsers: {
    users: UserTypes[];
  };
}


export function RolesComponent(props: RolesComponentProps) {
  const [showAddRole, setShowAddRole] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [, setSelectedRoleUsers] = useState<string[]>([]);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [GetRoles, { data: rolesData, error: rolesError, refetch: refetchRoles }] = useLazyQuery(GET_ROLES);
  const [getUsers, { data: usersData, error: usersError }] = useLazyQuery<UsersData>(GET_USERS);
  const [deleteRole] = useMutation(DELETE_Role);
  const [isUserSelected] = useState(false);
  const isAdminRole = selectedRole?.roleName.toLowerCase() === 'admin';

  useEffect(() => {
    if (selectedRole) {
      setSelectedRoleUsers(selectedRole.users);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (props.projId) {
      GetRoles({
        variables: { projId: props.projId }
      });
    }
  }, [props.projId, GetRoles]);

  useEffect(() => {
    if (props.visible) {
      getUsers({
        variables: { pageSize: -1, currentPage: -1 },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "network-only"
      });
    }
  }, [props.visible, getUsers]);

  useEffect(() => {
    if (rolesData && rolesData.getRoles) {
      setRoles(rolesData.getRoles);
    }
  }, [rolesData]);

  const closeAddRole = () => {
    setShowAddRole(false);
    setSelectedRole(null);
    setMode('add');
    refetchRoles();
  };

  const closeHandler = () => {
    props.closeRoleModel();
    props.clearProjId();
    setShowAddRole(false);
    setSelectedRole(null);
    setMode('add');
  };

  const handleRoleHover = (roleId: string | null) => {
    setHoveredRole(roleId);
  };

  const handleOpenEditRole = (role: Role) => {
    setSelectedRole(role);
    setMode('edit');
    if (role) {
      const selectedUsers = role.users;
      setSelectedRoleUsers(selectedUsers);
    }
  };

  const handleAddRole = () => {
    setShowAddRole(true);
    setSelectedRole(null);
    setMode('add');
  };

  const handleUserSelectionChange = (selectedUsers: string[]) => {
  
    const isAdminRole = props.roleDetails?.roleName.toLowerCase() === 'admin';
  
    if (!isAdminRole) {
      props.onUserSelectionChange && props.onUserSelectionChange(selectedUsers);
    }
  };
  
  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (roleName.toLowerCase() === 'admin') {
      console.log('Cannot delete admin role.');
      return;
    }
    try {
      await deleteRole({ variables: { roleId } });
      refetchRoles();
    } catch (error) {
      console.error('Error deleting Role:', error);
    }
  };


  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.visible}
      onClose={closeHandler}
      style={{ zIndex: 999 }}
    >
      <Box sx={{ bgcolor: "white", width: "80%", marginX: "auto", marginY: 4, borderRadius: 3,maxHeight: '80vh'  }}>
        <Box sx={{ paddingX: 3, paddingY: 2, }} component={"div"}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={1}>
              <Typography id="modal-title" component={"h4"}>
                Roles
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRole} size="small" sx={{ borderRadius: 3 }}  disabled={mode === 'edit' && isAdminRole && !isUserSelected}>
                Add new Role
              </Button>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'end' }}>
              <IconButton aria-describedby="id" onClick={closeHandler} sx={{ p: 0, right: 0 }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <ToastMessage severity="error" openFlag={!!rolesError || !!usersError} message="Problem while fetching data." />
        </Box>
        <Divider sx={{ my: '$5' }} />

        <Box sx={{ px: 3 }}>
          {mode === 'add' && showAddRole && (
            <AddRolesComponent
              visible={showAddRole}
              closeAddRole={closeAddRole}
              projId={props.projId}
              usersData={usersData?.getUsers?.users || []}
              roleDetails={selectedRole}
              onUserSelectionChange={handleUserSelectionChange}
            />
          )}
        </Box>
        <Divider sx={{ my: '$5' }} />
        <Box sx={{ pb: 4, overflowY: 'auto', overflowX: 'hidden', maxHeight: '450px', pr: 0 }}>
        {roles.map((role, index) => (
    <React.Fragment key={index}>
      {(mode === 'edit' && selectedRole && selectedRole.roleId === role.roleId) ? (
        <div style={{ marginLeft: '15px' }}>
          {role.roleName.toLowerCase() === 'admin' ? (
            <AddRolesComponent
              visible={true}
              closeAddRole={closeAddRole}
              projId={props.projId}
              usersData={usersData?.getUsers?.users || []}
              roleDetails={role}
              editable={false} 
            />
          ) : (
            <AddRolesComponent
              visible={true}
              closeAddRole={closeAddRole}
              projId={props.projId}
              usersData={usersData?.getUsers?.users || []}
              roleDetails={role}
              editable={true} 
            />
          )}
        </div>
              ) : (
                <Grid
                  container
                  spacing={3}
                  sx={{ display: 'flex', alignItems: 'center', position: 'relative', pb: 1, pt: 1, pl: 4 }}
                  onMouseEnter={() => handleRoleHover(role.roleId)}
                  onMouseLeave={() => handleRoleHover(null)}
                >
                  <Grid item xs={3} sx={{ pl: 2 }}>
                    <Box sx={{ display: "flex" }}>
                      {role.roleName}
                      {hoveredRole === role.roleId && (
                        <Box sx={{ display: "flex"}}>
                         {role.roleName.toLowerCase() !== 'admin' && (
                          <Tooltip content="Delete Role" color="error" style={{zIndex:9999}}>
                            <IconButton onClick={() => handleDeleteRole(role.roleId, role.roleName)}>
                              <DeleteIcon size={20} fill="#FF0080" />
                            </IconButton>
                          </Tooltip>
                          )}
                          <Tooltip content="Edit Role" style={{ zIndex:9999}}>
                            <IconButton onClick={() => handleOpenEditRole(role)}>
                              <EditIcon size={20} fill="#3f51b5" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <RoleUsersList roleUsers={role.users} allUsers={usersData?.getUsers?.users || []} />
                  </Grid>
                </Grid>
              )}
              <Divider sx={{ my: '$5' }} />
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}

export default RolesComponent;
