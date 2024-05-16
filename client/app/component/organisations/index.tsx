import React from 'react';
import {Flex} from '../styles/flex';
import {AddOrganisation} from './add-organisation';
import { OrgsListWrapper } from './orgs.list';

export const Organisations = () => {
   const [listRefresh, setListRefresh] = React.useState(false);
   const [organizationData, setOrganizationData] = React.useState(null);

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
              
            </Flex>
            <Flex direction={'row'} css={{gap: '$6'}} wrap={'wrap'}>
               <AddOrganisation setListRefresh={setListRefresh} organizationData={organizationData}  setOrganizationData={setOrganizationData}/>
         
            </Flex>
         </Flex>

         <OrgsListWrapper listRefresh={listRefresh} setOrganizationData={setOrganizationData}/>
      </Flex>
   );
};
