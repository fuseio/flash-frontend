import { PasskeyArgType } from "@safe-global/protocol-kit"
import { RegistrationResponseJSON } from "@simplewebauthn/browser"

export const extractPasskeyData = async (authenticatorReponse: RegistrationResponseJSON) => {
  return authenticatorReponse.response.authenticatorData as unknown as PasskeyArgType
}
