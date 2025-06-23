import { Href } from "expo-router";
import { useMemo } from "react";

import { path } from "@/constants/path";
import useUser from "@/hooks/useUser";

type MenuItem = {
  label: string;
  href: Href;
}

const home: MenuItem = {
  label: "Home",
  href: path.HOME,
}

const savings: MenuItem = {
  label: "Savings",
  href: path.SAVINGS,
}

const defaultMenuItems: MenuItem[] = [
  // {
  //   label: "Deposit",
  //   href: path.DEPOSIT,
  // },
  // {
  //   label: "Card",
  //   href: path.CARD,
  // },
  // {
  //   label: "Buy Crypto",
  //   href: path.BUY_CRYPTO,
  // }
]

const useNav = () => {
  const { user } = useUser();
  const hasDeposited = user?.isDeposited;

  const menuItems = useMemo<MenuItem[]>(() => {
    const coreMenuItems = [savings]; // [home, savings];
    return [...coreMenuItems, ...defaultMenuItems];
  }, [hasDeposited]);

  return {
    menuItems,
    hasDeposited,
  };
}

export default useNav;
