import { Box, Button, Divider, Grid, IconButton, Modal, Typography } from "@mui/material";
import ToastMessage from "../toast-message/ToastMessage";
import AddRolesComponent from "./add-role.component";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROLES } from "../../api/Roles/queries";

/* eslint-disable-next-line */
export interface RolesComponentProps {
  visible: boolean;
  closeRoleModel: CallableFunction;
}

export function RolesComponent(props: RolesComponentProps) {

  const [showAddRole, setShowAddRole] = useState(false);
  const { data, error, refetch } = useQuery(GET_ROLES);

  const closeAddRole = () => {
    setShowAddRole(false);
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
              <Grid item xs={1}>
                <Typography id="modal-title" component={"h4"}>
                  Roles
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowAddRole(true)} size="small">
                  Add new Role
                </Button>
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
        <Box sx={{ px: 3 }}>
          <AddRolesComponent visible={showAddRole} closeAddRole={closeAddRole}></AddRolesComponent>
        </Box>
        <Box sx={{ pb: 3, overflow: "hidden" }}>
          {data?.getRoles.map((data:any, index: number) =>
            <>
              <Grid container spacing={2} key={index} sx={{ px: 3, py: 1 }}>
                <Grid item xs={8}>{data.roleName}</Grid>
              </Grid>
              <Divider sx={{ my: '$5' }} />
            </>
          )}
        </Box>

      </Box>
    </Modal>
  );
}

export default RolesComponent;
