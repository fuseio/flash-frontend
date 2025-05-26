import { Href } from "expo-router";

type Path = {
  REGISTER: Href;
  WELCOME: Href;
  HOME: Href;
  DASHBOARD: Href;
  DEPOSIT: Href;
  CARD: Href;
  CARD_ACTIVATE: Href;
  CARD_KYC: Href;
  CARD_TERMS_OF_SERVICE: Href;
  EARN: Href;
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
  EARN: "/earn",
}
