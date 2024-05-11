import React from 'react';
import { GET_ALL_PROJECTS } from '../../api/project/queries';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Autocomplete, TextField ,Checkbox} from '@mui/material';
import { useFormik } from 'formik';
import { Stack } from "@mui/material"
import { useAppDispatch } from '../../reducers/hook.redux';
import { addproject, removeproject } from '../../reducers/projectReducer';
import { ADD_SELECTED_PROJECTS,REMOVE_SELECTED_PROJECTS } from '../../api/selected-projects/mutations';
import { useMutation } from '@apollo/client';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';
import { useAppSelector } from '../../reducers/hook.redux';
import { GET_SELECTED_PROJECTS } from '../../api/selected-projects/queries';
import {red} from "@mui/material/colors"
import { ProjectTypes } from '../projects/add-project';




 export const Project_Selected_Componet = () => {

    const dispatch = useAppDispatch();
    const [projListKeyPair, setprojListKeyPair] = React.useState<{ key: string; value: string }[]>([]);
    const { data, refetch } = useQuery(GET_ALL_PROJECTS);
    const userDetails: UserSchema = useAppSelector(selectUserSession);
    const { data: selectedProjectsData, refetch:refetchselectedProjectData} = useQuery(GET_SELECTED_PROJECTS, {
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
          console.log("proj", data)
          console.log("GET_ALL_PROJECT", GET_ALL_PROJECTS);
          refetch();
    }, [refetch]);
    
 
    useEffect(() => {
       if (data && data.getAllProject) {
          const tmpProjectList = data.getAllProject.map((elem: ProjectTypes) => {
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
          const selectedProjects = selectedProjectsData.getSelectedProjects.map((project: ProjectTypes) => project.projId,userDetails.userId);
          formik.setFieldValue('projId', selectedProjects);
          refetchselectedProjectData();
       }
    }, [selectedProjectsData,refetchselectedProjectData, projListKeyPair]);
 
    useEffect(() => {
       console.log("formik.values === ", formik.values);
       console.log("projListKeyPair === ", projListKeyPair);
    }, [formik.values, projListKeyPair]);
 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleProjectChange = (e: any, values: any) => {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const selectedProjectKeys = values.map((selectedProject: any) => selectedProject.key);
       const currentSelectedProjectKeys = formik.values.projId;
 
       const tmpObj: { [key: string]: { projId: string; projName: string; userId:string} } = {};
       const tmpObjRemove:{[key:string]:{projId: string;userId:string}}={};
     
       if (selectedProjectKeys.length > currentSelectedProjectKeys.length) { 
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const newlySelectedProjects = values.filter((project: any) => !currentSelectedProjectKeys.includes(project.key));
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         newlySelectedProjects.forEach((project: any) => {
           tmpObj[project.key] = { projId: project.key, projName: project.value,userId:userDetails.userId };
         });
         
         dispatch(addproject(Object.values(tmpObj)));
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any) => !selectedProjectKeys.includes(option.key) && currentSelectedProjectKeys.includes(option.key)
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deselectedProjects.forEach((project: any) => {
          tmpObjRemove[project.key] = { projId: project.key, userId: userDetails.userId };
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(removeproject(Object.values(tmpObjRemove)));

        const temp = {...tmpObjRemove}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const handleKeyDown = (event:any) => {
      if (event.key === 'Backspace') {
          event.stopPropagation();
      }
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