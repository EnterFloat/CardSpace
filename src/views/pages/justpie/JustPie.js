import React, { useState} from "react";
import {
  CButton,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupAppend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";


// Define the function (functional components not classes)
const JustPie = () => {
  // Set up the state variables
  const [downloadLink, setDownloadLink] = useState(""); // Image
  const [imgId, setImgId] = useState(0); // Image
  // Default settings for our form
  const [data, setData] = useState("40,60");
  const [colors, setColors] = useState("003049,ffcdb2");
  const [wedge, setWedge] = useState(0.05);
  // NB: This URL will changed depending on your release!!!
  // const api_base_url = "https://mnemo-flask-react.herokuapp.com/api/justpie";
  const { REACT_APP_API_BASE_URL } = process.env;
  const api_base_url = REACT_APP_API_BASE_URL;  

  console.log(api_base_url)
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
        console.log(res)  
        return res.json()
      })
      .then(
        (result) => {
          console.log(result)  
          // Set the image to be the API return "message"
          setDownloadLink(result.message);
          setImgId(imgId+1);
        },
        (error) => {
          console.log("Error:")
          console.log(error);
        }
      );
  }
  // The rest of the code that runs the actual render

  return (
    <>
      <CInput
        type="text"
        id="hf-text"
        name="hf-text"
        placeholder="40,60"
        autoComplete=""
        value={data}
        onChange={(event) => setData(event.target.value)}
      />
      <CInput
        type="text"
        id="hf-text"
        name="hf-text"
        placeholder="003049,ffcdb2"
        autoComplete=""
        value={colors}
        onChange={(event) => setColors(event.target.value)}
      />
      <CButton
        type="submit"
        size="sm"
        color="primary"
        onClick={() => fetchData()}
      ></CButton>
      <img id={imgId} src={downloadLink} alt="" style={{width: "100%"}}></img>
    </>
  );
};

export default JustPie;
