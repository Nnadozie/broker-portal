import { gql } from "@apollo/client";

export const GET_CLIENT_LIST = (page: number, limit: number) => gql`
  {
    users(page: ${page}, limit: ${limit}) {
      data {
        id
      }
      total
      page
      limit
      offset
    }
  }
`;

export const GET_CLIENT = (id: string) => gql`
  {
    user(id: "${id}") {
      firstName
      lastName
      phone
      email
      registerDate
    }
  }
`;

export const GET_BROKER_LIST = (page: number, limit: number) => gql`
  {
    users(page: ${page}, limit: ${limit}) {
      data {
        id
      }
      total
      page
      limit
      offset
    }
  }
`;

export const GET_BROKER = (id: string) => gql`
  {
    user(id: "${id}") {
      firstName
      lastName
      phone
      email
      registerDate
    }
  }
`;
