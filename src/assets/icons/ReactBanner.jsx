import React, { Component } from "react";

class MyBanner extends React.Component {
  render() {
    return (
      <svg
        width="148px"
        height="35px"
        viewBox="0 0 148 35"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <title>banner</title>
        <desc>Created with Sketch.</desc>
        <defs>
          <linearGradient
            x1="23.7858953%"
            y1="50%"
            x2="100%"
            y2="50%"
            id="linearGradient1"
          >
            <stop stopColor="#B06700" offset="0%"></stop>
            <stop stopColor="#DE8100" offset="100%"></stop>
          </linearGradient>
          <linearGradient
            x1="0%"
            y1="50%"
            x2="99.8706715%"
            y2="50%"
            id="linearGradient2"
          >
            <stop stopColor="#F18D00" offset="0%"></stop>
            <stop stopColor="#FFB348" offset="100%"></stop>
          </linearGradient>
        </defs>
        <g
          id="banner"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="CardSpace" transform="translate(0.000000, 4.285714)">
            <g id="Group">
              <polygon
                id="Rectangle"
                fill="url(#linearGradient1)"
                points="11.0617104 2.54497354 28.9577259 2.54497354 28.9577259 23.2486772 11.0617104 23.2486772"
              ></polygon>
              <polygon
                id="Rectangle"
                fill="url(#linearGradient2)"
                points="0 1.37566138 19.8688047 0 19.8688047 25.7936508 0 24.4179894"
              ></polygon>
            </g>
          </g>
          <text
            id="CardSpace"
            fontFamily="HiraginoSans-W8, Hiragino Sans"
            fontSize="16.6666667"
            fontWeight="600"
            letterSpacing="0.921428544"
            fill="#FBFBFB"
          >
            <tspan x="32.7380952" y="24.1666667">
              CardSpace
            </tspan>
          </text>
        </g>
      </svg>
    );
  }
}

export default MyBanner;
