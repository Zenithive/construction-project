import { Input, Link, Navbar, Text } from '@nextui-org/react';
import React, { Suspense } from 'react';
import { SearchIcon } from '../icons/searchicon';
import { Box } from '../styles/box';
import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';
import { GET_ALL_PROJECTS } from 'client/app/api/project/queries';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { Stack } from "@mui/material"
import { relative } from 'path';
import { useAppDispatch } from '../../reducers/hook.redux';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { addproject, removeproject } from 'client/app/reducers/projectReducer';
import { ProjectSchema } from 'client/app/reducers/projectReducer';




interface Props {
   children: React.ReactNode;
   projId: string;
}

export const NavbarWrapper = ({ children }: Props) => {

   const dispatch = useAppDispatch();
   const [visible, setVisible] = React.useState(false);
   const [projListKeyPair, setprojListKeyPair] = React.useState<{ key: string; value: string }[]>([]);
   const { data, loading, error, refetch } = useQuery(GET_ALL_PROJECTS);

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

   const formik = useFormik({
      initialValues: {
         projId: '',
      },
      onSubmit: values => {

      },
   });

   useEffect(() => {
      if (visible) {
         console.log("proj", data)
         console.log("GET_ALL_PROJECT", GET_ALL_PROJECTS);
         refetch();
      }
   }, [visible]);

   useEffect(() => {
      if (data && data.getAllProject) {
         const tmpProjectList = data.getAllProject.map((elem: any) => {
            return {
               key: elem.projId,
               value: elem.projName,
            };
         });

         setprojListKeyPair(tmpProjectList);
      }
      else {
         setprojListKeyPair([]);
      }

   }, [data]);

   // const handeleChange=()=>{}
   
   const handleProjectChange = (e: any, values: any) => {
      const selectedProjectKeys = values.map((selectedProject: any) => selectedProject.key);
      console.log("selectedProjectKeys", selectedProjectKeys);
    
      const currentSelectedProjectKeys = formik.values.projId;
    
      if (selectedProjectKeys.length > currentSelectedProjectKeys.length) {
        console.log("Adding projects");
    
        const newlySelectedProjects = values.filter((project: any) => !currentSelectedProjectKeys.includes(project.key));
        console.log("Newly selected projects:", newlySelectedProjects);
    
        const tmpObj = newlySelectedProjects.map((project: any) => ({ projId: project.key, projName: project.value }));
        console.log("Temporary object to add:", tmpObj);
    
        dispatch(addproject(tmpObj));
      } else {
        console.log("Removing projects");
    
        const deselectedProjects = projListKeyPair.filter((option: any) => !selectedProjectKeys.includes(option.key) && currentSelectedProjectKeys.includes(option.key));
        console.log("Deselected projects:", deselectedProjects);
    
        const tmpObjRemove = deselectedProjects.map((project: any) => ({ projId: project.key }));
        console.log("Temporary object to remove:", tmpObjRemove);
    
        dispatch(removeproject(tmpObjRemove));
    
        formik.setFieldValue('projId', selectedProjectKeys);
      }
    }
    

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


                  <Stack spacing={3} sx={{ width: 1200, background: "white", top: "5px", position: "relative", right: "25px" }}>
                     {projListKeyPair.length ? (
                        <Autocomplete
                           disablePortal
                           multiple
                            onChange={handleProjectChange}
                           getOptionLabel={(option) => option.value}
                           value={projListKeyPair.find((org) => org.key === formik.values.projId) || undefined}
                           includeInputInList
                           options={projListKeyPair || []}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 id='projId'
                                 name="projId"
                                 value={formik.values.projId}
                                 error={formik.touched.projId && Boolean(formik.errors.projId)}
                                 helperText={formik.touched.projId && formik.errors.projId}
                              />
                           )}
                        />

                     ) : (
                        ""
                     )}
                  </Stack>
               </Navbar.Content>
               <Navbar.Content>
                  {/* <Navbar.Content hideIn={'md'}>
                     <Flex align={'center'} css={{gap: '$4'}}>
                        <FeedbackIcon />
                        <Text span>Feedback?</Text>
                     </Flex>
                  </Navbar.Content> */}

                  <Navbar.Content>
                     <NotificationsDropdown />
                  </Navbar.Content>

                  {/* <Navbar.Content hideIn={'md'}>
                     <SupportIcon />
                  </Navbar.Content>
                  <Navbar.Content>
                     <Link
                        href="https://github.com/"
                        target={'_blank'}
                     >
                        <GithubIcon />
                     </Link>
                  </Navbar.Content> */}
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
