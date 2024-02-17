import {Table} from '@nextui-org/react';
import React, {useEffect} from 'react';
import {Box} from '../styles/box';
import {columns} from './data';
import {RenderCell} from './render-cell';
import { GET_PROJECTS } from '../../api/project/queries';
import { useQuery } from '@apollo/client';
import { ProjectTypes } from './add-project';

export interface ProjectListWrapperProps{
   listRefresh: boolean;
}
export const ProjectListWrapper = ({listRefresh}:ProjectListWrapperProps) => {
   const { data, refetch } = useQuery(GET_PROJECTS);

   useEffect(()=>{
      refetch();
   }, [listRefresh, refetch]);

   return (
      <Box
         css={{
            '& .nextui-table-container': {
               boxShadow: 'none',
            },
         }}
      >
         <Table
            aria-label="Example table with custom cells"
            css={{
               height: 'auto',
               minWidth: '100%',
               boxShadow: 'none',
               width: '100%',
               px: 0,
            }}
            selectionMode="multiple"
         >
            <Table.Header columns={columns}>
               {(column) => (
                  <Table.Column
                     key={column.uid}
                     hideHeader={column.uid === 'actions'}
                     align={column.uid === 'actions' ? 'center' : 'start'}
                  >
                     {column.name}
                  </Table.Column>
               )}
            </Table.Header>
            <Table.Body items={data?.getProjects || []}>
               {(item:ProjectTypes) => (
                  <Table.Row key={Math.random()}>
                     {(columnKey:React.Key) => (
                        <Table.Cell>
                           {/* {JSON.stringify(columnKey)} */}
                           {RenderCell({project: item, columnKey: columnKey})}
                        </Table.Cell>
                     )}
                  </Table.Row>
               )}
            </Table.Body>
            <Table.Pagination
               shadow
               noMargin
               align="center"
               rowsPerPage={8}
            />
         </Table>
      </Box>
   );
};
