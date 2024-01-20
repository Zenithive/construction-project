import React from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Button } from '@mui/material';

export const FolderTree = () => {
   

   return (
      <>
        <Box component="h3" sx={{marginTop: 2}}>FOLDERS</Box>
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            <TreeItem nodeId="1" label="Applications">
            <TreeItem nodeId="2" label="Calendar" />
            </TreeItem>
            <TreeItem nodeId="5" label="Documents">
            <TreeItem nodeId="10" label="OSS" />
            <TreeItem nodeId="6" label="MUI">
                <TreeItem nodeId="8" label="index.js" />
            </TreeItem>
            </TreeItem>
        </TreeView>
        <Button type='button' variant='text'>+ Add Folder</Button>
      </>
   );
};
