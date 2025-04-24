import React, { useEffect, useState } from "react";
import GaugeWrapper from "./gauge";
import "./styles.css";

const FullSummary = ({ risk_score }) => {
  const [termsText, setTermsText] = useState("");
  const lastScannedDate = new Date().toLocaleDateString();

  useEffect(() => {
    chrome.storage.local.get(["termsText", "gptResponse"], (result) => {
      if (result.termsText) setTermsText(result.termsText);
      if (result.gptResponse?.risk) setRiskScore(result.gptResponse.risk);
    });
  }, []);

  return (
    <div className="full-summary-container">
      <h1 className="fineprint-title">
        Fine <span class>Print</span>
      </h1>
      <h2 className="last-report">Last Report: {lastScannedDate}</h2>

      <div className="gauge-wrapper">
        <GaugeWrapper risk_score={risk_score} />
      </div>

      <section className="terms-section">
        <h3>Raw Terms:</h3>
        <p>{termsText}</p>
      </section>
    </div>
  );
};

export default FullSummary;
