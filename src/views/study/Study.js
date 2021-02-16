import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CInput,
  CButton,
  CButtonGroup,
  CFormGroup,
  CLabel,
  CTooltip,
  CForm,
  CRow,
  CSelect,
  CCol,
} from "@coreui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiCall } from "../../utils/use-api";

import RichEditor from "../../components/RichEditor";
import NotSignedIn from "../../components/NotSignedIn";

const Study = (props) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [auth0Token, setAuth0Token] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);
  const [deckId, setDeckId] = useState(-1);
  const [cards, setCards] = useState([]);
  const [card, setCard] = useState([]);
  const { REACT_APP_API_BASE_URL } = process.env;

  const location = useLocation();
  let newConfigFront = {
    readonly: true,
    toolbar: false,
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
  };
  let newConfigBack = {
    readonly: true,
    toolbar: false,
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
  };
  const [revealBack, setRevealBack] = useState(false);
  const [contentFront, setContentFront] = useState(
    "<h1>Welcome</h1><p>Flashcard!</p>"
  );
  const [contentBack, setContentBack] = useState(
    "<h1>Goodbye</h1><p>Back. Pleasse rate</p>"
  );

  function HandleCardRate(cardid, rating = "") {
    let options = {
      token: auth0Token,
      url: REACT_APP_API_BASE_URL + "/rate-card",
      method: "POST",
      body: JSON.stringify({
        cardid: cardid,
        rating: rating,
      }),
    };
    apiCall(options)
      .then((res) => {
        alert(JSON.stringify(res.data));
        if (res.data.repeat == false) setCards(cards.slice(1));
        setRevealBack(false);
      })
      .catch((err) => alert("Could not rate card"));
  }

  function HandleFetchCards() {
    console.log("deck id " + deckId);
    let options = {
      token: auth0Token,
      url: REACT_APP_API_BASE_URL + "/cards?deck_id=" + deckId,
      method: "GET",
    };
    apiCall(options)
      .then((res) => {
        console.log(JSON.stringify(res));
        setCards(res.data);
        setShouldFetch(true);
        // alert("Fetched");
      })
      .catch((err) => alert("Could not fetch cards"));
  }

  useEffect(() => {
    if (shouldFetch && deckId != -1) {
      HandleFetchCards();
    }
  }, [deckId]);

  useEffect(() => {
    if (cards) {
      setCard(cards[0]);
    }
  });

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

  useEffect(() => {
    if (props?.match?.params?.id) {
      setDeckId(props.match.params.id);
    } else {
      alert("No deck id");
    }
  }, []);
  console.log(revealBack);
  if (!card?.id) {
    return (
      <p>
        Congratulations! You have studied every card in this deck. Take a break.
      </p>
    );
  }
  return (
    <>
      {isAuthenticated ? (
        <>
          <CCard>
            <CCardHeader>
              <h2>
                You are studying {card.id}. Due {card.due}
              </h2>
            </CCardHeader>
            {!revealBack ? (
              <CCardBody>
                <CCol className="space-between">
                  <h3>Front:</h3>
                  <CButton color="secondary" variant="outline">
                    Edit card
                  </CButton>
                </CCol>
                <RichEditor
                  name="card-front"
                  content={card.cardfront}
                  config={newConfigFront}
                  onChange={(newContentFront) =>
                    setContentFront(newContentFront)
                  }
                />
                <br />
                <CCol className="center">
                  <CButton onClick={() => setRevealBack(true)} color="primary">
                    Flip Card
                  </CButton>
                </CCol>
              </CCardBody>
            ) : (
              <CCardBody>
                <CCol className="space-between">
                  <h3>Back:</h3>
                  <CButton color="secondary" variant="outline">
                    Edit card
                  </CButton>
                </CCol>
                <RichEditor
                  name="card-back"
                  content={card.cardback}
                  config={newConfigBack}
                  onChange={(newContentBack) => setContentBack(newContentBack)}
                />
                <br />
                <CCol>
                  <h5>Rate quality of recall:</h5>
                </CCol>
                <CForm>
                  <CFormGroup>
                    <CRow>
                      <CButtonGroup className="center">
                        <div className="rating-div">
                          <CTooltip content={`Complete blackout`}>
                            <CButton
                              name="0"
                              color="danger"
                              onClick={() => HandleCardRate(card.id, 0)}
                            >
                              0
                            </CButton>
                          </CTooltip>
                        </div>
                        <div className="rating-div">
                          <CTooltip
                            content={`Incorrect response; the correct one remembered`}
                          >
                            <CButton
                              name="1"
                              color="warning"
                              onClick={() => HandleCardRate(card.id, 1)}
                            >
                              1
                            </CButton>
                          </CTooltip>
                        </div>
                        <div className="rating-div">
                          <CTooltip
                            content={`Incorrect response; where the correct one seemed easy to recall`}
                          >
                            <CButton
                              name="2"
                              color="primary"
                              onClick={() => HandleCardRate(card.id, 2)}
                            >
                              2
                            </CButton>
                          </CTooltip>
                        </div>
                        <div className="rating-div">
                          <CTooltip
                            content={`Correct response recalled with serious difficulty`}
                          >
                            <CButton
                              name="3"
                              color="info"
                              onClick={() => HandleCardRate(card.id, 3)}
                            >
                              3
                            </CButton>
                          </CTooltip>
                        </div>
                        <div className="rating-div">
                          <CTooltip
                            content={`Correct response after a hesitation`}
                          >
                            <CButton
                              name="4"
                              color="success"
                              onClick={() => HandleCardRate(card.id, 4)}
                            >
                              4
                            </CButton>
                          </CTooltip>
                        </div>
                        <div className="rating-div">
                          <CTooltip content={`Perfect response`}>
                            <CButton
                              name="5"
                              color="success"
                              onClick={() => HandleCardRate(card.id, 5)}
                            >
                              5
                            </CButton>
                          </CTooltip>
                        </div>
                      </CButtonGroup>
                    </CRow>
                  </CFormGroup>
                </CForm>
              </CCardBody>
            )}
          </CCard>
        </>
      ) : (
        <NotSignedIn />
      )}
    </>
  );
};

export default Study;
