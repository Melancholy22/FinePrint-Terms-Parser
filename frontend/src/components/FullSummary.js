import React, { useEffect, useState } from "react";
import GaugeWrapper from "./gauge"; // ✅ reuse your gauge
// import other components if needed

const FullSummary = ({risk_score}) => {
  const [termsText, setTermsText] = useState("");
  const lastScannedDate = new Date().toLocaleDateString();

  useEffect(() => {
    chrome.storage.local.get(["termsText", "gptResponse"], (result) => {
      if (result.termsText) setTermsText(result.termsText);
      if (result.gptResponse?.risk) setRiskScore(result.gptResponse.risk);
    });
  }, []);

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>FinePrint</h1>
      <h2>Last Report: {lastScannedDate}</h2>

      <div style={{ margin: "20px 0" }}>
        <GaugeWrapper risk_score={risk_score} />
      </div>

      <section>
        <h3>Raw Terms:</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{termsText}</p>
      </section>

      {/* Future: Render breakdown of risks by level */}
    </div>
  );
};

export default FullSummary;
