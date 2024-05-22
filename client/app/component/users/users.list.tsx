import { Col, Row, Tooltip } from '@nextui-org/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../api/user/queries';
import { Box} from '@mui/material';
import { PaginationComponent } from '../Pagination/pagination.component';

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import { IconButton } from '@mui/material';
import { DELETE_USER } from '../../api/user/mutations';
import { useMutation } from '@apollo/client';
import { SelectChangeEvent } from '@mui/material/Select';

export interface UserLiserWrapperProps {
   listRefresh: boolean;
   setUSERDATA: CallableFunction;
}


export const UserLiserWrapper = ({ listRefresh, setUSERDATA }: UserLiserWrapperProps) => {
   const gridRef = useRef<AgGridReact>(null);
   const [pageSize, setPageSize] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);


   const { data, refetch, loading } = useQuery(GET_USERS, {
      variables: { pageSize, currentPage },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only"

   });

   useEffect(() => {
      if (loading) {
         gridRef.current?.api?.showLoadingOverlay();
      }else{
         gridRef.current?.api?.hideOverlay();
      }
   }, [loading]);

   useEffect(() => {
      if (data?.getUsers) {
         setTotalPages(data.getUsers.totalPages);
      }
   }, [data]);


   useEffect(() => {
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

   const [deleteUser] = useMutation(DELETE_USER);

   const handleDeleteProject = async (userId: string) => {
      try {
         await deleteUser({ variables: { userId } });
         refetch();
      } catch (error) {
         console.error('Error deleting project:', error);
      }
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleEditUser = (datas: any) => {
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
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         valueGetter: (params: any) => {
            return `${params.data.firstName}` + ` ${params.data.lastName}`
         }

      },
      { headerName: 'EMAIL', field: 'email', sortable: true, filter: true },
      { headerName: 'STATUS', field: 'status', sortable: true, filter: true },
      { headerName: '', field: 'icons', sortable: true, filter: false, cellRenderer: ActionRenderer },
   ];

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
               ref={gridRef}
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