import React, { useCallback, useEffect, useState } from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography, colors } from '@mui/material';
import { Folder, MoreVert, CloudUpload, CreateNewFolder, Check, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_NEW_FOLDER } from '../../api/folder/mutations';
import { GET_FOLDERS } from '../../api/folder/queries';

const AddFolderSchema = Yup.object().shape({
    folderName: Yup.string().required('Required')
 });

interface BoxWithIconProps{
    label: string;
    id: string;
    toggleAddFolder: CallableFunction;
}

interface DotPopoverProps{
    treeId: string;
    toggleAddFolder: CallableFunction;
}

interface AddNewFolderProps{
    toggleAddFolder: CallableFunction;
    parentFolder: FolderMetaData;
}

interface FolderMetaData{
    id: string;
    name: string;
    childNodes: Array<FolderMetaData>;
}
interface TreeListingProps{
    folderData: Array<FolderMetaData>;
    parentFolder: FolderMetaData;
    folderHook: CallableFunction;
    newflag: boolean;
    andChangeFlag: CallableFunction;
}

export const FolderTree = () => {

    const { data, refetch } = useQuery(GET_FOLDERS);
    const [ listRefresh, setListRefresh ] = useState(false);
    const [firstFolderFlag, setFirstFolderFlag] = useState(false);
    
    useEffect(()=>{
      refetch();
   }, [listRefresh, refetch]);
   
    const BoxWithIcon = ({label, id, toggleAddFolder}:BoxWithIconProps) => {
        return (
            <Box component="div" sx={{display: 'flex', p: 1, color: colors.grey[700]}}>
                <Box component={Folder}></Box>
                <Box component="div" sx={{display: "flex", justifyContent: "space-between", flex:1}}>
                    <Typography component="span" sx={{ml: 1/2, mr: 1/2}}>{label}</Typography>
                    <DotPopoverMenu treeId={id} toggleAddFolder={toggleAddFolder}></DotPopoverMenu>
                </Box>
            </Box>
        );
    }

    const DotPopoverMenu = ({treeId, toggleAddFolder}:DotPopoverProps) => {
        //const [open, setOpen] = useState(false);
        const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>)=>{
            event.stopPropagation();
            setAnchorEl(event.currentTarget)
        }
        const handleClose = (event: React.MouseEvent<HTMLLIElement>)=>{
            event.stopPropagation();
            setAnchorEl(null)
        }

        const handleAddFolder = (event: React.MouseEvent<HTMLLIElement>) => {
            toggleAddFolder();
            handleClose(event)
        }

        const open = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;

        return (
            <>
                <IconButton aria-describedby={id} onClick={handleClick} sx={{p: 0}}>
                    <MoreVert />
                </IconButton>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleAddFolder}>
                        <ListItemIcon>
                            <CreateNewFolder fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Add Folder</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <CloudUpload fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Upload File</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    }

    const TreeListing = ({folderData,folderHook, newflag, andChangeFlag, parentFolder}: TreeListingProps)=>{
       
        const [localFolderFlag, setLocalFolderFlag] = useState(false);

        const EmpatyFolderView = () => (
            <>
                {!parentFolder.id ? <Box component="div" sx={{flex:1}}>
                    <Typography component="span" sx={{ml: 1/2, mr: 1/2}}>No folder created.</Typography>
                </Box> : ""}
            </>
        );
        
        return (
            <>
                {folderData.length ? folderData.map((item)=>
                    <TreeItemListComponent key={item.id} item={item} folderHook={folderHook} />
                ) : <EmpatyFolderView></EmpatyFolderView>}
                
                {(newflag || localFolderFlag) ? <AddNewFolder toggleAddFolder={andChangeFlag} parentFolder={parentFolder} /> : ""}
            </>
        );
    }

    const TreeItemListComponent = ({item, folderHook}:{item:FolderMetaData, folderHook:CallableFunction}) => {
        const {flag, changeFlag} = folderHook(false);
        const anotherChangeFlag = useCallback(()=>{
            changeFlag((val:boolean)=>!val)
        }, [flag]);

        return (
            <TreeItem key={item.id} nodeId={item.id.toString()} label={<BoxWithIcon toggleAddFolder={anotherChangeFlag} id={item.id} label={item.name} />}>
                {(item.childNodes.length || flag) ? <TreeListing folderData={item.childNodes} folderHook={useToggleAddFolder} newflag={flag} andChangeFlag={anotherChangeFlag} parentFolder={item} ></TreeListing> : ""}
            </TreeItem>
        )
    }

    
    const AddNewFolder = ({toggleAddFolder, parentFolder}:AddNewFolderProps) => {
        const [createNewFolder, { data, error, loading }] = useMutation(CREATE_NEW_FOLDER);

        const parentFolderId = parentFolder.id || "-1";
        const addFolderSubmit = async (values: {folderName:string},{ setSubmitting, resetForm }:any) => {
            const folderRespond = await createNewFolder({
                variables: {
                    folderName: values.folderName,
                    orginatorId: "1",
                    projectId: "1",
                    orgId: "1",
                    folderId: "",
                    parentFolderId
                }
            });

            const folderId:string|null = folderRespond.data?.createNewFolder?.folderId;
            if(folderId){
                resetForm();
                setListRefresh((val)=>!val);
            }

        }
    
        const addFolderformik = useFormik({
            initialValues: { folderName: "" },
            validationSchema: AddFolderSchema,
            onSubmit: addFolderSubmit,
        });

        const closeAddFolder = () => {
            toggleAddFolder && toggleAddFolder();
        }
        return (
            <TreeItem nodeId={`${Math.random()}`} label={
                <Box
                    id='add-project-form'
                    component="form"
                    noValidate
                    onSubmit={addFolderformik.handleSubmit}
                    sx={{ m: 0, ml: -2 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                required
                                variant='standard'
                                fullWidth
                                id="folderName"
                                label="Enter folder name"
                                name="folderName"
                                autoComplete="folderName"
                                value={addFolderformik.values.folderName}
                                onChange={addFolderformik.handleChange}
                                onBlur={addFolderformik.handleBlur}
                                error={addFolderformik.touched.folderName && Boolean(addFolderformik.errors.folderName)}
                                helperText={addFolderformik.touched.folderName && addFolderformik.errors.folderName}
                            />
                        </Grid>
                        <Grid sx={{verticalAlign: "center", display: "flex"}} item xs={2}>
                            <IconButton aria-describedby="add-folder-submit" type='submit' sx={{p: 0}} disabled={loading}>                                
                                {loading ? <CircularProgress size={20} /> : <Check />}
                            </IconButton>
                            <IconButton aria-describedby="add-folder-cancel" type='button' onClick={closeAddFolder} sx={{p: 0}} disabled={loading}>
                                <Close />
                            </IconButton>
                        </Grid>
                        {/* <Grid sx={{verticalAlign: "center", display: "flex"}} xs={2}>
                            <CircularProgress size={20} />
                        </Grid> */}
                    </Grid>
                </Box>
            }></TreeItem>
        );
    }

    const handleTreeViewEvent = (event:React.MouseEvent<HTMLUListElement>)=>{
        
    }

    const useToggleAddFolder = () => {
        const [flag, setFlag] = useState(false);

        return {
            flag,
            changeFlag: setFlag
        }
    }

    const parentStpl = () => {
        setFirstFolderFlag(false);
    };
    const formatData = (rowData: any) => {
        const newData:Array<FolderMetaData> = []
        const folderMap:any = {};
        if(rowData && rowData?.getFolders){
            for (let index = 0; index < rowData?.getFolders.length; index++) {
                const element = rowData?.getFolders[index];
                
                const newElem: FolderMetaData = {
                    id: element.folderId,
                    name: element.folderName,
                    childNodes : []
                }
                const parentFolder = folderMap[element.parentFolderId];
                
                folderMap[element.folderId] = {...newElem};
                if(element.parentFolderId == -1){
                    newData.push({...newElem});
                }else if(parentFolder && parentFolder.id == element.parentFolderId){
                    parentFolder.childNodes.push({...newElem});
                }                
            }            
        }

        return newData;
    };

    const openAddFolder = () => {
        setFirstFolderFlag(true);
    }

   return (
      <>
        <Box component="h3" sx={{marginTop: 3, mb:0, display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
            <Typography sx={{fontWeight: "bold"}}>FOLDERS</Typography>
            <IconButton sx={{mt: -1, mr: 1}} onClick={openAddFolder}>
                <AddIcon />
            </IconButton>
        </Box>
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onClick={handleTreeViewEvent}
        >
            <TreeListing parentFolder={{} as FolderMetaData} folderData={formatData(data)} folderHook={useToggleAddFolder} newflag={firstFolderFlag} andChangeFlag={parentStpl}></TreeListing>
        </TreeView>
      </>
   );
};
