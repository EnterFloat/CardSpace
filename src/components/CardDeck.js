import React, { useState } from "react";
import { CCard, CCardBody, CButton } from "@coreui/react";

const CardDeck = (props) => {
  return (
    <CCard id={props.id}>
      <CCardBody>
        <div className="card-deck-flex">
          <h5>{props.deck.deckname}</h5>
          <div className="card-deck-buttons">
            <CButton color="primary">Study now</CButton>
            <CButton color="danger">delete</CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default CardDeck;
