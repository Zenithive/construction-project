import {Divider, Input, Modal, Text} from '@nextui-org/react';
import Button from '@mui/material/Button';
import React from 'react';
import {Flex} from '../styles/flex';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: 1,
   overflow: 'hidden',
   position: 'absolute',
   bottom: 0,
   left: 0,
   whiteSpace: 'nowrap',
   width: 1,
 });

export const AddFile = () => {
   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);

   const closeHandler = () => {
      setVisible(false);
      console.log('closed');
   };

   const openViewer = () => {
      
   }

   return (
      <>
         <Button component="label" onClick={handler} sx={{borderRadius: 3}} variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
         </Button>

         <Button component="label" onClick={openViewer} sx={{borderRadius: 3}} variant="contained">
            View file
         </Button>

         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler}
         >
            <Modal.Header css={{justifyContent: 'start'}}>
               <Text id="modal-title" h4>
                  Add new File
               </Text>
            </Modal.Header>
            <Divider css={{my: '$5'}} />
            <Modal.Body css={{py: '$10'}}>
               <Flex
                  direction={'column'}
                  css={{
                     'flexWrap': 'wrap',
                     'gap': '$8',
                     '@lg': {flexWrap: 'nowrap', gap: '$12'},
                  }}
               >
                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="File Name"
                        bordered
                        clearable
                        fullWidth
                        size="lg"
                        placeholder="File Name"
                     />
                  </Flex>

                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload file
                        <VisuallyHiddenInput type="file" />
                     </Button>
                  </Flex>
                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="Status"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Status"
                     />
                  </Flex>
                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="Doc ref"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Doc ref"
                     />
                  </Flex>
               </Flex>
            </Modal.Body>
            <Divider css={{my: '$5'}} />
            <Modal.Footer>
               <Button variant='contained' onClick={closeHandler} sx={{borderRadius: 3}}>
                  Upload File
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
