import React from 'react';
import {useLockedBody} from '../hooks/useBodyLock';
import {NavbarWrapper} from '../navbar/navbar';
import {SidebarWrapper} from '../sidebar/sidebar';
import {SidebarContext} from './layout-context';
import {WrapperLayout} from './layout.styles';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {createTheme, NextUIProvider} from '@nextui-org/react';
import { DARK_COLORS, LIGHT_COLORS } from './theme.colors';

interface Props {
   children: React.ReactNode;
}
const lightTheme = createTheme({
   type: 'light',
   theme: {
      colors: LIGHT_COLORS,
   },
});

const darkTheme = createTheme({
   type: 'dark',
   theme: {
      colors: DARK_COLORS,
   },
});

export const Layout = ({children}: Props) => {
   const [sidebarOpen, setSidebarOpen] = React.useState(false);
   const [_, setLocked] = useLockedBody(false);
   const handleToggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
      setLocked(!sidebarOpen);
   };

   return (
      <NextThemesProvider
         defaultTheme="system"
         attribute="class"
         value={{
            light: lightTheme.className,
            dark: darkTheme.className,
         }}
      >
         <NextUIProvider>
            <SidebarContext.Provider
               value={{
                  collapsed: sidebarOpen,
                  setCollapsed: handleToggleSidebar,
               }}
            >
               <WrapperLayout>
                  <SidebarWrapper />
                  <NavbarWrapper>{children}</NavbarWrapper>
               </WrapperLayout>
            </SidebarContext.Provider>
         </NextUIProvider>
      </NextThemesProvider>
      
   );
};
