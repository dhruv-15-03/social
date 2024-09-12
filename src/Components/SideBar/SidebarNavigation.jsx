import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
export const navigationMenu=[
    {
        title:"Home",
        icon:<HomeIcon/>,
        path:"/"
    },
    {
        title:"Reels",
        icon:<ExploreIcon/>,
        path:"/reels"
    },
    {
        title:"CreateReels",
        icon:<ControlPointIcon/>,
        path:"/create-reels"
    },
    {
        title:"Notifications",
        icon:<NotificationsIcon/>,
        path:"/notifications"
    },
    {
        title:"Messages",
        icon:<MessageIcon/>,
        path:"/messages"
    },
    {
        title:"Lists",
        icon:<ListAltIcon/>,
        path:"/list"
    },
    {
        title:"Communities",
        icon:<GroupsIcon/>,
        path:"/comm"
    },
    {
        title:"Profile",
        icon:<AccountCircleIcon/>,
        path:"/profile"
    }
]