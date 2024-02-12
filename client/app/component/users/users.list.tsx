import {Table} from '@nextui-org/react';
import React, { useEffect } from 'react';
import {Box} from '../styles/box';
import {USER_COLUMNS} from './users.data';
import {RenderCell} from './user.render.cell';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../api/user/queries';
import { UserTypes } from './add-user';

export interface UserLiserWrapperProps{
   listRefresh: boolean;
}

export const UserLiserWrapper = ({listRefresh}:UserLiserWrapperProps) => {

   const { data, refetch } = useQuery(GET_USERS);

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
            <Table.Header columns={USER_COLUMNS}>
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
            <Table.Body items={data?.getUsers || []}>
               {(item: UserTypes) => (
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
