import React, { useState } from "react";
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

import RichEditor from "../../components/RichEditor";

const PieGen = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Set up the state variables
  const [downloadLink, setDownloadLink] = useState(""); // Image
  const [imgId, setImgId] = useState(0); // Image
  // Default settings for our form
  const [data, setData] = useState("40,60");
  const [colors, setColors] = useState("003049,ffcdb2");
  const [wedge, setWedge] = useState(0.05);

  const newConfig = null;
  const [content, setContent] = useState("");

  // NB: This URL will changed depending on your release!!!
  // const api_base_url = "https://mnemo-flask-react.herokuapp.com/api/justpie";
  const { REACT_APP_API_BASE_URL } = process.env;
  const api_base_url = REACT_APP_API_BASE_URL;

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  console.log(api_base_url);
  // Function to fetch the data from our API
  function fetchData() {
    // Set the image to be empty
    setDownloadLink("");
    // Build up the endpoint to our API
    var url_req_string =
      api_base_url + "?data=" + data + "&colors=" + colors + "&wedge=" + wedge;
    // Fetch the URL and parse the JSON response
    fetch(url_req_string)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then(
        (result) => {
          console.log(result);
          // Set the image to be the API return "message"
          setDownloadLink(result.message);
          setImgId(imgId + 1);
        },
        (error) => {
          console.log("Error:");
          console.log(error);
        }
      );
  }
  return (
    <CCard>
      <CCardHeader>Generate Pie Chart</CCardHeader>
      {isAuthenticated ? (
        <CCardBody>
          <CFormGroup>
            <CLabel htmlFor="pie-slices">Pie slices</CLabel>
            <CInput
              type="text"
              id="pie-slices"
              name="pie-slices"
              placeholder="40,60"
              autoComplete=""
              value={data}
              onChange={(event) => setData(event.target.value)}
            />
            <CLabel htmlFor="slice-colors">Slice colors</CLabel>
            <CInput
              type="text"
              id="slice-colors"
              name="slice-colors"
              placeholder="003049,ffcdb2"
              autoComplete=""
              value={colors}
              onChange={(event) => setColors(event.target.value)}
            />
            <CTooltip
              content={`Genererate your high-res pie chart. Generated backend with Flask and stored in a AWS S3 Bucket`}
              placement="top"
            >
              <CButton
                type="submit"
                className="submit-btn"
                size="sm"
                color="primary"
                onClick={() => fetchData()}
              >
                Generate Chart
              </CButton>
            </CTooltip>
            <RichEditor
              value={content}
              config={newConfig}
              onChange={(newContent) => setContent(newContent)}
            />
          </CFormGroup>

          <img
            id={imgId}
            src={downloadLink}
            alt=""
            style={{ width: "100%" }}
          ></img>
        </CCardBody>
      ) : (
        <CCardBody>
          <p>You must be signed in to use this feature.</p>          
        </CCardBody>
      )}
    </CCard>
  );
};

export default PieGen;
