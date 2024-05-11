"use client"
import React, { useState } from 'react';
import {Flex} from '../component/styles/flex';
import {FilesListWrapper} from '../component/files/files-list';
import {FolderTree} from '../component/files/folder.tree';
import {AddFile} from '../component/files/add-file';
import { Box, Link } from '@mui/material';

/* eslint-disable-next-line */
export interface FilesProps {}
export interface toggleUploadModalInterface {
   isUploadModalOpen: boolean; 
   setIsUploadModalOpen: CallableFunction;
}

/////////////////
export interface FolderIdInterface {
   folderId: string;
   setFolderId: (nodeIds: string) => void;
 }

const useToggleUploadModal = ():toggleUploadModalInterface => {
   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

   return {
      isUploadModalOpen,
      setIsUploadModalOpen
   }
}

//////////////
const useFolderId = (initialFolderId: string): FolderIdInterface => {
   const [folderId, setFolderId] = useState(initialFolderId);
 
   return {
     folderId,
     setFolderId(nodeIds: string) {
        setFolderId(nodeIds);
     }
   };
 };



export default function Files(props: FilesProps) {
   const [listRefresh, setListRefresh] = React.useState(false);
   const folderIdHook = useFolderId('');  ////////
   const toggleUploadModalHook = useToggleUploadModal();

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
             <AddFile setListRefresh={setListRefresh} toggleUploadModalHook={toggleUploadModalHook} 
             folderIdHook={folderIdHook} 
             />
             
             <Link
               variant="body2" 
               underline="none"
               target="_blank"
               rel="noopener"
               href={`/web-viewer?id=a3686222-24dd-4f46-99aa-35f8df773b04`}
               >
               Open File
            </Link>
          </Flex>
       </Flex>

       <Flex>
         <Box component="div" sx={{flex: 1}}>
            <FolderTree toggleUploadModalHook={toggleUploadModalHook}  folderIdHook={folderIdHook}/>
         </Box>
         <Box component="div" sx={{flex: 4}}>
            <FilesListWrapper folderIdHook={folderIdHook} listRefresh={listRefresh} />
         </Box>
       </Flex>

    </Flex>
 );
}
