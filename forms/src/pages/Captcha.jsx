import React from "react";

const Captcha = ({ captcha, refresh }) => {
  return (
    <div style={{ margin: "10px 0", textAlign: "center" }}>
      <div style={{
        background: "#f0f0f0",
        padding: "10px",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "5px",
        userSelect: "none",
      }}>
        {captcha}
      </div>
      <button type="button" onClick={refresh} style={{ marginTop: "5px" }}>
        Refresh Captcha
      </button>
    </div>
  );
};

export default Captcha;
