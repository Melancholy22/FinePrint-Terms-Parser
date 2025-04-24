import React, { useEffect, useState } from "react";
import Header from "./header";
import SummaryBox from "./summary";
import GaugeWrapper from "./gauge";
import Emoji from "./emoji";
import FullSummary from "./FullSummary";
import ClipLoader from "react-spinners/ClipLoader"; // ✅ NEW
import "./styles.css";
import BulletList from "./bulletList";

const App = () => {
  const isReportPage = window.location.pathname.includes("report.html");

  const [termsText, setTermsText] = useState("Loading...");
  const [riskScore, setRiskScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function assign_color(score) {
    if (score <= 20) return "#13B756";
    else if (score <= 40) return "#8BC33C";
    else if (score <= 60) return "#FFC300";
    else if (score <= 80) return "#F97127";
    else if (score <= 100) return "#FB4245";
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
        fetch("http://localhost:5000/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: "A. INTRODUCTION\nThis Agreement governs your use of Apple’s services..."
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(data => {
            console.log("Server response:", data);
            setTermsText(data.received_text);
          })
          .catch(error => {
            console.error("Error posting to /text:", error);
            setError("Failed to load terms and conditions.");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setTermsText("No terms and conditions found on this page.");
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (termsText && termsText !== "Loading...") {
      const mockGPTResponse = { risk: 43 };
      const risk = mockGPTResponse.risk;
      setRiskScore(risk);

      chrome.runtime.sendMessage({
        type: "SET_BADGE",
        text: '!',
        color: assign_color(mockGPTResponse.risk)
      });
    }
  }, [termsText]);

  if (isReportPage) {
    return <FullSummary risk_score={riskScore ?? 0} />;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

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
        {loading ? (
          <BulletList/>
        ) : (
          <SummaryBox termsText={termsText} bgColor={assign_color(riskScore ?? 0)} />
        )}
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
          onClick={() => {
            console.log("View Full Report");
            chrome.tabs.create({ url: chrome.runtime.getURL("report.html") });
          }}
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
