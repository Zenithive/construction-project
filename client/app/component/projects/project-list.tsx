import { Col, Row, Tooltip } from '@nextui-org/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GET_PROJECTS } from '../../api/project/queries';
import { useQuery } from '@apollo/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GridOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Box, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import RolesComponent from '../Roles/role.component';
import PermissionComponent from '../Permission/permission.component';
import { SelectChangeEvent } from '@mui/material/Select';
import { PaginationComponent } from '../Pagination/pagination.component';
import { useAppSelector } from '../../reducers/hook.redux';
import { UserSchema, selectUserSession } from '../../reducers/userReducer';

// Sachin Import
import { DELETE_PROJECT } from '../../api/project/mutations';

import { useMutation } from '@apollo/client';
import StatusComponent from '../status/status.component';



export interface ProjectListWrapperProps {
    listRefresh: boolean;
}

interface DotPopoverProps {
    treeId: string;
    toggleAddFolder: CallableFunction;
    userId:string;
    orgId:string;
}


export const ProjectListWrapper = ({ listRefresh }: ProjectListWrapperProps) => {
    const gridRef = useRef<AgGridReact>(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showRoles, setShowRoles] = useState(false)
    const [currentProj, setCurrentProj] = useState("");
    const [currentOrg, setCurrentOrg] = useState("");
    const [currentUser,setCurrentUser]=useState("")
    const [showPermissions, setShowPermissions] = useState(false)
    const [showStatus,setShowStatus]=useState(false);

    const userDetails: UserSchema = useAppSelector(selectUserSession);

    const { data, refetch, loading } = useQuery(GET_PROJECTS, {
        variables: { pageSize, currentPage },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (loading) {
           gridRef.current?.api?.showLoadingOverlay();
        }else{
           gridRef.current?.api?.hideOverlay();
        }
     }, [loading]);

    useEffect(() => {
        if (data?.getProjects) {
            setTotalPages(data.getProjects.totalPages);
        }
    }, [data]);


    useEffect(() => {
        refetch({ variables: { pageSize, currentPage } });
    }, [pageSize, currentPage, refetch]);

   
    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
         
    };
   
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const gridOptions: GridOptions = {
        // Other grid options...
        domLayout: 'autoHeight'
    };
    const DotPopoverMenu = ({ treeId, toggleAddFolder,userId,orgId }: DotPopoverProps) => {
        const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            setAnchorEl(event.currentTarget)
        }
        const handleClose = (event: React.MouseEvent<HTMLLIElement>) => {
            event.stopPropagation();
            setAnchorEl(null)
        }

        const openRolesModal = (event: React.MouseEvent<HTMLLIElement>) => {
            setCurrentProj(treeId);
            setShowRoles(true);
            handleClose(event)
            setCurrentOrg(orgId);
            setCurrentUser(userId);

        }

        const openPermissionModal = (event: React.MouseEvent<HTMLLIElement>) => {
            setShowPermissions(true);
            setCurrentProj(treeId);
            handleClose(event)
            setCurrentOrg(orgId);
            setCurrentUser(userId);
        }
        const openStatusesModal = (event: React.MouseEvent<HTMLLIElement>) => {
            handleClose(event);
            setShowStatus(true);
            setCurrentProj(treeId);
            setCurrentOrg(orgId);
            setCurrentUser(userId);
        }

        const open = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;

        return (
            <>

                <IconButton aria-describedby={id} onClick={handleClick} sx={{ p: 0 }}>
                    <MoreVertIcon sx={{ color: "#979797" }} />
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
                    <MenuItem onClick={openRolesModal}>
                        <ListItemText>Roles</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={openPermissionModal}>
                        <ListItemText>Permissions</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={openStatusesModal}>
                        <ListItemText>Statuses</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    }

    const [deleteProject] = useMutation(DELETE_PROJECT);

    const handleDeleteProject = async (projId: string) => {
        try {
            await deleteProject({ variables: { projId } });
            refetch({ variables: { pageSize, currentPage } });
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ActionRenderer = ({ value, data }: any) => (
        <Row
            justify="center"
            align="center"
            css={{ 'gap': '$8', '@md': { gap: 0 } }}
        >
            <Col css={{ d: 'flex' }}>
                <Tooltip content="More Setting">
                    <DotPopoverMenu treeId={data.projId} orgId={data.orgId} userId={userDetails.userId} toggleAddFolder={() => { }}></DotPopoverMenu>
                </Tooltip>
            </Col>
            <Col css={{ d: 'flex' }}>
                <Tooltip content="Edit Project">
                    <IconButton
                        onClick={() => console.log('Edit Project', data)}
                    >
                        <EditIcon size={20} fill="#979797" />
                    </IconButton>
                </Tooltip>
            </Col>
            <Col css={{ d: 'flex' }}>
                <Tooltip
                    content="Delete Project"
                    color="error"
                    onClick={() => handleDeleteProject(data.projId)}
                >
                    <IconButton>
                        <DeleteIcon size={20} fill="#FF0080" />
                    </IconButton>
                </Tooltip>
            </Col>
        </Row>
    );


    const colDefs = [
        {
            field: "projName",
            headerName: "Project Name",
            filter: 'agSetColumnFilter',
        },
        {
            field: "region",
            filter: 'agSetColumnFilter',
            headerName: "Region"
        },
        {
            field: "status",
            filter: 'agSetColumnFilter',
            headerName: "Status"
        },
        {
            field: "orgName",
            filter: 'agSetColumnFilter',
            headerName: "ORGANISATION",
            width: 100
        },
        {
            field: "",
            resizable: false,
            cellRenderer: ActionRenderer
        }
    ];

    useEffect(() => {
        refetch();
    }, [listRefresh, refetch])

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 150,
            filter: true,
        };
    }, []);

    return (
        <Box>
            <RolesComponent
                projId={currentProj}
                clearProjId={() => setCurrentProj("")}
                visible={showRoles}
                closeRoleModel={() => setShowRoles(false)}
                roleId=""
                roleName=""
            />
            <PermissionComponent
                projId={currentProj}
                visible={showPermissions}
                closeRoleModel={() => {
                    setShowPermissions(false);
                    setCurrentProj("");
                }}
            />
            <StatusComponent
                    projId={currentProj}
                    clearProjId={() => setCurrentProj("")}
                    visible={showStatus} 
                    closeStatusModel={() => setShowStatus(false)}
                    statusId=""
                    statusName=""
                    orgId={currentOrg}
                    userId={currentUser}
                />

            <Box component="div" className='ag-theme-quartz' sx={{ height: '450px', mt: 2,  overflowX:"auto", overflowY: 'auto' }}>
                <AgGridReact
                    rowData={data?.getProjects?.projects || []}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    gridOptions={gridOptions}
                    ref={gridRef}
                />

            </Box>

            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                <PaginationComponent
                    totalPage={totalPages}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    handlePageSizeChange={handlePageSizeChange}
                    handlePageChange={handlePageChange}
                />
            </Box>

        </Box>
    );
};
