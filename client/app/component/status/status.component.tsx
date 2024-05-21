import { Box, Button, Divider, Grid, IconButton, Modal, Typography } from "@mui/material";
import { Tooltip } from '@nextui-org/react';
import { DeleteIcon } from '../icons/table/delete-icon';
import AddStatusComponent from "./add-status.component";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import {  useMutation, useQuery } from "@apollo/client";
import { GET_STATUS } from "../../api/status/queries";
import { DELETE_Status } from "../../api/status/mutations";
import { EditIcon } from "../icons/table/edit-icon";


export interface StatusesComponentProps {
  visible: boolean;
  closeStatusModel: () => void;
  clearProjId: () => void;
  projId: string;
  orgId: string;
  userId: string;
  statusId?: string;
  statusName?: string;
}

export interface Status {
  statusId: string;
  statusName: string;
  projId: string;
  orgId: string;
  userId: string;
}

export function StatusesComponent(props: StatusesComponentProps) {
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const { data: statusesData, refetch: refetchStatuses } = useQuery(GET_STATUS, {
    variables: { projId: props.projId},
    skip: (showAddStatus || !props.visible)
  });
  const [deleteStatus] = useMutation(DELETE_Status);

  

  useEffect(() => {
    if (statusesData && statusesData.getStatus) {
      setStatuses(statusesData.getStatus);
    }
  }, [statusesData]);

  const closeAddStatus = () => {
    setShowAddStatus(false);
    setSelectedStatus(null);
    setMode('add');
    refetchStatuses();
  };

  const closeHandler = () => {
    props.closeStatusModel();
    props.clearProjId();
    setShowAddStatus(false);
    setSelectedStatus(null);
    setMode('add');
  };

  const handleStatusHover = (statusId: string | null) => {
    setHoveredStatus(statusId);
  };

  const handleOpenEditStatus = (status: Status) => {
    setSelectedStatus(status);
    setMode('edit');
  };

  const handleAddStatus = () => {
    setShowAddStatus(true);
    setSelectedStatus(null);
    setMode('add');
  };

  const handleDeleteStatus = async (statusId: string) => {
    try {
      await deleteStatus({ variables: { statusId } });
      refetchStatuses();
    } catch (error) {
      console.error('Error deleting Status:', error);
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
      <Box sx={{ bgcolor: "white", width: "40%", marginX: "auto", marginY: 4, borderRadius: 3, maxHeight: '80vh' }}>
        <Box sx={{ paddingX: 3, paddingY: 2 }} component={"div"}>
          <Grid container>
            <Grid item xs={11}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Statuses
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <CloseIcon style={{ cursor: 'pointer' }} onClick={closeHandler} />
            </Grid>
          </Grid>
          <Divider />
          <Tooltip content={undefined}>
            <Button
              onClick={handleAddStatus}
              color="primary"
              size="small"
              style={{ float: 'left', marginTop: -33, left: 120 }}
              variant="outlined"
              startIcon={<AddIcon />}
            >
              Add Status
            </Button>
          </Tooltip>
        <Divider sx={{ my: '$5' }} />
        <Box sx={{ px: 2,position:"relative",bottom:8 }}>
          {mode === 'add' && showAddStatus && (
            <AddStatusComponent
              visible={showAddStatus}
              closeAddStatus={closeAddStatus}
              projId={props.projId}
              statusId={props.statusId}
              statusName={props.statusName}
              orgId={props.orgId}
              userId={props.userId}
            />
          )}
          </Box>
          <Divider sx={{ my: '$5' }} />
          <Box sx={{ maxHeight: '60vh', overflow: 'auto', marginTop: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Status Name</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((status) => (
                  <React.Fragment key={status.statusId}>
                    {mode === 'edit' && selectedStatus?.statusId === status.statusId ? (
                      <tr>
                        <td colSpan={2} style={{ padding: '8px' }}>
                          <AddStatusComponent
                            visible={true}
                            closeAddStatus={closeAddStatus}
                            projId={props.projId}
                            statusDetails={selectedStatus}
                            statusId={selectedStatus.statusId}
                            orgId={props.orgId}
                            userId={props.userId}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr
                        onMouseEnter={() => handleStatusHover(status.statusId)}
                        onMouseLeave={() => handleStatusHover(null)}
                      >
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                          <Grid container alignItems="center">
                            <Grid item xs={8}>
                              {status.statusName}
                            </Grid>
                            <Grid item xs={4}>
                              {hoveredStatus === status.statusId && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <Tooltip content="Edit Status">
                                    <IconButton onClick={() => handleOpenEditStatus(status)} size="small">
                                      <EditIcon size={20} fill="#3f51b5" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip content="Delete Status">
                                    <IconButton onClick={() => handleDeleteStatus(status.statusId)} size="small">
                                      <DeleteIcon size={20} fill="#FF0080" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                            </Grid>
                            <Divider sx={{ my: '$5' }} />
                          </Grid>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default StatusesComponent;
