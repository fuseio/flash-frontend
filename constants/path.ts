import { Href, Route } from "expo-router";

type Path = {
  REGISTER: Href;
  WELCOME: Href;
  HOME: Href;
  DASHBOARD: Href;
  DEPOSIT: Href;
  CARD: Href;
  CARD_ACTIVATE: Route;
  CARD_KYC: Route;
  CARD_TERMS_OF_SERVICE: Route;
  CARD_DETAILS: Route;
  CARD_ACTIVATE_MOBILE: Route;
  EARN: Href;
  BUY_CRYPTO: Href;
}

export const path: Path = {
  REGISTER: "/register",
  WELCOME: "/welcome",
  HOME: "/",
  DASHBOARD: "/dashboard",
  DEPOSIT: "/deposit",
  CARD: "/card",
  CARD_ACTIVATE: "/card/activate",
  CARD_KYC: "/card/kyc",
  CARD_TERMS_OF_SERVICE: "/card/bridge_terms_of_service",
  CARD_DETAILS: "/card/details",
  CARD_ACTIVATE_MOBILE: "/card/activate_mobile",
  EARN: "/earn",
  BUY_CRYPTO: "/buy-crypto",
}
