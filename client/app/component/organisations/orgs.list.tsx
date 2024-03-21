import {Col, Row, Tooltip} from '@nextui-org/react';
import React, {useEffect, useMemo, useState} from 'react';
import { GET_ORGANISATIONS } from 'client/app/api/organisation/queries';
import { useQuery } from '@apollo/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GridOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Box, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { EyeIcon } from '../icons/table/eye-icon';
import { DELETE_ORGANISATION } from 'client/app/api/organisation/mutations';
import { useMutation } from '@apollo/client';
import { handleClientScriptLoad } from 'next/script';

export interface OrgsListWrapperProps{
   listRefresh: boolean;
}
//Dropdown  menu component for actions on rows in the table
interface DotPopoverProps{
   treeId: string;
   toggleAddFolder: CallableFunction;
}

export const OrgsListWrapper = ({listRefresh}:OrgsListWrapperProps) => {
     const { data, refetch } = useQuery(GET_ORGANISATIONS);
        useEffect(()=>{
          refetch();
          }, [listRefresh, refetch]);

// fuction for deleting Org button 
   const [deleteOrganisation]=useMutation(DELETE_ORGANISATION);
   
   const handleDeleteOrg=async(orgId:any,newdata:any)=>{
      try{
         await deleteOrganisation({variables:{orgId}});
         refetch();
      }
      catch(error){
         console.error("Error deleting organisation", error);
      }
   }
   
//for Dropdown  menu Grid
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

          </>
      );
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ActionRenderer = ({ value ,data}:any) => (
      <Row
      justify="center"
      align="center"
      css={{'gap': '$8', '@md': {gap: 0}}}
   >
      <Col css={{d: 'flex'}}>
         <Tooltip content="Details">
            <IconButton
               onClick={() => console.log('View user', data.orgId)}
            >
               <EyeIcon size={20} fill="#979797" />
            </IconButton>
         </Tooltip>
      </Col>
      <Col css={{d: 'flex'}}>
         <Tooltip content="Edit user">
            <IconButton
               onClick={() => console.log('Edit user', data.orgId)}
            >
               <EditIcon size={20} fill="#979797" />
            </IconButton>
         </Tooltip>
      </Col>
      <Col css={{d: 'flex'}}>
         <Tooltip
            content="Delete user"
            color="error"
            onClick={() =>handleDeleteOrg(data.orgId,data)}//handeler fuction for deleting Org Button
         >
            <IconButton>
               <DeleteIcon size={20} fill="#FF0080" />
            </IconButton>
         </Tooltip>
      </Col>
   </Row>
    );
console.log(data);

   const colDefs = [
      { 
         field: "orgName",
         headerName: "Organisation Name",
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
         field: "",
         resizable: false,
         cellRenderer: ActionRenderer
      }
    ];

    console.log(colDefs)

   const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 150,
        filter: true,
      };
    }, []);
   console.log(defaultColDef)

   return (
      <Box
      >
         <Box component="div" className='ag-theme-quartz' sx={{height: '100%', mt: 2}}>
            <AgGridReact 
                  rowData={data?.getAllOrg || []} 
                  columnDefs={colDefs}
                  gridOptions={gridOptions}
                  defaultColDef={defaultColDef}
                  sideBar={'filters'}
               />  
         </Box>
      </Box>
   );
};