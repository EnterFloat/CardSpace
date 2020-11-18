import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CInput,
  CButton,
  CFormGroup,
  CLabel,
  CTooltip,
  CCol,
} from "@coreui/react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../../components/LoginButton.js";
// import { useApi } from '../../utils/use-api';

// const CardDecks = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   console.log(isLoading);
//   if (isLoading) {
//     return <div>Loading ...</div>;
//   }
//   // console.log(user);
//   // if (isAuthenticated) {
//   //   console.log("isAuthenticated: " + isAuthenticated)
//   // }

//   return (
//     <CCard>
//       {isAuthenticated ? (
//         <CCardBody>
//           <img src={user.picture} alt={user.name} />
//           <h2>{user.name}</h2>
//           <p>{user.email}</p>
//         </CCardBody>
//       ) : (
//         <CCardBody>
//           <p>Sign in</p>
//         </CCardBody>
//       )}
//     </CCard>
//   );
// };

const CardDecks = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [message, setMessage] = useState(null);

    useEffect(() => {
      (async () => {
        try {
          // const { REACT_APP_API_BASE_URL } = process.env;
          // const api_base_url = REACT_APP_API_BASE_URL;
          const token = await getAccessTokenSilently({
            audience: 'http://localhost:5000/api/justpie',
            scope: 'read:current_user',
          });
          console.log(token)
          const response = await fetch('http://localhost:5000/api/justpie?data=40,60&colors=ff00ff,00ffaa&wedge=0.05', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: 'POST',
          });
          setMessage(await response.json());
        } catch (e) {
          console.error(e);
        }
      })();
    }, [getAccessTokenSilently]);

    if (!message) {
      return <div><LoginButton />Loading...</div>;
    }

    return (
      <CCard>
        <CCardBody>
          <img src={message.message} style={{width: "100%"}} alt=""/>
        </CCardBody>
      </CCard>
    );
  };

export default CardDecks;
