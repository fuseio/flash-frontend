import { Href } from "expo-router";

type Path = {
  REGISTER: Href;
  WELCOME: Href;
  HOME: Href;
  DASHBOARD: Href;
  DEPOSIT: Href;
  CARD: Href;
  EARN: Href;
}

export const path: Path = {
  REGISTER: "/register",
  WELCOME: "/welcome",
  HOME: "/",
  DASHBOARD: "/dashboard",
  DEPOSIT: "/deposit",
  CARD: "/card",
  EARN: "/earn",
}
