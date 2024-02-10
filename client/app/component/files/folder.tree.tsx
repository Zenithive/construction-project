import React, { memo, useCallback, useEffect, useState } from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography, colors } from '@mui/material';
import { Folder, MoreVert, CloudUpload, CreateNewFolder, Check, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddFolderSchema = Yup.object().shape({
    folderName: Yup.string().required('Required')
 });

interface BoxWithIconProps{
    label: string;
    id: number;
    toggleAddFolder: CallableFunction;
}

interface DotPopoverProps{
    treeId: number;
    toggleAddFolder: CallableFunction;
}

interface AddNewFolderProps{
    toggleAddFolder: CallableFunction;
}

interface FolderMetaData{
    id: number;
    name: string;
    childNodes: Array<FolderMetaData>;
}
interface TreeListingProps{
    folderData: Array<FolderMetaData>;
    folderHook: CallableFunction;
    newflag: boolean;
    andChangeFlag: CallableFunction;
}

export const FolderTree = () => {
   
    const BoxWithIcon = ({label, id, toggleAddFolder}:BoxWithIconProps) => {
        return (
            <Box component="div" sx={{display: 'flex', p: 1, color: colors.grey[700]}}>
                <Box component={Folder} ></Box>
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

    const tempData:Array<FolderMetaData> = [
        {
            name: "Test",
            id: 1,
            childNodes: [
                {
                    id: 2,
                    name: "Child 1",
                    childNodes: []
                },
                {
                    id: 3,
                    name: "Child 2",
                    childNodes: []
                }
            ]
        },
        {
            name: "Calendar",
            id: 4,
            childNodes: []
        },
        {
            name: "Documents",
            id: 5,
            childNodes: [
                {
                    id: 6,
                    name: "Sites",
                    childNodes: [
                        {
                            id: 8,
                            name: "Site A",
                            childNodes: []
                        },
                        {
                            id: 9,
                            name: "Site B",
                            childNodes: []
                        },
                        {
                            id: 10,
                            name: "Site C",
                            childNodes: []
                        }
                    ]
                },
                {
                    id: 7,
                    name: "Child 2",
                    childNodes: []
                }
            ]
        }
    ]

    const TreeListing = ({folderData,folderHook, newflag, andChangeFlag}: TreeListingProps)=>{

        return (
            <>
                {folderData.map((item)=>
                    <TreeItemListComponent key={item.id} item={item} folderHook={folderHook} />
                )}
                {newflag ? <AddNewFolder toggleAddFolder={andChangeFlag}/> : ""}
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
                {(item.childNodes.length || flag) ? <TreeListing folderData={item.childNodes} folderHook={useToggleAddFolder} newflag={flag} andChangeFlag={anotherChangeFlag}></TreeListing> : ""}
            </TreeItem>
        )
    }

    
    const AddNewFolder = ({toggleAddFolder}:AddNewFolderProps) => {
        const addFolderSubmit = () => {
            
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
                            <IconButton aria-describedby="add-folder-submit" type='submit' sx={{p: 0}}>
                                <Check />
                            </IconButton>
                            <IconButton aria-describedby="add-folder-cancel" type='button' onClick={closeAddFolder} sx={{p: 0}}>
                                <Close />
                            </IconButton>
                        </Grid>
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

    const parentStpl = () => {};

   return (
      <>
        <Box component="h3" sx={{marginTop: 2}}>FOLDERS</Box>
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onClick={handleTreeViewEvent}
        >
            <TreeListing folderData={tempData} folderHook={useToggleAddFolder} newflag={false} andChangeFlag={parentStpl}></TreeListing>
        </TreeView>
      </>
   );
};
