import { Href } from "expo-router";

type Path = {
  HOME: Href;
  DASHBOARD: Href;
  DEPOSIT: Href;
}

export const path: Path = {
  HOME: "/",
  DASHBOARD: "/(tabs)/dashboard",
  DEPOSIT: "/(tabs)",
}
