import {Col, Row, Table, Tooltip} from '@nextui-org/react';
import { GridOptions } from 'ag-grid-community';
import React, { useEffect, useState } from 'react';
import {RenderCell} from './file-render-cell';
import { useQuery } from '@apollo/client';
import { GET_FILES } from '../../api/file/queries';
import { FileSchemaType } from './add-file';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { Box, IconButton, Link } from '@mui/material';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';

export interface FilesListWrapperProps{
   listRefresh: boolean;
}

export const FilesListWrapper = ({listRefresh}:FilesListWrapperProps) => {

   const { data, refetch } = useQuery(GET_FILES);

   const [rowData, setRowData] = useState([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ActionRenderer = ({ value }:any) => (
      <Row
         justify="center"
         align="center"
         css={{'gap': '$8', '@md': {gap: 0}}}
      >
         <Col css={{d: 'flex'}}>
            <Tooltip content="Details">
               <IconButton aria-label="Example">
                  <MoreVertIcon sx={{ color: "#979797" }} />
               </IconButton>
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const FileNameRenderer = ({ value, data }:any) => (
      <Link
         variant="body2" 
         underline="none"
         target="_blank"
         rel="noopener"
         href={`/viewer?id=${data.apsUrnKey}`}
         >
         {value}
      </Link>
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

    
   
    const gridOptions:GridOptions = {
      // Other grid options...
      domLayout: 'autoHeight',
    };
    
   useEffect(()=>{
      refetch();
   }, [listRefresh, refetch]);
   
   return (
      <Box
      >
         <Box component="div" className='ag-theme-quartz' sx={{height: '100%', mt: 2}}>
            <AgGridReact 
               rowData={data?.getFiles || []} 
               columnDefs={colDefs}
               gridOptions={gridOptions}

            />
         </Box>
      </Box>
   );
};
