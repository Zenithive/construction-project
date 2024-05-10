import React, { Suspense } from 'react';
import { GET_ALL_PROJECTS } from 'client/app/api/project/queries';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Autocomplete, Button, Grid, TextField ,Checkbox,ListSubheader, ListItemText, ListItemIcon, ListItem, List, Divider,Chip} from '@mui/material';
import { useFormik } from 'formik';
import { Stack } from "@mui/material"
import { useAppDispatch } from '../../reducers/hook.redux';
import { addproject, removeproject } from 'client/app/reducers/projectReducer';
import { ADD_SELECTED_PROJECTS,REMOVE_SELECTED_PROJECTS } from 'client/app/api/selected-projects/mutations';
import { useMutation } from '@apollo/client';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '../../reducers/hook.redux';
import { GET_SELECTED_PROJECTS } from 'client/app/api/selected-projects/queries';
import { _TRN_EmbeddedTimestampVerificationResultGetUnsupportedFeatures } from 'client/public/lib/core/pdf/full/optimized/PDFNetCWasm';
import {red} from "@mui/material/colors"




 export const Project_Selected_Componet = () => {

    const dispatch = useAppDispatch();
    const [visible, setVisible] = React.useState(false);
    const [projListKeyPair, setprojListKeyPair] = React.useState<{ key: string; value: string }[]>([]);
    const { data, loading, error, refetch } = useQuery(GET_ALL_PROJECTS);
    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { data: selectedProjectsData, loading: selectedProjectsLoading, error: selectedProjectsError,refetch:refetchselectedProjectData} = useQuery(GET_SELECTED_PROJECTS, {
        variables: { 
        userId: userDetails.userId, 
        },
      });
    const [addSelectedProject] = useMutation(ADD_SELECTED_PROJECTS);
    const [removeSelectedProject] = useMutation(REMOVE_SELECTED_PROJECTS);

     
    const formik = useFormik({
       initialValues: {
          projId: '',
          userId: userDetails.userId, 
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
    }, [visible,refetch]);
    
 
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
 
    useEffect(() => { 
       console.log("selectedProjectsData", selectedProjectsData)
       if (selectedProjectsData && selectedProjectsData.getSelectedProjects && projListKeyPair.length) {
          const selectedProjects = selectedProjectsData.getSelectedProjects.map((project: any) => project.projId,userDetails.userId);
          formik.setFieldValue('projId', selectedProjects);
          refetchselectedProjectData();
       }
    }, [selectedProjectsData,refetchselectedProjectData, projListKeyPair]);
 
    useEffect(() => {
       console.log("formik.values === ", formik.values);
       console.log("projListKeyPair === ", projListKeyPair);
    }, [formik.values, projListKeyPair]);
 
    const handleProjectChange = (e: any, values: any) => {
       const selectedProjectKeys = values.map((selectedProject: any) => selectedProject.key);
       const currentSelectedProjectKeys = formik.values.projId;
 
       const tmpObj: { [key: string]: { projId: string; projName: string; userId:string} } = {};
       const tmpObjRemove:{[key:string]:{projId: string;userId:string}}={};
     
       if (selectedProjectKeys.length > currentSelectedProjectKeys.length) { 
         const newlySelectedProjects = values.filter((project: any) => !currentSelectedProjectKeys.includes(project.key));
         newlySelectedProjects.forEach((project: any) => {
           tmpObj[project.key] = { projId: project.key, projName: project.value,userId:userDetails.userId };
         });
         
         dispatch(addproject(Object.values(tmpObj)));
         const addProjectPromises = Object.values(tmpObj).map((project: any) =>
           addSelectedProject({
             variables: {
               input: {
                 projId: project.projId,
                 projName: project.projName,
                 userId: userDetails.userId,
               },
             },
           })
         );
         Promise.all(addProjectPromises)
           .then(() => {
             refetch();
             refetchselectedProjectData();
           })
           .catch((error) => {
             console.error("Error adding selected projects:", error);
           });
       }      
       else {
       const deselectedProjects = projListKeyPair.filter(
          (option: any) => !selectedProjectKeys.includes(option.key) && currentSelectedProjectKeys.includes(option.key)
        );
        deselectedProjects.forEach((project: any) => {
          tmpObjRemove[project.key] = { projId: project.key, userId: userDetails.userId };
        });
        dispatch(removeproject(Object.values(tmpObjRemove)));

        const temp = {...tmpObjRemove}
        const removeProjectPromises = Object.values(temp).map((project: any) => {
          return removeSelectedProject({
            variables: {
              input:{
                projId: project.projId,
                userId: userDetails.userId
              },
            },
          });
        });
        console.log("removeproject",removeProjectPromises)
        Promise.all(removeProjectPromises)
          .then(() => {
            console.log("Selected projects removed successfully");
            refetchselectedProjectData();
          })
          .catch((error) => {
            console.error("Error removing selected projects:", error);
          });
          formik.setFieldValue("projId", selectedProjectKeys);
       }
     };

     const handleKeyDown = (event:any) => {
      if (event.key === 'Backspace') {
          event.stopPropagation();
      }
  };
  const handleSearchChange = (event:any, value:any) => {
   const inputValue = (typeof value === 'string' ? value : '').toLowerCase();
   const inputLength = inputValue.length;
   return inputLength === 0
       ? projListKeyPair
       : projListKeyPair.filter(option =>
           typeof option.value === 'string' && option.value.toLowerCase().includes(inputValue)
       );
};


     return (
        <Stack spacing={3} sx={{ width: 1200, background: "white", top: "5px", position: "relative", right: "25px" }}>
        {projListKeyPair.length ? (
           <Autocomplete 
              disablePortal
              multiple
              onChange={handleProjectChange}
              getOptionLabel={(option) => option.value}
              value={projListKeyPair.filter((org) => formik.values.projId.includes( org.key))}
              options={projListKeyPair.sort((a, b) => {
               const aSelected = formik.values.projId.includes(a.key);
               const bSelected = formik.values.projId.includes(b.key);
               if (aSelected && !bSelected) return -1; 
               if (!aSelected && bSelected) return 1;
               return 0;   
           })}
       
         disableCloseOnSelect={true}
         disableClearable={true} 
         autoHighlight={true} 
           renderInput={(params) => (
              <TextField
                 {...params}
                 id='projId'
                 name="projId"
                 value={formik.values.projId}
                 InputProps={{
                  ...params.InputProps,
                  readOnly: true, 
                  style: { cursor: 'pointer' } ,
                  onKeyDown: handleKeyDown ,
              }}
                 error={formik.touched.projId && Boolean(formik.errors.projId)}
                 helperText={formik.touched.projId && formik.errors.projId=== 'string' ? formik.errors.projId : ''}
              /> 
           )}
        
              renderOption={(props, option) => (
               <li {...props} >
                   <Checkbox  sx={{
                           color: red[800],
                           '&.Mui-checked': {
                              color: red[600],
                           },
                        }}
                       checked={formik.values.projId.includes(option.key)}
                       onChange={(e) => {
                           handleProjectChange(e, option);
                       }}
                   />
                   {option.value}
               </li>
           )}
           renderTags={(value, getTagProps) => (
            <div>
                {value.length <= 14 ? (
                    value.map((option, index:number) => (
                        <span
                            key={index}
                            {...getTagProps({ index })}
                            style={{
                                fontWeight: 'bold',
                                marginRight: '8px', 
                            }}
                        >
                            {option.value}{index < value.length - 1 ? ', ' : ''}
                        </span>
                    ))
                ) : (
                   
                    <>
                        {value.slice(0, 14).map((option, index:number) => (
                            <span
                                key={index}
                                {...getTagProps({ index })}
                                style={{
                                    fontWeight: 'bold',
                                    marginRight: '8px', 
                                }}
                            >
                                {option.value}{index < 13 ? ', ' : ''}
                            </span>
                        ))}
                        <span style={{ fontWeight: 'bold' }}>...</span>
                    </>
                )}
            </div>
        )}
           />
  
        ) : (
           ""
        )}

     </Stack>
   
       );
    };

    export default Project_Selected_Componet;