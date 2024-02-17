import { gql } from "@apollo/client";

export const GET_APS_MODELS= gql`
  query GetApsForgeModels {
    getApsForgeModels {
      name
      test
    }
  }
`;
