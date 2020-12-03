import React from "react";
import { CCard, CCardBody } from "@coreui/react";
import LoginButton from "./LoginButton";

const NotSignedIn = () => {
  return (
      <CCardBody>
        <h3>You are not signed in.</h3>
        <p>Please sign in.</p>
        <LoginButton />
      </CCardBody>
  );
};

export default NotSignedIn;
