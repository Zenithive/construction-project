import {Button, Input} from '@nextui-org/react';
import React from 'react';
import {DotsIcon} from '../icons/accounts/dots-icon';
import {ExportIcon} from '../icons/accounts/export-icon';
import {InfoIcon} from '../icons/accounts/info-icon';
import {TrashIcon} from '../icons/accounts/trash-icon';
import {SettingsIcon} from '../icons/sidebar/settings-icon';
import {Flex} from '../styles/flex';
import {AddOrganisation} from './add-organisation';
import { OrgsListWrapper } from './orgs.list';
import { EDITE_ORGANISATION } from 'client/app/api/organisation/mutations';
import { useQuery } from '@apollo/client';


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
