import {Col, Row, Text, Tooltip} from '@nextui-org/react';
import React from 'react';
import {DeleteIcon} from '../icons/table/delete-icon';
import {EditIcon} from '../icons/table/edit-icon';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './file-list.styled';
import { FileSchemaType } from './add-file';

interface Props {
   file: FileSchemaType;
   columnKey: string | React.Key;
}

export const RenderCell = ({file, columnKey}: Props) => {
   // @ts-ignore
   const cellValue = file[columnKey];
   switch (columnKey) {
      case 'name':
         return (
            <Col>
               <Row>
                  <Text b size={14} css={{tt: 'capitalize'}}>
                     {file.originalname}
                  </Text>
               </Row>
            </Col>
         );
      case 'role':
         return (
            <Col>
               <Row>
                  <Text b size={14} css={{tt: 'capitalize'}}>
                     {cellValue}
                  </Text>
               </Row>
               <Row>
                  <Text
                     b
                     size={13}
                     css={{tt: 'capitalize', color: '$accents7'}}
                  >
                     {file.docRef}
                  </Text>
               </Row>
            </Col>
         );
      case 'status':
         return (
            // @ts-ignore
            <StyledBadge type={String(file.status)}>{cellValue}</StyledBadge>
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
                        onClick={() => console.log('View File', file)}
                     >
                        <EyeIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Edit user">
                     <IconButton
                        onClick={() => console.log('Edit File', file)}
                     >
                        <EditIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip
                     content="Delete user"
                     color="error"
                     onClick={() => console.log('Delete File', file)}
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
