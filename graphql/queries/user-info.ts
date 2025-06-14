import { gql } from "graphql-request";

export const GET_USER_TRANSACTIONS_QUERY = gql`
  query GetUserTransactions($address: Bytes!) {
    deposits(where: { receiver: $address }) {
      depositor
      receiver
      depositAmount
      depositTimestamp
      isBridged
      shareAmount
      transactionHash
    }
  }
`;
