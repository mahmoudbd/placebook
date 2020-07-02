import { createContext } from "react";

export const NotifContext = createContext({
  notifFollower: null,
  setNotifFollower: () => {},
});
