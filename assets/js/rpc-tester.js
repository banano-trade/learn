/**
 * Banano RPC Tester - Interactive script for testing RPC commands
 * For Learn Banano - https://learn.banano.trade
 */

document.addEventListener("DOMContentLoaded", function () {
  // Handle custom URL selector
  const rpcNodeSelector = document.getElementById("rpc-node-url");
  const customUrlContainer = document.getElementById("custom-url-container");
  const customUrlInput = document.getElementById("custom-rpc-url");
  const customUrlSave = document.getElementById("custom-url-save");

  if (rpcNodeSelector) {
    rpcNodeSelector.addEventListener("change", function () {
      if (this.value === "custom") {
        customUrlContainer.style.display = "block";
      } else {
        customUrlContainer.style.display = "none";
      }
    });
  }

  if (customUrlSave) {
    customUrlSave.addEventListener("click", function () {
      if (customUrlInput.value.trim()) {
        // Add a new option with the custom URL
        const option = document.createElement("option");
        option.value = customUrlInput.value.trim();
        option.textContent = "Custom: " + customUrlInput.value.trim();
        option.selected = true;

        // Insert before the "Custom URL..." option
        const customOption = rpcNodeSelector.querySelector(
          'option[value="custom"]'
        );
        rpcNodeSelector.insertBefore(option, customOption);

        customUrlContainer.style.display = "none";
      }
    });
  }

  // Setup all RPC testers on the page
  const rpcTesters = document.querySelectorAll(".rpc-tester");

  rpcTesters.forEach((tester) => {
    const action = tester.dataset.action;
    const sendButton = tester.querySelector(".send-request");
    const resultsContainer = tester.querySelector(".rpc-results");
    const responseArea = tester.querySelector(".response-area");

    if (sendButton) {
      sendButton.addEventListener("click", async function () {
        // Show loading state
        sendButton.disabled = true;
        sendButton.textContent = "Sending...";
        resultsContainer.style.display = "none";

        try {
          // Build request payload based on the action
          const payload = buildRequestPayload(action, tester);

          // Get selected RPC node URL
          let rpcUrl = rpcNodeSelector.value;
          if (rpcUrl === "custom") {
            rpcUrl = customUrlInput.value.trim();
            if (!rpcUrl) {
              throw new Error("Please enter a custom RPC URL");
            }
          }

          // Send request to RPC node
          const response = await sendRpcRequest(rpcUrl, payload);

          // Display results
          responseArea.textContent = JSON.stringify(response, null, 2);
          resultsContainer.style.display = "block";
        } catch (error) {
          responseArea.textContent = error.message;
          resultsContainer.style.display = "block";
        } finally {
          // Reset button state
          sendButton.disabled = false;
          sendButton.textContent = "Send Request";
        }
      });
    }
  });
});

/**
 * Builds the request payload based on the action type and form values
 */
function buildRequestPayload(action, testerElement) {
  const payload = { action };

  // Common field mapping
  const fieldMappings = {
    account_balance: ["account", "include_only_confirmed"],
    account_block_count: ["account"],
    account_get: ["key"],
    account_history: ["account", "count"],
    account_info: ["account", "representative", "weight"],
    account_key: ["account"],
    account_representative: ["account"],
    accounts_balances: {
      accounts: (value) => value.split(",").map((a) => a.trim()),
    },
    accounts_frontiers: {
      accounts: (value) => value.split(",").map((a) => a.trim()),
    },
    block_info: ["hash", "json_block"],
    blocks_info: {
      hashes: (value) => value.split(",").map((a) => a.trim()),
      json_block: null,
    },
    representatives_online: ["weight"],
    wallet_balance_total: ["wallet"],
    ban_to_raw: ["amount"],
    raw_to_ban: ["amount"],
  };

  const mapping = fieldMappings[action] || [];

  // Process simple string field mappings
  if (Array.isArray(mapping)) {
    mapping.forEach((fieldName) => {
      const element = testerElement.querySelector(`#${action}_${fieldName}`);
      if (element) {
        let value = element.value.trim();

        // Handle special boolean cases
        if (
          element.tagName === "SELECT" &&
          (value === "true" || value === "false")
        ) {
          value = value === "true";
        }

        if (value !== "") {
          payload[fieldName] = value;
        }
      }
    });
  }
  // Process complex field mappings with transformations
  else if (typeof mapping === "object") {
    for (const [fieldName, transformer] of Object.entries(mapping)) {
      const element = testerElement.querySelector(`#${action}_${fieldName}`);
      if (element) {
        let value = element.value.trim();

        // Handle special boolean cases
        if (
          element.tagName === "SELECT" &&
          (value === "true" || value === "false")
        ) {
          value = value === "true";
        }

        if (value !== "") {
          // Apply transformer function if provided
          payload[fieldName] = transformer ? transformer(value) : value;
        }
      }
    }
  }

  return payload;
}

/**
 * Sends an RPC request to the specified node
 */
async function sendRpcRequest(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Get the response text regardless of status
    const responseText = await response.text();

    // Try to parse as JSON, catching any parsing errors
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // If it's not valid JSON, throw with the text response
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    // Handle HTTP error with proper error message
    if (!response.ok) {
      if (data && data.error) {
        throw new Error(`Error: ${data.error}`);
      } else {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}\n\nResponse: ${responseText}`
        );
      }
    }

    // Handle RPC error
    if (data && data.error) {
      throw new Error(`Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error("RPC request failed:", error);
    throw error;
  }
}
