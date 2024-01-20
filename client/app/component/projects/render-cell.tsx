import {Col, Row, Text, Tooltip} from '@nextui-org/react';
import React from 'react';
import {DeleteIcon} from '../icons/table/delete-icon';
import {EditIcon} from '../icons/table/edit-icon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {IconButton, StyledBadge} from './project-list.styled';
import { ProjectTypes } from './add-project';

interface Props {
   project: ProjectTypes;
   columnKey: string | React.Key;
}

export const RenderCell = ({project, columnKey}: Props) => {
   // @ts-ignore
   const cellValue = project[columnKey];
   switch (columnKey) {
      case 'projName':
         return (
            <Col>
               <Row>
                  <Text b size={14} css={{tt: 'capitalize'}}>
                     {project.projName}
                  </Text>
               </Row>
            </Col>
         );
      case 'region':
         return (
            <Col>
               <Row>
                  <Text b size={14} css={{tt: 'capitalize'}}>
                     {cellValue}
                  </Text>
               </Row>
               
            </Col>
         );
      case 'status':
         return (
            // @ts-ignore
            <StyledBadge type={String(project.status)}>{cellValue}</StyledBadge>
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
                     <IconButton aria-label="Example">
                        <MoreVertIcon sx={{ color: "#979797" }} />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Edit user">
                     <IconButton
                        onClick={() => console.log('Edit Project', project.orgId)}
                     >
                        <EditIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip
                     content="Delete Project"
                     color="error"
                     onClick={() => console.log('Delete user', project.orgId)}
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
