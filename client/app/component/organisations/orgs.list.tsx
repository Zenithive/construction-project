import { Col, Row, Tooltip } from '@nextui-org/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GET_ORGANISATIONS } from '../../api/organisation/queries';
import { useQuery } from '@apollo/client';
import { GridOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Box, IconButton } from '@mui/material';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { DELETE_ORGANISATION } from '../../api/organisation/mutations';
import { useMutation } from '@apollo/client';
import { SelectChangeEvent } from '@mui/material/Select';
import { PaginationComponent } from '../Pagination/pagination.component';

export interface OrgsListWrapperProps {
   listRefresh: boolean;
   setOrganizationData: CallableFunction;
}


export const OrgsListWrapper = ({ listRefresh, setOrganizationData }: OrgsListWrapperProps) => {
   const gridRef = useRef<AgGridReact>(null);
   const [pageSize, setPageSize] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   const { data, refetch, loading } = useQuery(GET_ORGANISATIONS, {
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
      if (data?.getAllOrg) {
         setTotalPages(data.getAllOrg.totalPages);
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

   // fuction for deleting Org button 
   const [deleteOrganisation] = useMutation(DELETE_ORGANISATION);

   const handleDeleteOrg = async (orgId: string) => {
      try {
         await deleteOrganisation({ variables: { orgId } });
         refetch();
      }
      catch (error) {
         console.error("Error deleting organisation", error);
      }
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleEditOrg = (datas: any) => {
      setOrganizationData(datas);
   };
   //for Dropdown  menu Grid
   const gridOptions: GridOptions = {
      // Other grid options...
      domLayout: 'autoHeight',
   };

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
                  onClick={() => handleEditOrg(data)}
               >
                  <EditIcon size={20} fill="#979797" />
               </IconButton>
            </Tooltip>
         </Col>
         <Col css={{ d: 'flex' }}>
            <Tooltip
               content="Delete user"
               color="error"
               onClick={() => handleDeleteOrg(data.orgId)}//handeler fuction for deleting Org Button
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

   const defaultColDef = useMemo(() => {
      return {
         flex: 1,
         minWidth: 150,
         filter: true,
      };
   }, []);

   useEffect(() => {
      refetch();
   }, [listRefresh, refetch]);

   return (
      <Box>
         <Box component="div" className='ag-theme-quartz' sx={{ height: '400px', mt: 2,  overflowY: 'auto' }}>
            <AgGridReact
               rowData={data?.getAllOrg.orgs || []}
               columnDefs={colDefs}
               gridOptions={gridOptions}
               defaultColDef={defaultColDef}
               sideBar={'filters'}
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