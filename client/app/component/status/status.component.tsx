import { Box, Button, Divider, Grid, IconButton, Modal, Typography } from "@mui/material";
import { Tooltip } from '@nextui-org/react';
import { DeleteIcon } from '../icons/table/delete-icon';
import ToastMessage from "../toast-message/ToastMessage";
import AddStatusComponent from "./add-status.component";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_STATUS} from "../../api/status/queries";
import { DELETE_Status } from "../../api/status/mutations";

export interface StatusComponentProps {
  visible: boolean;
  closeStatusModel: () => void;
  clearProjId: () => void;
  projId: string;
  statusId: string;
  statusName: string;
}

interface Status {
    statusId: string;
    statusName: string;
  }

export function StatusComponent(props: StatusComponentProps) {
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);

  const [GetStatuses, { data: statusesData, error: statusesError, refetch }] = useLazyQuery(GET_STATUS);
  const [deleteStatus] = useMutation(DELETE_Status);

  const handleDeleteStatus = async (statusId: string): Promise<void>=> {
    try {
      await deleteStatus({ variables: { statusId } });
      refetch();
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  useEffect(() => {
    if (props.projId) {
      GetStatuses({
        variables: {
          projId: props.projId
        }
      });
    }
  }, [props.projId, GetStatuses]);

  useEffect(() => {
    if (statusesData && statusesData.getStatuses) {
      setStatuses(statusesData.getStatuses);
    }
  }, [statusesData]);

  const closeAddStatus = () => {
    setShowAddStatus(false);
    refetch(); 
  }

  const closeHandler = () => {
    props.closeStatusModel();
    props.clearProjId();
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.visible}
      onClose={closeHandler}
    >
      <Box sx={{ bgcolor: "white", width: "80%", marginX: "auto", marginY: 4, borderRadius: 3, maxHeight: '80vh' }}>
        <Box sx={{ paddingX: 3, paddingY: 2 }}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={10}>
              <Typography id="modal-title" component="h4">
                Statuses
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'end' }}>
              <IconButton aria-describedby="id" onClick={closeHandler} sx={{ p: 0, right: 0 }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowAddStatus(true)} size="small">
            Add new Status
          </Button>
          <ToastMessage severity="error" openFlag={statusesError ? true : false} message="Problem while fetching data." />
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ px: 3 }}>
          <AddStatusComponent 
            projId={props.projId} 
            visible={showAddStatus}
            closeAddStatus={closeAddStatus}
            refetchStatuses={refetch} />
        </Box>

        <Box sx={{ pb: 4, overflowY: 'auto', overflowX: 'hidden', maxHeight: '450px' }}>
          {statuses.map((statusData, index) => (
            <React.Fragment key={index}>
              <Grid sx={{ display: 'flex', py: 1 }} container spacing={3}>
                <Grid item xs={1}>
                  <Tooltip
                    content="Delete Status"
                    color="error"
                    onClick={() => handleDeleteStatus(statusData.statusId)}
                  >
                    <IconButton sx={{ pl: 3 }}>
                      <DeleteIcon size={20} fill="#FF0080" />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={11}>{statusData.statusName}</Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}

export default StatusComponent;
