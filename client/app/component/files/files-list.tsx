import { Col, Row, Tooltip } from '@nextui-org/react';
import { GridOptions } from 'ag-grid-community';
import React, { useEffect, useState } from 'react';
import { GET_FILES_BY_FOLDER_ID } from '../../api/file/queries';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { Box, IconButton, Link, SelectChangeEvent } from '@mui/material';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';

// Sachin Import  ******************

import { DELETE_FILE_MEMBERSH } from '../../api/file/mutations'
import { FolderIdInterface } from '../../files/page';
import { PaginationComponent } from '../Pagination/pagination.component';
import { useMutation, useQuery } from '@apollo/client';

export interface FilesListWrapperProps {
   listRefresh: boolean;
   folderIdHook: FolderIdInterface;
}

export const FilesListWrapper = ({ listRefresh, folderIdHook }: FilesListWrapperProps) => {
   const [pageSize, setPageSize] = useState(10); //
   const [currentPage, setCurrentPage] = useState(1); //
   const [totalPages, setTotalPages] = useState(0);   //

   const { data, refetch } = useQuery(GET_FILES_BY_FOLDER_ID, {
      variables: { folderId: (folderIdHook.folderId || ""), pageSize, currentPage },///
      notifyOnNetworkStatusChange: true, ///
      fetchPolicy: "network-only" ///
   });

   useEffect(() => {
      if (data?.getFileByFolderId) {
         setTotalPages(data.getFileByFolderId.totalPages);
      }
   }, [data]);

   useEffect(() => {
      console.log("folderIdHook.folderId", folderIdHook.folderId)
      refetch();
   }, [listRefresh, refetch, pageSize, currentPage]);

   useEffect(() => {
      console.log("folderIdHook.folderId", folderIdHook.folderId)
      // refetch();
      setCurrentPage(1);
   }, [ folderIdHook.folderId]);

   

   useEffect(() => {
      console.log("pageSize:", pageSize);
      console.log("currentPage:", currentPage);
      refetch({ variables: { pageSize, currentPage } });
   }, [pageSize, currentPage, refetch]);




   const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
      const newSize = Number(event.target.value);
      setPageSize(newSize);
      // setCurrentPage(1); // Reset current page when changing page size
   };

   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   };

   const [deleteFile] = useMutation(DELETE_FILE_MEMBERSH);

   const handleDeleteFiles = async (fileId: string) => {
      try {
         // Execute the deleteFile mutation with the fieldId as variable
         await deleteFile({ variables: { fileId } });
         // Refetch projects after deletion
         refetch();
      } catch (error) {
         console.error('Error deleting project:', error);
      }
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const ActionRenderer = ({ value, data }: any) => (
      <Row
         justify="center"
         align="center"
         css={{ 'gap': '$8', '@md': { gap: 0 } }}
      >
         <Col css={{ d: 'flex' }}>
            <Tooltip content="Details">
               <IconButton aria-label="Example">
                  <MoreVertIcon sx={{ color: "#979797" }} />
               </IconButton>
            </Tooltip>
         </Col>
         <Col css={{ d: 'flex' }}>
            <Tooltip content="Edit file">
               <IconButton
                  onClick={() => console.log('Edit Project', value)}
               >
                  <EditIcon size={20} fill="#979797" />
               </IconButton>
            </Tooltip>
         </Col>
         <Col css={{ d: 'flex' }}>
            <Tooltip
               content="Delete File"
               color="error"
               onClick={() => handleDeleteFiles(data.fileId)}
            >
               <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
               </IconButton>
            </Tooltip>
         </Col>
      </Row>
   );

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const FileNameRenderer = ({ value, data }: any) => (
      <>
         {data.apsUrnKey !== "PENDING" ? <Link
            variant="body2"
            underline="none"
            target="_blank"
            rel="noopener"
            href={data.apsUrnKey ? `/viewer?id=${data.revisionId}` : `/web-viewer?id=${data.revisionId}`}
         >
            {value}
         </Link> : <Tooltip
               content="Please wait, generating APS metadata"
               color="error"
               onClick={() => {}}
            >
               {value}
            </Tooltip>}
      </>
   );

   const colDefs = [
      {
         field: "originalname",
         headerName: "File Name",
         filter: 'agSetColumnFilter',
         cellRenderer: FileNameRenderer
      },
      {
         field: "docRef",
         filter: 'agSetColumnFilter',
         headerName: "Doc Ref"
      },
      {
         field: "status",
         filter: 'agSetColumnFilter',
         headerName: "Status"
      },
      {
         field: "revision",
         filter: 'agSetColumnFilter',
         headerName: "Revision",
         width: 100
      },
      {
         field: "",
         resizable: false,
         cellRenderer: ActionRenderer
      }
   ];



   const gridOptions: GridOptions = {
      // Other grid options...
      domLayout: 'autoHeight',
   };  



   return (
      <Box
      >
         <Box component="div" className='ag-theme-quartz' sx={{ height: '100%', mt: 2 }}>
            <AgGridReact
               rowData={data?.getFileByFolderId.files || []}
               columnDefs={colDefs}
               gridOptions={gridOptions}

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
