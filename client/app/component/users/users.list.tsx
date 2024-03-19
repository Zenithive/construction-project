import {Col, Row, Table, Tooltip} from '@nextui-org/react';
import React, { useEffect, useMemo } from 'react';
import {Box} from '../styles/box';
import {USER_COLUMNS} from './users.data';
import {RenderCell} from './user.render.cell';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../api/user/queries';
import { UserTypes } from './add-user';


// Sachin Import 

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import { EyeIcon } from '../icons/table/eye-icon';
import { IconButton } from '@mui/material';
import { DELETE_USER } from 'client/app/api/user/mutations';
import { useMutation } from '@apollo/client';
import { User } from '../../../../api/src/app/user/user.schema';


export interface UserLiserWrapperProps{
   listRefresh: boolean;
}

export const UserLiserWrapper = ({listRefresh}:UserLiserWrapperProps) => {

   const { data, refetch } = useQuery(GET_USERS);

   useEffect(()=>{
      refetch();
   }, [listRefresh, refetch]);

   
   // Define the deleteProject mutation function    **********  delete functionality
   const [deleteUser] = useMutation(DELETE_USER);
   
   // Function to handle project deletion
   const handleDeleteProject = async (userId: any,newdata:any) => {
      console.log("userId", userId)
      console.log("newdata" ,newdata);
           try {
              // Execute the deleteProject mutation with the projectId as variable
              await deleteUser({ variables: { userId } });
              // Refetch projects after deletion
              refetch();
           } catch (error) {
              console.error('Error deleting project:', error);
           }
        };
   
   


   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const ActionRenderer = ({ value, data }:any) => (
      <Row
         justify="center"
         align="center"
         css={{'gap': '$8', '@md': {gap: 0}}}
      >
         <Col css={{d: 'flex'}}>
            <Tooltip content="Edit user">
               <IconButton
                  onClick={() => console.log('Edit Project', data)}
               >
                  <EyeIcon size={20} fill="#979797" />
               </IconButton>
            </Tooltip>
         </Col>
         <Col css={{d: 'flex'}}>
            <Tooltip content="Edit user">
               <IconButton
                  onClick={() => console.log('Edit Project', data)}
               >
                  <EditIcon size={20} fill="#979797" />
               </IconButton>
            </Tooltip>
         </Col>
         <Col css={{d: 'flex'}}>
            <Tooltip
               content="Delete User"
               color="error"
               onClick={() => handleDeleteProject(data.userId,data) }
            >
               <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
               </IconButton>
            </Tooltip>
         </Col>
      </Row>
    );


    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 150,
        filter: true,
      };
    }, []);


   const columnDefs = [
      {
         headerName: 'NAME',
         field: 'name',
         sortable: true,
         filter: true,
         // Use valueGetter to concatenate firstname and lastname into one field
         valueGetter: (params: any) => {
            return  `${params.data.firstName}` + ` ${params.data.lastName}`
         }
         
         },
      { headerName: 'EMAIL', field: 'email', sortable: true, filter: true },
      { headerName: 'STATUS', field: 'status', sortable: true, filter: true },
      { headerName: '', field: 'icons', sortable: true, filter: false,cellRenderer: ActionRenderer },
    ];

   console.log(data);
   
   
   
   return (
      <Box css={{ height: '100%', width: '100%' }}>
      <div className="ag-theme-quartz" >
        <AgGridReact
          rowData={data?.getUsers || []}
                  defaultColDef={defaultColDef}
                  domLayout="autoHeight"
          columnDefs={columnDefs} // Set the column definitions
         //  frameworkComponents={{
            // iconsRenderer: iconsRenderer
         // }}
          
        />
      </div>
    </Box>
   );
};