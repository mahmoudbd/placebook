import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import "./index.css";

import HomePageText from "./shared/components/UIElements/Home-page";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UserPlace from "./places/pages/UserPlace";
import BucketListPage from "./bucketlist/pages/BucketListPage";
import Friends from "./user/components/Friends";
import { NotifContext } from "./shared/context/notif-context";

import UpdatePlace from "./places/pages/UpdatePlace";
import PlaceDetail from "./places/pages/PlaceDetail";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import SearchResults from "./shared/pages/SearchResults";

import { AuthContext } from "./shared/context/auth-context";
import { SearchContext } from "./shared/context/search-context";

import { useAuth } from "./shared/hooks/auth-hook";
import { useForm } from "./shared/hooks/form-hook";
import UserProfile from "./user/components/UserProfile/UserProfile";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  const [notifFollower, setNotifFollower] = useState(0);

  const [formState, inputHandler] = useForm(
    { search: { value: "", isValid: false } },
    false
  );
  const [currentPage, setCurrentPage] = useState(1);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/:userId/bucketList" exact>
          <BucketListPage />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Route path="/places/:userId/:placeId" exact>
          <PlaceDetail />
        </Route>
        <Route path="/:userId/profile" exact>
          <UserProfile />
        </Route>
        <Route path="/search" exact>
          <SearchResults />
        </Route>
        <Route path="/:placeId" exact>
          <UserPlace />
        </Route>
        <Route path="/:userId/friendsList">
          <Friends />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePageText />
          <Auth />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/:userId/bucketList" exact>
          <BucketListPage />
        </Route>
        <Route path="/auth">
          <HomePageText />
          <Auth />
        </Route>
        <Route path="/search">
          <SearchResults />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <SearchContext.Provider
        value={{
          searchState: formState,
          inputHandler: inputHandler,
          currentPage: currentPage,
          setCurrentPage: setCurrentPage,
        }}
      >
        <NotifContext.Provider
          value={{
            notifFollower: notifFollower,
            setNotifFollower: setNotifFollower,
          }}
        >
          <Router>
            <MainNavigation />
            <main>{routes}</main>
            {!token && (<Redirect to="/" />) }
          </Router>
        </NotifContext.Provider>
      </SearchContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
