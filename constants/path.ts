import { Href, Route } from "expo-router";

type Path = {
  REGISTER: Href;
  WELCOME: Href;
  HOME: Href;
  DASHBOARD: Href;
  WALLET: Href;
  DEPOSIT: Href;
  CARD: Href;
  CARD_ACTIVATE: Route;
  CARD_KYC: Route;
  CARD_TERMS_OF_SERVICE: Route;
  CARD_DETAILS: Route;
  EARN: Href;
  BUY_CRYPTO: Href;
  SETTINGS: Href;
}

export const path: Path = {
  REGISTER: "/register",
  WELCOME: "/welcome",
  HOME: "/",
  DASHBOARD: "/dashboard",
  WALLET: "/wallet",
  DEPOSIT: "/deposit",
  CARD: "/card",
  CARD_ACTIVATE: "/card/activate",
  CARD_KYC: "/card/kyc",
  CARD_TERMS_OF_SERVICE: "/card/bridge_terms_of_service",
  CARD_DETAILS: "/card/details",
  EARN: "/earn",
  BUY_CRYPTO: "/buy-crypto",
  SETTINGS: "/settings",
}
