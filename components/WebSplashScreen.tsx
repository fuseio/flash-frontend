import { Image } from "expo-image";

export default function WebSplashScreen() {
  return <Image source={require("@/assets/images/splash-icon.png")} className="w-full h-full" />;
}
