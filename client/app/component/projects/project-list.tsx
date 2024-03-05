import {Col, Row, Tooltip} from '@nextui-org/react';
import React, {useEffect, useMemo, useState} from 'react';
import { GET_PROJECTS } from '../../api/project/queries';
import { useQuery } from '@apollo/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GridOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Box, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import RolesComponent from '../Roles/role.component';
import PermissionComponent from '../Permission/permission.component';

export interface ProjectListWrapperProps{
   listRefresh: boolean;
}

interface DotPopoverProps{
   treeId: string;
   toggleAddFolder: CallableFunction;
}

export const ProjectListWrapper = ({listRefresh}:ProjectListWrapperProps) => {
   const { data, refetch } = useQuery(GET_PROJECTS);

   const [showRoles, setShowRoles] = useState(false)
   const [showPermissions, setShowPermissions] = useState(false)

   const gridOptions:GridOptions = {
      // Other grid options...
      domLayout: 'autoHeight',
    };

    const DotPopoverMenu = ({treeId, toggleAddFolder}:DotPopoverProps) => {
      //const [open, setOpen] = useState(false);
      const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>)=>{
          event.stopPropagation();
          setAnchorEl(event.currentTarget)
      }
      const handleClose = (event: React.MouseEvent<HTMLLIElement>)=>{
          event.stopPropagation();
          setAnchorEl(null)
      }

      const openRolesModal = (event: React.MouseEvent<HTMLLIElement>) => {
         setShowRoles(true);
         handleClose(event)
      }

      const openPermissionModal = (event: React.MouseEvent<HTMLLIElement>) => {
         setShowPermissions(true);
         handleClose(event)
      }

      const open = Boolean(anchorEl);
      const id = open ? 'simple-popover' : undefined;

      return (
          <>
              {/* <IconButton aria-describedby={id} onClick={handleClick} sx={{p: 0}}>
                  <MoreVert />
              </IconButton> */}

               <IconButton aria-describedby={id} onClick={handleClick} sx={{p: 0}}>
                  <MoreVertIcon sx={{ color: "#979797" }} />
               </IconButton>

              <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                  'aria-labelledby': 'basic-button',
                  }}
              >
                  <MenuItem onClick={openRolesModal}>
                      <ListItemText>Roles</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={openPermissionModal}>
                      <ListItemText>Permissions</ListItemText>
                  </MenuItem>
              </Menu>
          </>
      );
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ActionRenderer = ({ value }:any) => (
      <Row
         justify="center"
         align="center"
         css={{'gap': '$8', '@md': {gap: 0}}}
      >
         <Col css={{d: 'flex'}}>
            <Tooltip content="More Setting">
               <DotPopoverMenu treeId={"1"} toggleAddFolder={()=>{}}></DotPopoverMenu>
            </Tooltip>
         </Col>
         <Col css={{d: 'flex'}}>
            <Tooltip content="Edit user">
               <IconButton
                  onClick={() => console.log('Edit Project', value)}
               >
                  <EditIcon size={20} fill="#979797" />
               </IconButton>
            </Tooltip>
         </Col>
         <Col css={{d: 'flex'}}>
            <Tooltip
               content="Delete Project"
               color="error"
               onClick={() => console.log('Delete user')}
            >
               <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
               </IconButton>
            </Tooltip>
         </Col>
      </Row>
    );


   const colDefs = [
      { 
         field: "projName",
         headerName: "Project Name",
         filter: 'agSetColumnFilter',
      },
      { 
         field: "region",
         filter: 'agSetColumnFilter',
         headerName: "Region"
      },
      { 
         field: "status",
         filter: 'agSetColumnFilter',
         headerName: "Status"
      },
      { 
         field: "orgName",
         filter: 'agSetColumnFilter',
         headerName: "ORGANISATION",
         width: 100
      },
      { 
         field: "",
         resizable: false,
         cellRenderer: ActionRenderer
      }
    ];

   useEffect(()=>{
      refetch();
   }, [listRefresh, refetch]);

   const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 150,
        filter: true,
      };
    }, []);

   return (
      <Box
      >
         <RolesComponent visible={showRoles} closeRoleModel={()=>setShowRoles(false)}></RolesComponent>
         <PermissionComponent visible={showPermissions} closeRoleModel={()=>setShowPermissions(false)}></PermissionComponent>
         <Box component="div" className='ag-theme-quartz' sx={{height: '100%', mt: 2}}>
            <AgGridReact 
                  rowData={data?.getProjects || []} 
                  columnDefs={colDefs}
                  gridOptions={gridOptions}
                  defaultColDef={defaultColDef}
                  sideBar={'filters'}

               />
         </Box>
      </Box>
   );
};
