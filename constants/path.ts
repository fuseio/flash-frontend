import { Href, Route } from "expo-router";

type Path = {
  REGISTER: Href;
  WELCOME: Href;
  HOME: Href;
  SAVINGS: Href;
  DEPOSIT: Href;
  CARD: Href;
  CARD_ACTIVATE: Route;
  CARD_KYC: Route;
  CARD_TERMS_OF_SERVICE: Route;
  CARD_DETAILS: Route;
  CARD_DETAILS_MOBILE: Route;
  CARD_ACTIVATE_MOBILE: Href;
  CARD_USER_INFO_MOBILE: Route;
  CARD_KYC_MOBILE: Href;
  EARN: Href;
  BUY_CRYPTO: Href;
  SETTINGS: Href;
}

export const path: Path = {
  REGISTER: "/register",
  WELCOME: "/welcome",
  HOME: "/",
  SAVINGS: "/savings",
  DEPOSIT: "/deposit",
  CARD: "/card",
  CARD_ACTIVATE: "/card/activate",
  CARD_KYC: "/card/kyc",
  CARD_TERMS_OF_SERVICE: "/card/bridge_terms_of_service",
  CARD_DETAILS: "/card/details",
  CARD_DETAILS_MOBILE: "/card/details_mobile",
  CARD_ACTIVATE_MOBILE: "/card/activate_mobile",
  CARD_USER_INFO_MOBILE: "/card/user_info_mobile",
  CARD_KYC_MOBILE: "/card/kyc_mobile",
  EARN: "/earn",
  BUY_CRYPTO: "/buy-crypto",
  SETTINGS: "/settings",
}
