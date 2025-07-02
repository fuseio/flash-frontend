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
    withdraws(where: { user: $address }) {
      user
      amountOfAssets
      amountOfShares
      creationTime
      requestTimestamp
      requestStatus
      requestTxHash
      solveTxHash
    }
    bridges(where: { user: $address }) {
      user
      transactionHash
      shareAmount
      blockTimestamp
    }
  }
`;
