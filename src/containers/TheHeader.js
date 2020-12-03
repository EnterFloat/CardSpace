import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CNavbar,
  CCollapse,
  CNavbarNav,
  CNavbarBrand,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownNav,
  CDropdownToggle,
  CNavLink,
  CDropdownDivider,
  CNavItem,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useAuth0 } from "@auth0/auth0-react";

// routes config
import routes from "../routes";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks,
} from "./index";

const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <CNavbar expandable="sm" className="navbar" light fixed="top">
        <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
        <CNavbarBrand to="/">
          <CIcon name="logo" height="35" alt="Logo" />
        </CNavbarBrand>
        <CCollapse show={isOpen} navbar>
          <CNavbarNav>
            <CNavLink to="/card-decks">Card Decks</CNavLink>
            <CNavLink to="/create-card/0">New Card</CNavLink>
            <CNavLink to="/stats">Stats</CNavLink>
            <CNavLink to="/browse">Browse</CNavLink>
          </CNavbarNav>
          <CNavbarNav className="ml-auto">
            <CDropdown inNav>
              <CDropdownToggle color="primary">Language</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>DA</CDropdownItem>
                <CDropdownItem>EN</CDropdownItem>                
              </CDropdownMenu>
            </CDropdown>
            <CDropdown inNav>
              {
                (isAuthenticated ? (
                  <>
                  <CDropdownToggle color="primary">User</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Account</CDropdownItem>
                    <CDropdownItem>Settings</CDropdownItem>
                    <CDropdownDivider></CDropdownDivider>
                    <CDropdownItem
                      onClick={() =>
                        logout({ returnTo: window.location.origin })
                      }
                    >
                      Log out
                    </CDropdownItem>
                  </CDropdownMenu>
                  </>
                ) : (
                  <CNavLink onClick={() => loginWithRedirect()}>Login</CNavLink>
                ))
              }
            </CDropdown>
          </CNavbarNav>
        </CCollapse>
      </CNavbar>
    </div>
  );

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      {/* <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      /> */}
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo" />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/users">Users</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink>Settings</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      {/* <CHeaderNav className="px-3">
        <TheHeaderDropdownNotif/>
        <TheHeaderDropdownTasks/>
        <TheHeaderDropdownMssg/>
        <TheHeaderDropdown/>
      </CHeaderNav> */}

      {/* <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
          routes={routes} 
        />
          <div className="d-md-down-none mfe-2 c-subheader-nav">
            <CLink className="c-subheader-nav-link"href="#">
              <CIcon name="cil-speech" alt="Settings" />
            </CLink>
            <CLink 
              className="c-subheader-nav-link" 
              aria-current="page" 
              to="/dashboard"
            >
              <CIcon name="cil-graph" alt="Dashboard" />&nbsp;Dashboard
            </CLink>
            <CLink className="c-subheader-nav-link" href="#">
              <CIcon name="cil-settings" alt="Settings" />&nbsp;Settings
            </CLink>
          </div>
      </CSubheader> */}
    </CHeader>
  );
};

export default TheHeader;
