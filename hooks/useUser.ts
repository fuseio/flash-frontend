import { useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"

import { USER } from "@/lib/config"
import { Status, User } from "@/lib/types"
import { path } from "@/constants/path"

const initUser = {
  username: "",
  safeAddress: "",
  passkey: {
    rawId: "",
    coordinates: {
      x: "",
      y: ""
    }
  }
}

const useUser = () => {
  const [signupInfo, setSignupInfo] = useState<{ status: Status; message?: string }>({ status: Status.IDLE, message: "" })
  const [loginStatus, setLoginStatus] = useState<Status>(Status.IDLE)
  const [userStatus, setUserStatus] = useState<Status>(Status.IDLE)
  const [user, setUser] = useState<User>()
  const router = useRouter()

  function storeUser(user: { [K in keyof User]?: User[K] }) {
    setUser((prevUser) => {
      const newUser = {
        ...prevUser,
        ...user
      } as User
      localStorage.setItem(USER.storageKey, JSON.stringify(newUser))
      document.cookie = `${USER.storageKey}=${newUser.username}; path=/;`
      return newUser
    })
  }

  const loadUser = useCallback(() => {
    try {
      setUserStatus(Status.PENDING)
      const user = localStorage.getItem(USER.storageKey)
      if (!user) {
        throw new Error("User not found")
      }

      const parsedUser = JSON.parse(user)
      setUser(parsedUser)
      setUserStatus(Status.SUCCESS)

      return parsedUser
    } catch (error) {
      console.log(error)
      setUserStatus(Status.ERROR)
    }
  }, [])

  async function handleSignup(username: string) {}

  async function handleLogin() {}

  function handleLogout() {
    const date = new Date(0)
    document.cookie = `${USER.storageKey}=; path=/; expires=${date.toUTCString()}`
    storeUser(initUser)
    router.push(path.HOME)
  }

  useEffect(() => {
    loadUser()
  }, [])

  return {
    signupInfo,
    handleSignup,
    user,
    userStatus,
    loginStatus,
    handleLogin,
    handleLogout,
  }
}

export default useUser;
