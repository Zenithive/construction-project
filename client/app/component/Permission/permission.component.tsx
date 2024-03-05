import { Box, Button, Checkbox, Divider, Grid, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ToastMessage from "../toast-message/ToastMessage";
import { useQuery } from "@apollo/client";
import { GET_ROLES } from "../../api/Roles/queries";

/* eslint-disable-next-line */
export interface PermissionComponentProps {
  visible: boolean;
  closeRoleModel: CallableFunction;
}

export function PermissionComponent(props: PermissionComponentProps) {

  const { data, error, refetch } = useQuery(GET_ROLES);

  const permistionList = [
    {
      name: "Can Upload File",
      kye: "canUploadFile"
    },
    {
      name: "Can Download File",
      kye: "canDownloadFile"
    },
    {
      name: "Can Delete file",
      kye: "canDeleteFile"
    },
    {
      name: "Can Create Folder",
      kye: "canCreateFolder"
    },
    {
      name: "Can delete Folder",
      kye: "canDeleteFolder"
    },
    {
      name: "Can create Project",
      kye: "canCreateProject"
    },
    {
      name: "Can delete Project",
      kye: "canDeleteProject"
    },
    {
      name: "Can Upload File",
      kye: "canUploadFile"
    },
    {
      name: "Can Upload File",
      kye: "canUploadFile"
    }
  ]

  const closeAddRole = () => {
    refetch();
  }

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
      <Box sx={{ bgcolor: "white", width: "80%", marginX: "auto", marginY: 4, borderRadius: 3 }}>

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
       
        <Box sx={{ pb: 3, overflow: "hidden" }}>
          <Grid container spacing={2} sx={{ px: 3, py: 1 }}>
            <Grid item xs={1} sx={{fontSize: "12px", fontWeight: "bold"}}></Grid>
            {permistionList.map((data, index: number) =>
                <Grid key={index} item xs={1} sx={{fontSize: "12px", fontWeight: "bold"}}>{data.name}</Grid>
             )}
          </Grid>
        </Box>
        <Box sx={{ pb: 3, overflow: "hidden" }}>
          {data?.getRoles.map((data:any, index: number) =>
            <>
              <Grid container spacing={2} key={index} sx={{ px: 3, py: 1 }}>
                <Grid item xs={1} sx={{fontWeight: "bold"}}>{data.roleName}</Grid>
                {permistionList.map((data, ind: number) =>
                  <Grid key={ind} item xs={1} sx={{fontSize: "12px", fontWeight: "bold"}}>
                    <Checkbox defaultChecked />
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ my: '$5' }} />
            </>
          )}
        </Box>

        <Box>
          <Grid container spacing={2} sx={{ px: 3, py: 1, display:"flex", justifyContent: "flex-end" }}>
            <Grid item xs={1}>
              <Button variant="contained" size="small">Submit</Button>
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" color="inherit" size="small" onClick={closeHandler}>Cancel</Button>
            </Grid>
          </Grid>
        </Box>

      </Box>
    </Modal>
  );
}

export default PermissionComponent;
