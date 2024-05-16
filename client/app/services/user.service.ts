import { UserTypes } from "../component/users/add-user";

export const getUserInitials = (userObj: UserTypes) => {
    if(userObj && userObj.firstName && userObj.lastName){
        return `${userObj.firstName[0].toUpperCase()}${userObj.lastName[0].toUpperCase()}`
    }
    return ""
}