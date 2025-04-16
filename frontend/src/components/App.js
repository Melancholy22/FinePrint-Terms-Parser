import React, { useEffect, useState } from "react";
import Header from "./header";
import SummaryBox from "./summary";
import GaugeWrapper from "./gauge";
import Emoji from "./emoji";

const App = () => {
  const [termsText, setTermsText] = useState("Loading...");
  const [riskScore, setRiskScore] = useState(null);

  function assign_color(score) {
    if (score <= 20) return "#13B756";     // green
    else if (score <= 40) return "#8BC33C"; // light-green
    else if (score <= 60) return "#FFC300"; // yellow
    else if (score <= 80) return "#F97127"; // orange
    else if (score <= 100) return "#FB4245"; // red
    return "#ffffff";
  }

  function assign_message(score) {
    if (score <= 20) return "No Risk";
    else if (score <= 40) return "Low Risk";
    else if (score <= 60) return "Medium Risk";
    else if (score <= 80) return "High Risk";
    else if (score <= 100) return "DANGER";
    return "Parsing Failed";
  }

  useEffect(() => {
    chrome.storage.local.get("termsText", (result) => {
      if (result.termsText?.trim()) {
        setTermsText(result.termsText);
      } else {
        setTermsText("No terms and conditions found on this page.");
      }
    });
  }, []);

  useEffect(() => {
    if (termsText && termsText !== "Loading...") {
      const mockGPTResponse = { risk: 43 };
      const risk = mockGPTResponse.risk;
      setRiskScore(risk);

      // Notification
      chrome.runtime.sendMessage({
        type: "SET_BADGE",
        text: '!',
        color: assign_color(mockGPTResponse.risk)
      });
    }
  }, [termsText]);

  return (
    <div style={{ width: "345px", height: "600px", fontFamily: "sans-serif" }}>
      <Header bgColor={assign_color(riskScore ?? 0)} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GaugeWrapper risk_score={riskScore ?? 0} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <Emoji />
      </div>

      <div style={{ padding: "0 12px" }}>
        <SummaryBox termsText={termsText} bgColor={assign_color(riskScore ?? 0)} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", marginTop: "10px" }}>
        <button
          onClick={() => console.log("Paste T&C Link")}
          style={{
            backgroundColor: "var(--soft-yellow)",
            borderRadius: "8px",
            padding: "10px",
            width: "135px",
            height: "33px",
            fontSize: "12px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Paste T&C
        </button>

        <button
          onClick={() => console.log("View Full Report")}
          style={{
            backgroundColor: "var(--soft-yellow)",
            borderRadius: "8px",
            padding: "10px",
            width: "135px",
            height: "33px",
            fontSize: "12px",
            border: "none",
            cursor: "pointer"
          }}
        >
          View Full Report
        </button>
      </div>
    </div>
  );
};

export default App;
