import {Col, Row, Text, Tooltip} from '@nextui-org/react';
import React from 'react';
import { Badge, Box } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import {DeleteIcon} from '../icons/table/delete-icon';
import {EditIcon} from '../icons/table/edit-icon';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './users.styled';
import { UserTypes } from './add-user';

interface Props {
   user: UserTypes;
   columnKey: string | React.Key;
}

export const RenderCell = ({user, columnKey}: Props) => {
   // @ts-ignore
   const cellValue = user[columnKey];
   switch (columnKey) {
      case 'name':
         return (
            // <User squared src={user.avatar} name={cellValue} css={{p: 0}}>
            //    {user.email}
            // </User>
            <Text>{`${user.firstName} ${user.lastName}`}</Text>
            
         );
      case 'email':
         return (
            <Text>{`${user.email}`}</Text>
         );
      case 'status':
         return (
            <Box component="div" style={{alignItems:"center"}}>
               <Badge badgeContent={cellValue} color="primary"></Badge>
            </Box>
         );

      case 'actions':
         return (
            <Row
               justify="center"
               align="center"
               css={{'gap': '$8', '@md': {gap: 0}}}
            >
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Details">
                     <IconButton
                        onClick={() => console.log('View user', user.email)}
                     >
                        <EyeIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Edit user">
                     <IconButton
                        onClick={() => console.log('Edit user', user.email)}
                     >
                        <EditIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip
                     content="Delete user"
                     color="error"
                     onClick={() => console.log('Delete user', user.email)}
                  >
                     <IconButton>
                        <DeleteIcon size={20} fill="#FF0080" />
                     </IconButton>
                  </Tooltip>
               </Col>
            </Row>
         );
      default:
         return cellValue;
   }
};
