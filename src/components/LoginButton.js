import React from "react";
import { CButton } from "@coreui/react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <CButton color="primary" onClick={() => loginWithRedirect()}>Log In</CButton>;
};

export default LoginButton;
