import React from 'react';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { Folder, MoreVert, CloudUpload, CreateNewFolder } from '@mui/icons-material';


interface BoxWithIconProps{
    label: string;
}

interface DotPopoverProps{
    ids: string;
}

interface FolderMetaData{
    id: number;
    name: string;
    childNodes: Array<FolderMetaData>;
}
interface TreeListingProps{
    folderData: Array<FolderMetaData>;
}

export const FolderTree = () => {
   
    const BoxWithIcon = ({label}:BoxWithIconProps) => {
        return (
            <Box component="div" sx={{display: 'flex', p: 1}}>
                <Box component={Folder} ></Box>
                <Box component="div" sx={{display: "flex", justifyContent: "space-between", flex:1}}>
                    <Typography component="span" sx={{ml: 1/2, mr: 1/2}}>{label}</Typography>
                    <DotPopoverMenu ids="ss"></DotPopoverMenu>
                </Box>
            </Box>
        );
    }

    const DotPopoverMenu = ({ids}:DotPopoverProps) => {
        //const [open, setOpen] = useState(false);
        const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>)=>{
            console.log(event);
            setAnchorEl(event.currentTarget)
        }
        const handleClose = ()=>{
            setAnchorEl(null)
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
                    <MenuItem onClick={handleClose}>
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

    const TreeListing = ({folderData}: TreeListingProps)=>{
        return (
            <>
            {folderData.map((item)=>
                <TreeItem key={item.id} nodeId={item.id.toString()} label={<BoxWithIcon label={item.name} />}>
                    {item.childNodes.length ? <TreeListing folderData={item.childNodes}></TreeListing> : ""}
                </TreeItem>
            )}
            </>
        );
    }

    const handleTreeViewEvent = (event:React.MouseEvent<HTMLButtonElement>)=>{
        console.log("Tree event", event)
    }
   return (
      <>
        <Box component="h3" sx={{marginTop: 2}}>FOLDERS</Box>
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onClick={handleTreeViewEvent}
        >
            <TreeListing folderData={tempData}></TreeListing>
        </TreeView>
      </>
   );
};
