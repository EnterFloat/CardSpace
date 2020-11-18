import React from "react";
import { CButton } from "@coreui/react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <CButton color="danger" onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </CButton>
  );
};

export default LogoutButton;