import React, { useEffect, useState } from "react";
import { UserTypes } from "../users/add-user";
import { UserDetails } from "../users/user.details.component";
import { Box } from "@mui/material";



export interface RoleUsersListProps {
  roleUsers: Array<string>;
  allUsers: UserTypes[];
}


export function RoleUsersList(props: RoleUsersListProps) {
  

  const [userListWithName, setUserListWithName] = useState<Array<UserTypes>>([]);
  
  useEffect(() => {
    console.log("props.roleUsers", props.roleUsers);
    console.log("props.allUsers", props.allUsers);
    const filteredUserList = [];
    const filteredUser=props.roleUsers
    for (let index = 0; index < props.allUsers.length; index++) {
      const element:UserTypes = props.allUsers[index];
      if(filteredUser.includes(element.userId)){
        filteredUserList.push(element);
      }
    }

    console.log("filteredUserList", filteredUserList)
    setUserListWithName(filteredUserList);
  }, [props.roleUsers, props.allUsers]);

  return (
    <>
      <Box sx={{display:"flex", flexWrap: "wrap"}}>
        {userListWithName.map((userData, index) => (
          <Box sx={{display:"flex", mr: 1, mb: 1}} key={index}>
            <UserDetails userDetails={userData}></UserDetails>
          </Box>
        ))}
      </Box>
    </>
                
  );
}