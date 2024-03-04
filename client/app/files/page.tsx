"use client"
import {Button, Input} from '@nextui-org/react';
import React from 'react';
import {DotsIcon} from '../component/icons/accounts/dots-icon';
import {ExportIcon} from '../component/icons/accounts/export-icon';
import {InfoIcon} from '../component/icons/accounts/info-icon';
import {TrashIcon} from '../component/icons/accounts/trash-icon';

import {SettingsIcon} from '../component/icons/sidebar/settings-icon';
import {Flex} from '../component/styles/flex';
import {FilesListWrapper} from '../component/files/files-list';
import {FolderTree} from '../component/files/folder.tree';
import {AddFile} from '../component/files/add-file';
import { Box } from '@mui/material';

/* eslint-disable-next-line */
export interface FilesProps {}

export default function Files(props: FilesProps) {
   const [listRefresh, setListRefresh] = React.useState(false);

  return (
    <Flex
       css={{
          'mt': '$5',
          'px': '$6',
          '@sm': {
             mt: '$10',
             px: '$8',
          },
       }}
       justify={'center'}
       direction={'column'}
    >
       
       <Flex
          css={{gap: '$8'}}
          align={'center'}
          justify={'between'}
          wrap={'wrap'}
       >
          <Flex
             css={{
                'gap': '$6',
                'flexWrap': 'wrap',
                '@sm': {flexWrap: 'nowrap'},
             }}
             align={'center'}
          >
             {/* <Input
                css={{width: '100%', maxW: '410px'}}
                placeholder="Search files"
             />
             <SettingsIcon />
             <TrashIcon />
             <InfoIcon />
             <DotsIcon /> */}
          </Flex>
          <Flex direction={'row'} css={{gap: '$6'}} wrap={'wrap'}>
             <AddFile setListRefresh={setListRefresh} />
             {/* <Button auto iconRight={<ExportIcon />}>
                Export to CSV
             </Button> */}
          </Flex>
       </Flex>

       <Flex>
         <Box component="div" sx={{flex: 1}}>
            <FolderTree />
         </Box>
         <Box component="div" sx={{flex: 4}}>
            <FilesListWrapper listRefresh={listRefresh} />
         </Box>
       </Flex>

    </Flex>
 );
}
