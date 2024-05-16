import { Col, Row, Table, Tooltip } from '@nextui-org/react';
import React, { useEffect, useMemo, useState } from 'react';
import { USER_COLUMNS } from './users.data';
import { RenderCell } from './user.render.cell';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../api/user/queries';
import { UserTypes } from './add-user';
import { ListItemText, Menu, MenuItem, Select ,Box} from '@mui/material';
import { PAGE } from 'client/app/constants/page.constant';
import { PaginationComponent } from '../Pagination/pagination.component';
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
import { tree } from 'next/dist/build/templates/app-page';
import { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { makeStyles } from '@mui/styles';
import { lime } from '@mui/material/colors';


export interface UserLiserWrapperProps {
   listRefresh: boolean;
   setUSERDATA: CallableFunction;
}


export const UserLiserWrapper = ({ listRefresh, setUSERDATA }: UserLiserWrapperProps) => {
   const [pageSize, setPageSize] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);


   const { data, refetch } = useQuery(GET_USERS, {
      variables: { pageSize, currentPage },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only"

   });
   useEffect(() => {
      console.log("Data", data)
      if (data?.getUsers) {
         setTotalPages(data.getUsers.totalPages);
      }
      console.log("if", data?.getUsers);

   }, [data]);


   useEffect(() => {
      console.log("pageSize:", pageSize);
      console.log("currentPage:", currentPage);
      refetch({ variables: { pageSize, currentPage } });
   }, [pageSize, currentPage, refetch]);

   

   const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
      const newSize = Number(event.target.value);
      setPageSize(newSize);
      setCurrentPage(1);

   };


   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   };



   // Define the deleteProject mutation function    **********  delete functionality
   const [deleteUser] = useMutation(DELETE_USER);

   // Function to handle project deletion
   const handleDeleteProject = async (userId: string) => {
      console.log("userId", userId)
      try {
         // Execute the deleteProject mutation with the projectId as variable
         await deleteUser({ variables: { userId } });
         // Refetch projects after deletion
         refetch();
      } catch (error) {
         console.error('Error deleting project:', error);
      }
   };

   //for edite
   //const [visible, setVisible] = React.useState(false);
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleEditUser = (datas: any) => {
      console.log(datas);
      //setVisible(true)
      setUSERDATA(datas);
   }


   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const ActionRenderer = ({ value, data }: any) => (
      <Row
         justify="center"
         align="center"
         css={{ 'gap': '$8', '@md': { gap: 0 } }}
      >

         <Col css={{ d: 'flex' }}>
            <Tooltip content="Edit user">
               <IconButton
                  onClick={() => handleEditUser(data)}
               >
                  <EditIcon size={20} fill="#979797" />
               </IconButton>
            </Tooltip>
         </Col>
         <Col css={{ d: 'flex' }}>
            <Tooltip
               content="Delete User"
               color="error"
               onClick={() => handleDeleteProject(data.userId)}
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
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         valueGetter: (params: any) => {
            return `${params.data.firstName}` + ` ${params.data.lastName}`
         }

      },
      { headerName: 'EMAIL', field: 'email', sortable: true, filter: true },
      { headerName: 'STATUS', field: 'status', sortable: true, filter: true },
      { headerName: '', field: 'icons', sortable: true, filter: false, cellRenderer: ActionRenderer },
   ];

   console.log(data);

   useEffect(() => {
      refetch();
   }, [listRefresh, refetch]);



   return (
      <Box>
         <Box component="div" className='ag-theme-quartz' sx={{ height: '400px', mt: 2,  overflowY: 'auto' }}>
            <AgGridReact
               rowData={data?.getUsers.users || []}
               defaultColDef={defaultColDef}
               domLayout="autoHeight"
               columnDefs={columnDefs}

            />
         </Box>
         <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <PaginationComponent
               totalPage={totalPages}
               currentPage={currentPage}
               pageSize={pageSize}
               handlePageSizeChange={handlePageSizeChange}
               handlePageChange={handlePageChange}
            />
         </Box>
      </Box>

   );
};