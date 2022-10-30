import { gql } from "@apollo/client";

export const DELETE_TASK = gql`
  mutation deleteTask($input:DeleteTask!){
    deleteTask(input:$input)
  }
`;

export const UPDATE_TASK = gql`
  mutation deleteTask($input:UpdateTask!){
    updateTask(input:$input)
  }
`;

export const CREATE_TASK = gql`
  mutation createTask($input:NewTask!){
    createTask(input:$input)
  }
`;
