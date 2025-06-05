import { useEffect, useState } from "react"
import { Href } from "expo-router"

import useUser from "@/hooks/useUser"
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
  },
  {
    label: "Card",
    href: path.CARD,
  },
  {
    label: "Buy Crypto",
    href: path.BUY_CRYPTO,
  }
]

const useNav = () => {
  const { user } = useUser();
  const isDashboard = user?.isDeposited

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    let newMenuItems: MenuItem[] = []

    if (isDashboard) {
      newMenuItems = [dashboard]
    } else {
      newMenuItems = [home]
    }

    setMenuItems([...newMenuItems, ...defaultMenuItems])
  }, [isDashboard])

  return {
    menuItems,
    isDashboard,
  }
}

export default useNav;
