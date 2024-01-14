import WorkspacesIcon from '@mui/icons-material/Workspaces';
import DescriptionIcon from '@mui/icons-material/Description';
import TaskIcon from '@mui/icons-material/Task';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import HandshakeIcon from '@mui/icons-material/Handshake';
import GradingIcon from '@mui/icons-material/Grading';
import CloudIcon from '@mui/icons-material/Cloud';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const PROJECT_MODULES = {
    name: "Projects",
    route: "/projects",
    icon: <WorkspacesIcon />
};

export const DASHBOARD_MODULES = {
    name: "Dashboard",
    route: "/dashboard",
    icon: <DashboardIcon />
};

export const FILES_MODULES = {
    name: "Files",
    route: "/files",
    icon: <DescriptionIcon />
};

export const TASKS_MODULES = {
    name: "Tasks",
    route: "/tasks",
    icon: <TaskIcon />
};

export const ADMIN_MODULES = {
    name: "Admin",
    route: "/admin",
    icon: <AdminPanelSettingsIcon />
};

export const REPORTS_MODULES = {
    name: "Reports",
    route: "/reports",
    icon: <AssessmentIcon />
};

export const SITES_MODULES = {
    name: "Sites",
    route: "/sites",
    icon: <ApartmentIcon />
};

export const QUALITY_MODULES = {
    name: "Quality",
    route: "/quality",
    icon: <AssuredWorkloadIcon />
};

export const CONTRACTS_MODULES = {
    name: "Contracts",
    route: "/contracts",
    icon: <HandshakeIcon />
};

export const DELIVERABLES_MODULES = {
    name: "Deliverables",
    route: "/deliverables",
    icon: <GradingIcon />
};

export const MODULES = [
    {
        name: "CDE",
        route: "/dashboard",
        icon: <CloudIcon />,
        subModules: [
            PROJECT_MODULES,
            DASHBOARD_MODULES,
            FILES_MODULES,
            TASKS_MODULES,
            ADMIN_MODULES,
            REPORTS_MODULES
        ]
    },
    {
        name: "Field",
        route: "/sites",
        icon: <ApartmentIcon />,
        subModules: [
            PROJECT_MODULES,
            SITES_MODULES,
            QUALITY_MODULES,
            TASKS_MODULES,
            ADMIN_MODULES,
            REPORTS_MODULES
        ]
    },
    {
        name: "Contracts",
        route: "/contracts",
        icon: <HandshakeIcon />,
        subModules: [
            PROJECT_MODULES,
            CONTRACTS_MODULES,
            ADMIN_MODULES,
            REPORTS_MODULES
        ]
    },
    {
        name: "Deliverables",
        route: "/deliverables",
        icon: <GradingIcon />,
        subModules: [
            PROJECT_MODULES,
            DELIVERABLES_MODULES,
            TASKS_MODULES,
            ADMIN_MODULES,
            REPORTS_MODULES
        ]
    },
];