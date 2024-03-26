import { UserSchema } from "../reducers/userReducer";

export const getUserInitials = (userObj: UserSchema) => {
    if(userObj && userObj.firstName && userObj.lastName){
        return `${userObj.firstName[0].toUpperCase()}${userObj.lastName[0].toUpperCase()}`
    }
    return ""
}