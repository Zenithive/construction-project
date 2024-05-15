import { Box, Checkbox, Divider, Grid, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ToastMessage from "../toast-message/ToastMessage";
import { useLazyQuery } from "@apollo/client";
import { GET_ROLES } from "../../api/Roles/queries";
import { useEffect, useState } from "react";
import { GET_PERMISSIONS } from "../../api/permission/queries";

export interface PermissionComponentProps {
  visible: boolean;
  closeRoleModel: CallableFunction;
  projId: string;
}

export interface PermissionMapType{
  [key: string]: Array<PermissionType>
}

export interface PermissionType{
  createdBy: string;
  roleName: string;
  orginatorId: string;
  permissionId: string;
  permissionKey: string;
  permissionLabel: string;
  projId: string;
  roleId: string;
  updatedBy: string;
  value: boolean;
}

export function PermissionComponent(props: PermissionComponentProps) {

  const [permissionMap, setPermissionMap] = useState<PermissionMapType>({});
  const [permissionLableArray, setPermissionLabelArray] = useState<Array<string>>([]);

  const [GetRoles , { data:roles, error }] = useLazyQuery(GET_ROLES);
  const [GetPermissions , { data:permission }] = useLazyQuery(GET_PERMISSIONS);

  const getRoleNameUsingId = (roleId:string) => {
    for (let index = 0; index < roles.getRoles.length; index++) {
      const element = roles.getRoles[index];
      if(element.roleId == roleId){
        return element.roleName;
      }
    }

    return "";
  }

  const createPermissionRolesMapArray = () => {
    const tmpLabelArray:Array<string> = [];
    const tmpMap:PermissionMapType = {};
    for (let index = 0; index < permission?.getPermissions.length; index++) {
      const permissionObj = permission?.getPermissions[index];
      const roleName:string = getRoleNameUsingId(permissionObj.roleId);
      if(!tmpLabelArray.includes(permissionObj.permissionLabel)){
        tmpLabelArray.push(permissionObj.permissionLabel);
      }

      if(Object.keys(tmpMap).includes(permissionObj.roleId)){
        tmpMap[permissionObj.roleId].push({...permissionObj, roleName})
      }else{
        tmpMap[permissionObj.roleId] = [{...permissionObj, roleName}]
      }
    }
    
    setPermissionLabelArray(tmpLabelArray.sort((a:string,b:string) => b.localeCompare(a) ));

    for (const key in tmpMap) {
      if (Object.prototype.hasOwnProperty.call(tmpMap, key)) {
        tmpMap[key].sort((a:PermissionType,b:PermissionType) => b.permissionLabel.localeCompare(a.permissionLabel) );
      }
    }

    setPermissionMap(tmpMap);
  }

  useEffect(()=>{
    if(props.projId){
      const paramProjId = {variables: {
        projId: props.projId
      }};
      GetRoles(paramProjId);
      GetPermissions(paramProjId);
    }
  }, [props.projId]);

  useEffect(()=>{
    if(permission && permission?.getPermissions.length){
      createPermissionRolesMapArray();
    }
  }, [permission]);

  const closeHandler = () => {
    props.closeRoleModel()
  }
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.visible}
      onClose={closeHandler}
    >
      <Box sx={{ bgcolor: "white", width: "80%", marginX: "auto", marginY: 4, borderRadius: 3, height: "90%", overflow: "hidden" }}>

        <Box sx={{ paddingX: 3, paddingY: 2, }} component={"div"}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={11}>
                <Typography id="modal-title" component={"h3"} sx={{fontWeight: "bold"}}>
                  Permission
                </Typography>
              </Grid>
              
              <Grid item xs={1} sx={{textAlign:"end"}}>
                <IconButton aria-describedby="id" onClick={closeHandler} sx={{ p: 0, right: 0 }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
          </Grid>
          
          <ToastMessage
            severity="error"
            openFlag={error ? true : false}
            message='Problem while fetching roles.'
          ></ToastMessage>
        </Box>
        <Divider sx={{ my: '$5' }} />
       
       <Box sx={{ overflow: "hidden", height: '100%', mb: 2 }}>
          <Box sx={{  overflow: "hidden" }}>
            <Grid container spacing={2} sx={{ px: 3, py: 1 }}>
              <Grid item xs={1} sx={{fontSize: "12px", fontWeight: "bold"}}></Grid>
              {permissionLableArray.map((permissionLable: string, index: number) =>
                  <Grid key={index} item xs={1} sx={{fontSize: "12px", fontWeight: "bold"}}>{permissionLable}</Grid>
              )}
            </Grid>
          </Box>
          <Divider sx={{ my: '$5' }} />
          <Box sx={{ overflow: "auto", height: "calc(100% - 150px)" }}>
            {Object.values(permissionMap).map((permissionRoleArray:Array<PermissionType>, index: number) =>
              <>
                <Grid container spacing={2} key={index} sx={{ px: 3, py: 1 }}>
                  <Grid item xs={1} sx={{fontWeight: "bold"}}>{permissionRoleArray[0].roleName}</Grid>
                  {permissionRoleArray.map((data, ind: number) =>
                    <Grid key={ind} item xs={1} sx={{fontSize: "12px", fontWeight: "bold"}}>
                      <Checkbox size="small" checked={data.value} /> <br />
                    </Grid>
                  )}
                </Grid>
                <Divider sx={{ my: '$5' }} />
              </>
            )}
          </Box>
       </Box>

      </Box>
    </Modal>
  );
}

export default PermissionComponent;
