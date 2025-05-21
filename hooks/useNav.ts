import { useEffect, useState } from "react"
import { mainnet } from "viem/chains"
import { Href } from "expo-router"

import useUser from "@/hooks/useUser"
import { useTokenSelector } from "@/hooks/useToken"
import { TOKEN_MAP } from "@/constants/tokens"
import { Status } from "@/lib/types"
import { path } from "@/constants/path";

type MenuItem = {
  label: string;
  href: Href;
}

const home: MenuItem = {
  label: "Home",
  href: path.HOME,
}

const dashboard: MenuItem = {
  label: "Dashboard",
  href: path.DASHBOARD,
}

const defaultMenuItems: MenuItem[] = [
  {
    label: "Deposit",
    href: path.DEPOSIT,
  }
]

const useNav = () => {
  const { user } = useUser();
  const { tokenStatus, totalBalance } = useTokenSelector({ tokens: TOKEN_MAP[mainnet.id], safeAddress: user?.safeAddress })
  const isTokenReady = tokenStatus === Status.SUCCESS || tokenStatus === Status.ERROR;
  const isDashboard = isTokenReady && totalBalance;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    if(!isTokenReady) return;

    let newMenuItems: MenuItem[] = []

    if (isDashboard) {
      newMenuItems = [dashboard]
    } else {
      newMenuItems = [home]
    }

    setMenuItems([...newMenuItems, ...defaultMenuItems])
  }, [isTokenReady, totalBalance])


  return {
    menuItems,
    isDashboard,
  }
}

export default useNav;
