import React from "react";

const SummaryBox = ({ termsText, bgColor }) => {
  // Map solid → soft colors
  const colorMap = {
    "#13B756": "var(--soft-green)",       // green
    "#8BC33C": "var(--soft-light-green)", // light-green
    "#FFC300": "var(--soft-yellow)",      // yellow
    "#F97127": "var(--soft-orange)",      // orange
    "#FB4245": "var(--soft-red)",         // red
    "#ffffff": "var(--white)"             // fallback/default
  };

  const softColor = colorMap[bgColor] || "var(--white)";

  return (
    <div
      style={{
        backgroundColor: softColor,
        borderRadius: "8px",
        padding: "10px",
        width: "100%",
        height: "194px",
        maxHeight: "250px",
        overflowY: "auto",
        fontSize: "12px",
        boxSizing: "border-box"
      }}
    >
      <strong>Important</strong>
      <p style={{ whiteSpace: "pre-wrap", marginTop: "5px" }}>
        {termsText}
      </p>
    </div>
  );
};

export default SummaryBox;
