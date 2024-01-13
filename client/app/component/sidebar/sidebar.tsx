'use client'
import React, {useState} from 'react';
import {Box} from '../styles/box';
import {Sidebar} from './sidebar.styles';
import {Flex} from '../styles/flex';
import {CompaniesDropdown} from './companies-dropdown';
import {HomeIcon} from '../icons/sidebar/home-icon';
import {PaymentsIcon} from '../icons/sidebar/payments-icon';
import {BalanceIcon} from '../icons/sidebar/balance-icon';
import {AccountsIcon} from '../icons/sidebar/accounts-icon';
import {CustomersIcon} from '../icons/sidebar/customers-icon';
import {ProductsIcon} from '../icons/sidebar/products-icon';
import {ReportsIcon} from '../icons/sidebar/reports-icon';
import {CollapseItems} from './collapse-items';
import {SidebarItem} from './sidebar-item';
import {SidebarMenu} from './sidebar-menu';
import {useSidebarContext} from '../layout/layout-context';
import {ChangeLogIcon} from '../icons/sidebar/changelog-icon';
import {usePathname} from 'next/navigation';
import { ROUTE } from '../../constants/route.constant';
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
                  {/* <SidebarMenu title="Main Menu">
                     <SidebarItem
                        isActive={pathName === '/accounts'}
                        title="Accounts"
                        icon={<AccountsIcon />}
                        href="accounts"
                     />
                     <SidebarItem
                        isActive={pathName === '/payments'}
                        title="Payments"
                        icon={<PaymentsIcon />}
                     />
                     <CollapseItems
                        icon={<BalanceIcon />}
                        items={['Banks Accounts', 'Credit Cards', 'Loans']}
                        title="Balances"
                     />

                     <SidebarItem
                        isActive={pathName === '/customers'}
                        title="Customers"
                        icon={<CustomersIcon />}
                     />
                     <SidebarItem
                        isActive={pathName === '/products'}
                        title="Products"
                        icon={<ProductsIcon />}
                     />
                     <SidebarItem
                        isActive={pathName === '/reports'}
                        title="Reports"
                        icon={<ReportsIcon />}
                     />
                  </SidebarMenu> */}

                  {/* <SidebarMenu title="General">
                     <SidebarItem
                        isActive={router.pathname === '/developers'}
                        title="Developers"
                        icon={<DevIcon />}
                     />
                     <SidebarItem
                        isActive={router.pathname === '/view'}
                        title="View Test Data"
                        icon={<ViewIcon />}
                     />
                     <SidebarItem
                        isActive={router.pathname === '/settings'}
                        title="Settings"
                        icon={<SettingsIcon />}
                     />
                  </SidebarMenu> */}

                  {/* <SidebarMenu title="Updates">
                     <SidebarItem
                        isActive={pathName === '/changelog'}
                        title="Changelog"
                        icon={<ChangeLogIcon />}
                     />
                  </SidebarMenu> */}
               </Sidebar.Body>
               {/* <Sidebar.Footer>
                  <Tooltip content={'Settings'} rounded color="primary">
                     <SettingsIcon />
                  </Tooltip>
                  <Tooltip content={'Adjustments'} rounded color="primary">
                     <FilterIcon />
                  </Tooltip>
                  <Tooltip content={'Profile'} rounded color="primary">
                     <Avatar
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        size={'sm'}
                     />
                  </Tooltip>
               </Sidebar.Footer> */}
            </Flex>
         </Sidebar>
      </Box>
   );
};
