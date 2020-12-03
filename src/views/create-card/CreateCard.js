import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CInput,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CTooltip,
  CSelect,
  CCol,
  CCardFooter,
} from "@coreui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiCall } from "../../utils/use-api";

import RichEditor from "../../components/RichEditor";
import NotSignedIn from "../../components/NotSignedIn";

// createCard = (e) => {
//     return
//     // e.preventDefault();
//     // if (emailValidated) {
//     //   fetch('http://localhost:5000/api/create-card', {
//     //     method: 'post',
//     //     body : JSON.stringify({
//     //       EMAIL: email
//     //     }),
//     //     headers: {
//     //       'Accept': 'application/json',
//     //       'Content-Type': 'application/json'
//     //     }
//     //   })
//     //   .then(ParseJSON) // It parses the output
//     //   .catch(function(error) {
//     //     console.log("error---", error)
//     //   });
//     // } else {
//     //   alert("invalid email")
//     // }
//   }

const CreateCard = (props) => {
  const { isAuthenticated } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const { REACT_APP_API_BASE_URL } = process.env;
  const [auth0Token, setAuth0Token] = useState("");

  // const api_base_url = REACT_APP_API_BASE_URL;
  const [response, setResonse] = useState("");

  const newConfigFront = null;
  const [contentFront, setContentFront] = useState("");

  const newConfigBack = null;
  const [contentBack, setContentBack] = useState("");
  const [deck, setDeck] = useState({ deckid: -1 });
  const [decks, setDecks] = useState([]);

  function handleLoadDecks() {
    let options = {
      token: auth0Token,
      url: REACT_APP_API_BASE_URL + "/card-decks",
      method: "GET",
    };
    apiCall(options)
      .then((res) => {
        console.log(JSON.stringify(res));
        if (props?.location?.state?.item !== undefined) {
          console.log("Item ")
          console.log(props?.location?.state?.item)
          setDeck({deckid: props.location.state.item});
        } else {
          setDeck({ deckid: res.data[0]?.id });
        }
        setDecks(res.data);
      })
      .catch((err) => alert("Could not create new deck"));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // const cardData = JSON.stringify({
    //   contentFront: contentFront,
    //   contentBack: contentBack,
    //   deckid: deck.deckid,
    // });

    console.log("handleSubmit deckid: " + deck.deckid)
    console.log("handleSubmit deck: ")
    console.log(deck)

    let options = {
      token: auth0Token,
      url: REACT_APP_API_BASE_URL + "/create-card",
      method: "POST",
      body: JSON.stringify({
        contentFront: contentFront,
        contentBack: contentBack,
        deckid: deck.deckid,
      }),
    };
    apiCall(options)
      .then((res) => {
        alert(JSON.stringify(res.data));
        
      })
      .catch((err) => alert("Could not create new card"));

    // (async () => {
    //   try {
    //     const token = await getAccessTokenSilently({
    //       audience: REACT_APP_API_BASE_URL,
    //       scope: "read:current_user",
    //     });
    //     console.log(token);
    //     const response = await fetch(REACT_APP_API_BASE_URL + "/create-card", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //       method: "POST",
    //       body: cardData,
    //     });
    //     const responseJSON = await response.json();
    //     console.log(responseJSON);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // })();
  };

  useEffect(() => {
    handleLoadDecks();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    async function newAuth0Token() {
      let token = await getAccessTokenSilently({
        audience: REACT_APP_API_BASE_URL,
        scope: "read:current_user",
      });
      setAuth0Token(token);
    }
    newAuth0Token();
  }, [auth0Token]);

  return (
    <CCard>
      <CCardHeader>
        <h2>Create new flashcard</h2>
      </CCardHeader>
      {isAuthenticated ? (
        <>
          <CForm onSubmit={(v) => handleSubmit(v)}>
            <CCardBody>
              <CFormGroup>
                <h3>Front</h3>
                <CLabel htmlFor="card-front">
                  Design the front of your new flashcard:
                </CLabel>
                <RichEditor
                  name="card-front"
                  value={contentFront}
                  config={newConfigFront}
                  onChange={(newContentFront) =>
                    setContentFront(newContentFront)
                  }
                />
                <br />
                <hr />
                <br />
                <h3>Back</h3>
                <CLabel htmlFor="card-back">
                  Design the back of your new flashcard:
                </CLabel>
                <RichEditor
                  name="card-back"
                  value={contentBack}
                  config={newConfigBack}
                  onChange={(newContentBack) => setContentBack(newContentBack)}
                />
                <br />
                <hr />
                <CLabel htmlFor="carddeck-select">
                  Select a carddeck to add the new card to:
                </CLabel>
                <CSelect
                  value={deck.id}
                  onChange={(e) => setDeck({ deckid: e.target.value })}
                  name="carddeck-select"
                >
                  {decks.map((deck) => {
                    return (
                      <option key={deck?.id} value={deck?.id}>
                        {deck?.deckname}
                      </option>
                    );
                  })}
                  {/* <option value="2">Carddeck 2</option>
                  <option value="3">Carddeck 3</option> */}
                </CSelect>
              </CFormGroup>
            </CCardBody>
            <CCardFooter>
              <CFormGroup className="center">
                <CButton
                  color="primary"
                  type="submit"
                  onClick={(e) => console.log(e)}
                >
                  Create new card
                </CButton>
              </CFormGroup>
            </CCardFooter>
          </CForm>
        </>
      ) : (
        <NotSignedIn />
      )}
    </CCard>
  );
};

export default CreateCard;
