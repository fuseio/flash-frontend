import { Href } from "expo-router";

type Path = {
  REGISTER: Href;
  DASHBOARD: Href;
  DEPOSIT: Href;
  CARD: Href;
  EARN: Href;
}

export const path: Path = {
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DEPOSIT: "/",
  CARD: "/card",
  EARN: "/earn",
}
