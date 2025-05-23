import {Dropdown, Navbar, Text} from '@nextui-org/react';
import React from 'react';
import {DarkModeSwitch} from './darkmodeswitch';
import { Avatar } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation'
import { LOGOUT } from '../../api/user/queries';
import { useAppSelector } from '../../reducers/hook.redux';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { getUserInitials } from '../../services/user.service';
import { UserTypes } from '../users/add-user';

export const UserDropdown = () => {

   const userDetails:UserSchema = useAppSelector(selectUserSession)

   const userInitials = getUserInitials({...userDetails} as UserTypes);

   const router = useRouter();

   const {data, refetch } = useQuery(LOGOUT);

   const logOutHandle = async () => {
     await refetch();

      if(data?.logout?.message){
         document.cookie = `tokenId=`;
         router.push("/login");
      }

   }

   const actionHandler = (key: React.Key) =>  {
      if(key == "logout"){
         logOutHandle();
      }
   }
   return (
      <Dropdown placement="bottom-right">
         <Navbar.Item>
            <Dropdown.Trigger>
               <Avatar>{userInitials}</Avatar>
            </Dropdown.Trigger>
         </Navbar.Item>
         <Dropdown.Menu
            aria-label="User menu actions"
            onAction={actionHandler}
         >
            <Dropdown.Item key="profile" css={{height: '$18'}}>
               <Text b color="inherit" css={{d: 'flex'}}>
                  Signed in as
               </Text>
               <Text b color="inherit" css={{d: 'flex'}}>
                  {userDetails.email}
               </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
               My Settings
            </Dropdown.Item>
            <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
            <Dropdown.Item key="analytics" withDivider>
               Analytics
            </Dropdown.Item>
            <Dropdown.Item key="system">System</Dropdown.Item>
            <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
               Help & Feedback
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
               Log Out
            </Dropdown.Item>
            <Dropdown.Item key="switch" withDivider>
               <DarkModeSwitch />
            </Dropdown.Item>
         </Dropdown.Menu>
      </Dropdown>
   );
};
