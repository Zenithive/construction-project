import { gql } from "@apollo/client";


export const GET_SELECTED_PROJECTS=gql`
query GETSelecteProjects($userId:String!){
    getSelectedProjects(input:$userId){
        projId
        projName
        userId
    }
}
`;
