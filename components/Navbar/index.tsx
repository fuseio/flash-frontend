import { Image } from "expo-image"
import { Link } from "expo-router"
import { View } from "react-native"

import AccountCenterModal from "../AccountCenter/AccountCenterModal";
import { path } from "@/constants/path";
import { NavMenu } from "./NavMenu";

const Navbar = () => {
  return (
    <View className="bg-background flex-row justify-end md:justify-between items-center p-4 md:p-6">
      <Link href={path.HOME} className="hidden md:flex flex-row items-center gap-2">
        <Image
          source={require("@/assets/images/solid-logo.png")}
          alt="Solid logo"
          contentFit="contain"
          style={{ width: 32, height: 32 }}
        />
        <Image
          source={require("@/assets/images/solid.png")}
          alt="Solid"
          contentFit="contain"
          style={{ width: 72, height: 37 }}
          className="hidden md:block"
        />
      </Link>
      <NavMenu />
      <View className="w-32">
        <AccountCenterModal />
      </View>
    </View>
  )
}

export default Navbar;
