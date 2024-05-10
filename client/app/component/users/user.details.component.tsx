import { Avatar, Box } from "@mui/material";
import { UserTypes } from "./add-user";
import { getUserInitials } from "../../services/user.service";
import { useEffect, useState } from "react";



export interface UserDetailsProps {
   userDetails: UserTypes;
}


export const UserDetails = (props: UserDetailsProps) => {
   
   const [userInitials, setUserInitials] = useState("");

   useEffect(() => {
      if (props.userDetails) {
         const tmpUserInitials = getUserInitials(props.userDetails);
         setUserInitials(tmpUserInitials);
      }
   }, [props.userDetails]);

   return (
      <Box sx={{display:"flex", verticalAlign:"center"}}>
         <Avatar sx={{mr: 1}}>{userInitials}</Avatar>
         <Box component="span">{`${props.userDetails.firstName} ${props.userDetails.lastName}`}</Box>
      </Box>
   );
};