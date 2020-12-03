import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CInput,
  CButton,
  CFormGroup,
  CLabel,
  CTooltip,
  CSelect,
  CCol,
  CForm,
  CDataTable,
  CBadge,
  CImg,
  CCollapse,
  CInputGroup,
  CInputGroupPrepend,
  CRow,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CModalBody,
} from "@coreui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiCall } from "../../utils/use-api";

import NotSignedIn from "../../components/NotSignedIn";
import CardDeck from "../../components/CardDeck";

const CardDecks = (props) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [auth0Token, setAuth0Token] = useState("");
  const { REACT_APP_API_BASE_URL } = process.env;

  let history = useHistory();
  // const [deckName, setDeckName] = useState("");
  const [deckType, setDeckType] = useState("1");
  const [hasError, setErrors] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [shouldCreateDeck, setShouldCreateDeck] = useState({
    shouldCreateDeck: false,
    apiData: {},
  });
  const [decksData, setDecksData] = useState([]);

  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [newDeckName, setNewDeckName] = useState("");
  const [users, setUsers] = useState({});

  // const token = await getAccessTokenSilently({
  //   audience: REACT_APP_API_BASE_URL,
  //   scope: "read:current_user",
  // });
  // const getResults = async () => { return "Hello"; };

  function HandleCreateDeck(e) {
    e.preventDefault();

    let options = {
      token: auth0Token,
      url: REACT_APP_API_BASE_URL + "/create-card-deck",
      method: "POST",
      body: JSON.stringify({
        deckName: newDeckName,
        deckType: deckType,
      }),
    };
    apiCall(options)
      .then((res) => {
        console.log(JSON.stringify(res));
        setShouldFetch(true);
        setNewDeckName("");
        // alert("Fetched");
      })
      .catch((err) => alert("Could not create new deck"));
  }

  function HandleFetchDecks() {
    let options = {
      token: auth0Token,
      url: REACT_APP_API_BASE_URL + "/card-decks",
      method: "GET",
    };
    apiCall(options)
      .then((res) => {
        console.log(JSON.stringify(res));
        setDecksData(res.data);
        setShouldFetch(false);
      })
      .catch((err) => alert("Could not fetch decks"));
  }

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
    if (!isAuthenticated) {
      return;
    }    
    if (shouldFetch) {
      HandleFetchDecks();
      setShouldFetch(false);
    }
  });

  const fields = [
    { label: "Deck name", key: "deckname", _style: { width: "60%" } },
    { key: "due", _style: { width: "10%" } },
    { key: "new", _style: { width: "10%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  const studyDeck = (cardDeck) => {
    history.push(`/card-decks/study/${cardDeck.id}`);
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          <h2>Card Decks</h2>
        </CCardHeader>
        {isAuthenticated ? (
          <>
            <CCardBody>
              <h3>Your card decks</h3>
              <p>Select a card deck to start studying</p>
              {/* columnFilter */}
              <CDataTable
                items={decksData}
                fields={fields}
                tableFilter={{ placeholder: "Filter text..." }}
                footer
                itemsPerPageSelect
                itemsPerPage={5}
                hover
                sorter
                pagination
                clickableRows
                onRowClick={(deck) => {
                  studyDeck(deck);
                }}
                scopedSlots={{
                  deckname: (item) => (
                    <td>
                      <p>{item.deckname}</p>
                    </td>
                  ),
                  due: (item) => (
                    <td>
                      <CBadge color="success">{item.due}</CBadge>
                    </td>
                  ),
                  new: (item) => (
                    <td>
                      <CBadge color="primary">{item.new}</CBadge>
                    </td>
                  ),
                  show_details: (item, index) => {
                    return (
                      <td className="py-2">
                        <CDropdown
                          className="btn-group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CDropdownToggle
                            color="primary"
                            shape="square"
                            variant="outline"
                            size="sm"
                          >
                            Options
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={() => {
                                studyDeck(item);
                              }}
                            >
                              Study
                            </CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem
                              onClick={() => {
                                setCurrentItem(item);
                                setRenameModal(!renameModal);
                              }}
                            >
                              Rename
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={() => {
                                history.push({
                                  pathname: `/create-card/${item.id}`,
                                  state: { item: item },
                                });
                              }}
                            >
                              Add card
                            </CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem
                              onClick={() => {
                                setCurrentItem(item);
                                setDeleteModal(!deleteModal);
                              }}
                            >
                              Delete
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </td>
                    );
                  },
                }}
              />
              <hr></hr>
              <CRow style={{ display: "flex", alignItems: "center" }}>
                <CCol md="12" sm="12" xs="12" lg="6">
                  <h3>Add new card deck</h3>
                  {/* <CLabel htmlFor="deck-name">Enter new deck name:</CLabel> */}
                  <CForm
                    onSubmit={(v) => HandleCreateDeck(v)}
                    className="form-horizontal"
                  >
                    <CFormGroup row>
                      <CCol>
                        <CInputGroup>
                          <CInputGroupPrepend>
                            <CButton type="submit" color="primary">
                              + Create deck
                            </CButton>
                          </CInputGroupPrepend>
                          <CInput
                            name="deck-name"
                            onChange={(n) => setNewDeckName(n.target.value)}
                            placeholder="Enter new card deck name..."
                            value={newDeckName}
                          ></CInput>
                        </CInputGroup>
                      </CCol>
                    </CFormGroup>
                  </CForm>
                </CCol>
                <CCol md="2" lg="1"></CCol>
                <CCol>
                  <CImg
                    src={"decoration/flashcards.png"}
                    className="c-avatar-img"
                    alt="admin@bootstrapmaster.com"
                  />
                </CCol>
                <CCol md="2" lg="1"></CCol>
              </CRow>
            </CCardBody>

            <CModal show={deleteModal} onClose={setDeleteModal} color="danger">
              <CModalHeader closeButton>
                <CModalTitle>Delete {currentItem.deckname}</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Are you sure you want to delete the card deck{" "}
                <strong>{currentItem.deckname}</strong>? All cards will be
                destroyed.
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="danger"
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                >
                  Delete
                </CButton>{" "}
                <CButton
                  color="secondary"
                  onClick={() => setDeleteModal(false)}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>

            <CModal show={renameModal} onClose={setRenameModal} color="primary">
              <CModalHeader closeButton>
                <CModalTitle>Rename {currentItem.deckname}</CModalTitle>
              </CModalHeader>
              <CForm>
                <CModalBody>
                  <CLabel htmlFor="new-name">
                    Enter a new name for <strong>{currentItem.deckname}</strong>
                    :
                  </CLabel>
                  <CInput
                    name="new-name"
                    placeholder={"New deck name..."}
                  ></CInput>
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="primary"
                    onClick={() => {
                      setRenameModal(false);
                    }}
                  >
                    Rename
                  </CButton>{" "}
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setRenameModal(false);
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>
            {/* {cardDecks ? (
            cardDecks
              .sort((a, b) => (a.created < b.created ? 1 : -1))
              .map((cardDeck) => {
                return <CardDeck deck={cardDeck} />;
              })
          ) : (
            <p>No carddecks loaded yet</p>
          )} */}
          </>
        ) : (
          <NotSignedIn />
        )}
      </CCard>
    </>
  );
};

export default CardDecks;
