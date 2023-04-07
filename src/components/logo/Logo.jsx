import React from "react";
import Tilt from "react-parallax-tilt";

import brain from "./brain.png";
import "./logo.css";

const Logo = () => {
  return (
    <div className="center mt0">
      <Tilt>
        <div
          className="Tilt br2 shadow-2 pa3 center"
          style={{
            height: "200px",
            width: "200px",
          }}
        >
          <img style={{ paddingTop: "5px" }} src={brain} alt="brain" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
