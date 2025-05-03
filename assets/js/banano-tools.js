/**
 * Banano Tools
 * Common JavaScript functions for Banano cryptocurrency tooling
 */

// Convert a hex string to a byte array
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

// Convert a byte array to a hex string
function uint8_hex(bytes) {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    let aux = bytes[i].toString(16).toUpperCase();
    if (aux.length == 1) aux = "0" + aux;
    hex += aux;
  }
  return hex;
}

// Convert decimal to hex with padding
function dec2hex(dec, padding) {
  let hex = Number(dec).toString(16);
  padding = typeof padding === "undefined" || padding === null ? 2 : padding;
  while (hex.length < padding) {
    hex = "0" + hex;
  }
  return hex;
}

// Load the copy helper functionality
function loadCopyHelper() {
  // Add copy buttons to all elements with the copy class
  document.querySelectorAll(".copy").forEach((el) => {
    // Create copy button
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.classList.add("copy-button");
    copyButton.addEventListener("click", function () {
      // Copy text to clipboard
      navigator.clipboard
        .writeText(el.value || el.textContent)
        .then(() => {
          // Visual feedback
          const originalText = copyButton.textContent;
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Error copying text: ", err);
        });
    });

    // Add button next to the element
    if (el.nodeName === "INPUT") {
      el.parentNode.insertBefore(copyButton, el.nextSibling);
    } else {
      el.appendChild(copyButton);
    }
  });
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Run any initialization code here
  loadCopyHelper();
});