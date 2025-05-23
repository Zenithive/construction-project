import React from 'react';
import {Flex} from '../styles/flex';
import {UserLiserWrapper} from './users.list'
import {AddUser} from './add-user';


export const Users = () => {
   const [listRefresh, setListRefresh] = React.useState(false);
   const [userData,setUSERDATA]=React.useState(null);

   return (
      <Flex
         css={{
            'mt': '$5',
            'px': '$6',
            '@sm': {
               mt: '$10',
               px: '$16',
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
                  placeholder="Search users"
               /> */}
               {/* <SettingsIcon /> */}
               {/* <TrashIcon /> */}
               {/* <InfoIcon /> */}
               {/* <DotsIcon /> */}
            </Flex>
            <Flex direction={'row'} css={{gap: '$6'}} wrap={'wrap'}>
               <AddUser setListRefresh={setListRefresh} userData={userData} setUSERDATA={setUSERDATA} />
               {/* <Button auto iconRight={<ExportIcon />}>
                  Export to CSV
               </Button> */}
            </Flex>
         </Flex>

         <UserLiserWrapper listRefresh={listRefresh} setUSERDATA={setUSERDATA}/>
      </Flex>
   );
};
