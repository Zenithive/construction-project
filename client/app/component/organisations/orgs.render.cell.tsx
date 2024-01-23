import {Col, Row, Text, Tooltip} from '@nextui-org/react';
import React from 'react';
import {DeleteIcon} from '../icons/table/delete-icon';
import {EditIcon} from '../icons/table/edit-icon';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './orgs.styled';
import { OrganisationTypes } from './add-organisation';

interface Props {
   user: OrganisationTypes;
   columnKey: string | React.Key;
}

export const RenderCell = ({user, columnKey}: Props) => {
   // @ts-ignore
   const cellValue = user[columnKey];
   switch (columnKey) {
      case 'name':
         return (
            <Text>{user.orgName}</Text>
         );
      case 'role':
         return (
            <Text>{user.region}</Text>
         );
      case 'status':
         return (
            // @ts-ignore
            <StyledBadge type={String(user.status)}>{cellValue}</StyledBadge>
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
                        onClick={() => console.log('View user', user.orgId)}
                     >
                        <EyeIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Edit user">
                     <IconButton
                        onClick={() => console.log('Edit user', user.orgId)}
                     >
                        <EditIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip
                     content="Delete user"
                     color="error"
                     onClick={() => console.log('Delete user', user.orgId)}
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
