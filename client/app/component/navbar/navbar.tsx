import { Link, Navbar } from '@nextui-org/react';
import React, { Suspense } from 'react';
import { Box } from '../styles/box';
import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';
import ProjectSelectedComponent from './project-selected-componet';

interface Props {
   children: React.ReactNode;
   projId?: string;
   userId?: string;
}

export const NavbarWrapper = ({ children }: Props) => {

   const collapseItems = [
      'Profile',
      'Dashboard',
      'Activity',
      'Analytics',
      'System',
      'Deployments',
      'My Settings',
      'Team Settings',
      'Help & Feedback',
      'Log Out',
   ];


   return (
      <Suspense fallback={<p>Loading...</p>}>
         <Box
            css={{
               position: 'absolut',
               display: 'flex',
               flexDirection: 'column',
               flex: '1 1 auto',
               overflowY: 'auto',
               overflowX: 'hidden',
            }}
         >
            <Navbar
               isBordered
               css={{
                  'borderBottom': '1px solid $border',
                  'justifyContent': 'space-between',
                  'width': '100%',
                  '@md': {
                     justifyContent: 'space-between',
                  },

                  '& .nextui-navbar-container': {
                     'border': 'none',
                     'padding-left': '6px',
                     'maxWidth': '100%',
                     background: "$customBackGround",

                     'gap': '$6',
                     '@md': {
                        justifyContent: 'space-between',
                     },
                  },
               }}
            >
               <Navbar.Content showIn="md">
                  <BurguerButton />
               </Navbar.Content>
               <Navbar.Content
               hideIn={'md'}
                  css={{
                     width: '100%',
                  }}
               >
                  <ProjectSelectedComponent />
               </Navbar.Content>
               <Navbar.Content>

                  <Navbar.Content>
                     <NotificationsDropdown />
                  </Navbar.Content>

                  <Navbar.Content>
                     <UserDropdown />
                  </Navbar.Content>
               </Navbar.Content>

               <Navbar.Collapse>
                  {collapseItems.map((item, index) => (
                     <Navbar.CollapseItem
                        key={item}
                        activeColor="secondary"
                        css={{
                           color:
                              index === collapseItems.length - 1 ? '$error' : '',
                        }}
                        isActive={index === 2}
                     >
                        <Link
                           color="inherit"
                           css={{
                              minWidth: '100%',
                           }}
                           href="#"
                        >
                           {item}
                        </Link>
                     </Navbar.CollapseItem>
                  ))}
               </Navbar.Collapse>
            </Navbar>
            {children}
         </Box>
      </Suspense>
   );
};
