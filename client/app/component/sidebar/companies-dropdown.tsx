'use client'
import {Dropdown, Text} from '@nextui-org/react';
import React, {useState} from 'react';
import {AcmeIcon} from '../icons/acme-icon';
import {BottomIcon} from '../icons/sidebar/bottom-icon';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';
import { useAppDispatch, useAppSelector } from '../../reducers/hook.redux';
import { addModule, selectModule } from '../../reducers/moduleReducer';
import { MODULES } from '../../constants/modules.constant';
import { useRouter } from 'next/navigation';


export interface Company {
   name: string;
   location: string;
   logo: React.ReactNode;
}

export const CompaniesDropdown = () => {
   const moduleName = useAppSelector(selectModule)
   
   const [company, setCompany] = useState<Company>({
      name: moduleName || 'CDE',
      location: '',
      logo: <AcmeIcon />,
   });
   const router = useRouter();

   const dispatch = useAppDispatch();
   const navigateToPage = (index:React.Key) => {
      const modIndex = parseInt(index.toString());
      const modObj = MODULES[modIndex];
      if(modObj){
         setCompany({
            name: modObj.name,
            location: '',
            logo: <AcmeIcon />,
         });
         dispatch(addModule(modObj.name));
         router.push(modObj.route);
      }
   }
   return (
      <Dropdown placement="bottom-right" borderWeight={'extrabold'} >
         <Dropdown.Trigger css={{cursor: 'pointer'}} >
            <Box>
               <Flex align={'center'} css={{gap: '$7'}}>
                  {company.logo}
                  <Box>
                     <Text
                        h3
                        size={'$xl'}
                        weight={'medium'}
                        css={{
                           m: 0,
                           color: '$customForGround',
                           lineHeight: '$lg',
                           mb: '-$5',
                        }}
                     >
                        {company.name}
                     </Text>
                     <Text
                        span
                        weight={'medium'}
                        size={'$xs'}
                        css={{color: '$customForGround'}}
                     >
                        {company.location}
                     </Text>
                  </Box>
                  <BottomIcon />
               </Flex>
            </Box>
         </Dropdown.Trigger>
         <Dropdown.Menu
            onAction={navigateToPage}
            aria-label="Avatar Actions"
            css={{
               '$$dropdownMenuWidth': '340px',
               '$$dropdownItemHeight': '60px',
               '& .nextui-dropdown-item': {
                  'py': '$2',
                  // dropdown item left icon
                  'svg': {
                     color: '$secondary',
                     mr: '$4',
                  },
                  // dropdown item title
                  '& .nextui-dropdown-item-content': {
                     w: '100%',
                     fontWeight: '$semibold',
                  },
               },
            }}
         >
            <Dropdown.Section title="Modules">
               {MODULES.map((objModule,key) => {
                  return(
                  <Dropdown.Item
                     key={key}
                     icon={<AcmeIcon />}
                     description=""
                  >
                     {objModule.name}
                  </Dropdown.Item>)
               })}
            </Dropdown.Section>
         </Dropdown.Menu>
      </Dropdown>
   );
};
