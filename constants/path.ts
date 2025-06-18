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
  EARN: Href;
  BUY_CRYPTO: Href;
  SETTINGS: Href;
  SEND: Href;
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
  EARN: "/earn",
  BUY_CRYPTO: "/buy-crypto",
  SETTINGS: "/settings",
  SEND: "/send",
}
