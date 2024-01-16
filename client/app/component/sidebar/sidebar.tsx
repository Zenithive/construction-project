'use client'
import React, {useState} from 'react';
import {Box} from '../styles/box';
import {Sidebar} from './sidebar.styles';
import {Flex} from '../styles/flex';
import {CompaniesDropdown} from './companies-dropdown';
import {SidebarItem} from './sidebar-item';
import {useSidebarContext} from '../layout/layout-context';
import {usePathname} from 'next/navigation';
import { useAppSelector } from '../../reducers/hook.redux';
import { selectModule } from '../../reducers/moduleReducer';
import { MODULES } from '../../constants/modules.constant';

export const SidebarWrapper = () => {
   const moduleName = useAppSelector(selectModule);
   const childList = MODULES.find((objName)=> {
      if(objName.name== moduleName) return objName
   })?.subModules || [];
   
   const pathName = usePathname()
   const {collapsed, setCollapsed} = useSidebarContext();


   return (
      <Box
         as="aside"
         css={{
            height: '100vh',
            zIndex: 202,
            position: 'sticky',
            top: '0',
         }}
      >
         {collapsed ? <Sidebar.Overlay onClick={setCollapsed} /> : null}

         <Sidebar collapsed={collapsed}>
            <Sidebar.Header>
               <CompaniesDropdown />
            </Sidebar.Header>
            <Flex
               direction={'column'}
               css={{height: '100%'}}
            >
               <Sidebar.Body className="body sidebar">
                  { childList.map((obj, index)=>(
                     <SidebarItem
                        title={obj.name}
                        key={index}
                        icon={obj.icon}
                        isActive={pathName === obj.route }
                        href={obj.route}
                     />
                  ))}
                  
               </Sidebar.Body>
              
            </Flex>
         </Sidebar>
      </Box>
   );
};
