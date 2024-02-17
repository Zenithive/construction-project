import {Table} from '@nextui-org/react';
import React, { useEffect } from 'react';
import {Box} from '../styles/box';
import {columns} from './orgs.data';
import {RenderCell} from './orgs.render.cell';
import { useQuery } from '@apollo/client';
import { GET_ORGANISATIONS } from '../../api/organisation/queries';
import { OrganisationTypes } from './add-organisation';

export interface OrgsListWrapperProps{
   listRefresh: boolean;
}

export const OrgsListWrapper = ({listRefresh}:OrgsListWrapperProps) => {
   const { data, refetch } = useQuery(GET_ORGANISATIONS);

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
            <Table.Body items={data?.getAllOrg || []}>
               {(item: OrganisationTypes) => (
                  <Table.Row key={Math.random()}>
                     {(columnKey:React.Key) => (
                        <Table.Cell>
                           {RenderCell({user: item, columnKey: columnKey})}
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
               onPageChange={(page) => console.log({page})}
            />
         </Table>
      </Box>
   );
};
