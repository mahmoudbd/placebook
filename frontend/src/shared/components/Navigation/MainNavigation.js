import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import logo from '../images/logo.png'
import { AuthContext } from '../../context/auth-context'

import MainHeader from './MainHeader'
import SearchBar from './SearchBar'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from '../UIElements/Backdrop'
import Notification from './Notification'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group'
import './MainNavigation.css'

const MainNavigation = (props) => {
  const auth = useContext(AuthContext)

  const [drawerIsOpen, setDrawerIsOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const openDrawerHandler = () => {
    setDrawerIsOpen(true)
  }

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false)
  }

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks onClick={closeDrawerHandler} />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <img src={logo} alt="logo" className="main-navigation__logo" />
          <Link to="/">Placebook</Link>
        </h1>
        {auth.isLoggedIn && (
          <nav className="main-navigation__header-mobile-search">
            <button
              className="search mobile"
              type="submit"
              onClick={() => {
                setIsMobileSearchOpen((currentState) => {
                  return !currentState;
                });
                console.log(isMobileSearchOpen);
              }}
            >
              <span
                className="search-emoji mobile"
                role="img"
                aria-label="emoji"
              >
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </button>
            <CSSTransition
              classNames="slide-in-top"
              in={isMobileSearchOpen}
              mountOnEnter
              unmountOnExit
              timeout={200}
            >
              <SearchBar
                isMobile={true}
                closeSearchBarHandler={setIsMobileSearchOpen}
              />
            </CSSTransition>
          </nav>
        )}
        {auth.isLoggedIn && (
          <div>
            <nav className="main-navigation__header-search">
              <SearchBar />
            </nav>
          </div>
        )}
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
        {auth.isLoggedIn && (
          <nav>
            <Notification />
          </nav>
        )}
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
