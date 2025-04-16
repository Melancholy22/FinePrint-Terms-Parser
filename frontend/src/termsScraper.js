function extractTextFromPage() {
  function getVisibleText(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return "";
    if (window.getComputedStyle(node).display === "none") return "";

    let textContent = "";
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        textContent += child.textContent.trim() + " ";
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        textContent += getVisibleText(child);
      }
    }
    return textContent;
  }

  function extractFromIframes() {
    const iframes = document.getElementsByTagName("iframe");
    let iframeTexts = [];

    for (let iframe of iframes) {
      try {
        let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        let iframeText = getVisibleText(iframeDoc.body);
        if (iframeText.length > 100) {
          iframeTexts.push(iframeText);
        }
      } catch (error) {
        console.warn("Blocked from accessing iframe due to cross-origin policy.");
      }
    }

    return iframeTexts.join("\n\n");
  }

  function extractTermsAndConditions() {
    const keywords = ["Terms of Service", "Terms and Conditions", "Privacy Policy"];
    let pageText = getVisibleText(document.body);
    let iframeText = extractFromIframes();
    pageText += "\n\n" + iframeText;

    const foundTerms = keywords.filter(term => pageText.includes(term));
    return foundTerms.length > 0 ? pageText : "No terms detected on this page.";
  }

  const result = extractTermsAndConditions();

  chrome.storage.local.set({ termsText: result }, () => {
    console.log("✅ Terms text stored in chrome.storage.local");
  });
}

extractTextFromPage();
