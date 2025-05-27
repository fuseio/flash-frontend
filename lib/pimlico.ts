import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { http } from "viem";
import {
  entryPoint07Address
} from "viem/account-abstraction";
import { USER } from './config';

export const pimlicoClient = createPimlicoClient({
  transport: http(USER.pimlicoUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: '0.7',
  },
})