import { Href } from "expo-router";

type Path = {
  REGISTER: Href;
  DASHBOARD: Href;
  DEPOSIT: Href;
}

export const path: Path = {
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DEPOSIT: "/",
}
