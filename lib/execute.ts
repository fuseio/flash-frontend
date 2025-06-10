import { getAccountNonce } from "permissionless/actions";
import { Chain } from "viem";
import { PasskeyArgType } from "@/lib/types";
import { publicClient } from "@/lib/wagmi";
import {
  encodeValidatorNonce,
  getAccount,
  getWebauthnValidatorMockSignature,
  getWebauthnValidatorSignature,
  WEBAUTHN_VALIDATOR_ADDRESS,
} from "@rhinestone/module-sdk";
import { sign } from "ox/WebAuthnP256";
import {
  entryPoint07Address,
  getUserOperationHash,
} from "viem/account-abstraction";

export const executeTransactions = async (
  smartAccountClient: any,
  passkey: PasskeyArgType,
  transactions: any[],
  errorMessage: string,
  chain: Chain
) => {
  const nonce = await getAccountNonce(publicClient(chain.id), {
    address: smartAccountClient.account.address,
    entryPointAddress: entryPoint07Address,
    key: encodeValidatorNonce({
      account: getAccount({
        address: smartAccountClient.account.address,
        type: "safe",
      }),
      validator: WEBAUTHN_VALIDATOR_ADDRESS,
    }),
  });

  const userOperation = await smartAccountClient.prepareUserOperation({
    account: smartAccountClient.account,
    calls: transactions,
    nonce,
    signature: getWebauthnValidatorMockSignature(),
  });

  // const requiredPrefund = getRequiredPrefund({
  //   userOperation,
  //   entryPointVersion: "0.7",
  // })

  // const senderBalance = await publicClient(mainnet.id).getBalance({
  //   address: userOperation.sender
  // })

  // if (senderBalance < requiredPrefund) {
  //   throw new Error(`Sender address does not have enough native tokens`)
  // }

  const userOpHashToSign = getUserOperationHash({
    chainId: chain.id,
    entryPointAddress: entryPoint07Address,
    entryPointVersion: "0.7",
    userOperation,
  });

  const { metadata: webauthn, signature } = await sign({
    credentialId: passkey.credentialId,
    challenge: userOpHashToSign,
  });

  const encodedSignature = getWebauthnValidatorSignature({
    webauthn,
    signature,
    usePrecompiled: false,
  });

  userOperation.signature = encodedSignature;

  const userOpHash = await smartAccountClient.sendUserOperation(userOperation);

  const receipt = await smartAccountClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  if (!receipt.success) {
    throw new Error("User operation failed");
  }

  const transactionHash = receipt.receipt.transactionHash;

  const transaction = await publicClient(chain.id).waitForTransactionReceipt({
    hash: transactionHash,
  });

  if (transaction.status !== "success") {
    throw new Error(errorMessage);
  }

  return transaction;
};
