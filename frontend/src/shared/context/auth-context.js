
import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userName: null, 
  userImage: null, 
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});
