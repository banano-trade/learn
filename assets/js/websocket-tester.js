/**
 * Banano WebSocket Tester - Interactive script for testing WebSocket connections
 * For Learn Banano - https://learn.banano.trade
 */

document.addEventListener("DOMContentLoaded", function () {
    // DOM elements
    const wsUrlSelector = document.getElementById("websocket-url");
    const customWsContainer = document.getElementById("custom-ws-container");
    const customWsInput = document.getElementById("custom-ws-url");
    const customWsSave = document.getElementById("custom-ws-save");
    const wsStatusText = document.getElementById("ws-status-text");
    const wsConnectBtn = document.getElementById("ws-connect");
    const wsDisconnectBtn = document.getElementById("ws-disconnect");
    const wsSendMessageBtn = document.getElementById("ws-send-message");
    const wsClearLogBtn = document.getElementById("ws-clear-log");
    const wsLogArea = document.getElementById("ws-log");
    const wsMessageTypeSelect = document.getElementById("ws-message-type");
    const wsSubscribeOptions = document.getElementById("ws-subscribe-options");
    const wsUpdateOptions = document.getElementById("ws-update-options");
    const wsCustomMessage = document.getElementById("ws-custom-message");
    const wsTopicSelect = document.getElementById("ws-topic");
    const wsConfirmationOptions = document.getElementById("ws-confirmation-options");
    const wsVoteOptions = document.getElementById("ws-vote-options");
  
    // WebSocket connection
    let wsConnection = null;
  
    // Handle custom WebSocket URL
    if (wsUrlSelector) {
      wsUrlSelector.addEventListener("change", function () {
        if (this.value === "custom") {
          customWsContainer.style.display = "block";
        } else {
          customWsContainer.style.display = "none";
        }
      });
    }
  
    if (customWsSave) {
      customWsSave.addEventListener("click", function () {
        if (customWsInput.value.trim()) {
          // Add a new option with the custom URL
          const option = document.createElement("option");
          option.value = customWsInput.value.trim();
          option.textContent = "Custom: " + customWsInput.value.trim();
          option.selected = true;
  
          // Insert before the "Custom URL..." option
          const customOption = wsUrlSelector.querySelector('option[value="custom"]');
          wsUrlSelector.insertBefore(option, customOption);
  
          customWsContainer.style.display = "none";
        }
      });
    }
  
    // Toggle message type options
    if (wsMessageTypeSelect) {
      wsMessageTypeSelect.addEventListener("change", function () {
        const selectedType = this.value;
        
        // Hide all option containers
        wsSubscribeOptions.style.display = "none";
        wsUpdateOptions.style.display = "none";
        wsCustomMessage.style.display = "none";
        
        // Show the selected option container
        if (selectedType === "subscribe" || selectedType === "unsubscribe") {
          wsSubscribeOptions.style.display = "block";
        } else if (selectedType === "update") {
          wsUpdateOptions.style.display = "block";
        } else if (selectedType === "custom") {
          wsCustomMessage.style.display = "block";
        }
      });
    }
  
    // Toggle topic options
    if (wsTopicSelect) {
      wsTopicSelect.addEventListener("change", function () {
        const selectedTopic = this.value;
        
        // Hide all topic option containers
        wsConfirmationOptions.style.display = "none";
        wsVoteOptions.style.display = "none";
        
        // Show the selected topic option container
        if (selectedTopic === "confirmation") {
          wsConfirmationOptions.style.display = "block";
        } else if (selectedTopic === "vote") {
          wsVoteOptions.style.display = "block";
        }
      });
    }
  
    // Connect to WebSocket
    if (wsConnectBtn) {
      wsConnectBtn.addEventListener("click", function () {
        let wsUrl = wsUrlSelector.value;
        if (wsUrl === "custom") {
          wsUrl = customWsInput.value.trim();
          if (!wsUrl) {
            logMessage("Please enter a custom WebSocket URL", "error");
            return;
          }
        }
        
        connectWebSocket(wsUrl);
      });
    }
  
    // Disconnect from WebSocket
    if (wsDisconnectBtn) {
      wsDisconnectBtn.addEventListener("click", function () {
        disconnectWebSocket();
      });
    }
  
    // Send WebSocket message
    if (wsSendMessageBtn) {
      wsSendMessageBtn.addEventListener("click", function () {
        if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
          logMessage("WebSocket is not connected", "error");
          return;
        }
        
        const message = buildWebSocketMessage();
        if (message) {
          wsConnection.send(JSON.stringify(message));
          logMessage("Sent: " + JSON.stringify(message, null, 2), "outgoing");
        }
      });
    }
  
    // Clear log
    if (wsClearLogBtn) {
      wsClearLogBtn.addEventListener("click", function () {
        wsLogArea.innerHTML = "";
      });
    }
  
    // Connect to WebSocket server
    function connectWebSocket(url) {
      try {
        wsConnection = new WebSocket(url);
        
        wsConnection.onopen = function () {
          wsStatusText.textContent = "Connected";
          wsStatusText.style.color = "#4CBF4B";
          wsConnectBtn.style.display = "none";
          wsDisconnectBtn.style.display = "inline-block";
          wsSendMessageBtn.disabled = false;
          logMessage("Connected to: " + url, "connection");
        };
        
        wsConnection.onclose = function () {
          wsStatusText.textContent = "Disconnected";
          wsStatusText.style.color = "#ff5555";
          wsConnectBtn.style.display = "inline-block";
          wsDisconnectBtn.style.display = "none";
          wsSendMessageBtn.disabled = true;
          logMessage("Disconnected from: " + url, "connection");
          wsConnection = null;
        };
        
        wsConnection.onerror = function (error) {
          logMessage("WebSocket Error: " + error.message, "error");
        };
        
        wsConnection.onmessage = function (event) {
          let data;
          try {
            data = JSON.parse(event.data);
            logMessage("Received: " + JSON.stringify(data, null, 2), "incoming");
          } catch (e) {
            logMessage("Received (non-JSON): " + event.data, "incoming");
          }
        };
      } catch (error) {
        logMessage("Failed to connect: " + error.message, "error");
      }
    }
  
    // Disconnect from WebSocket server
    function disconnectWebSocket() {
      if (wsConnection) {
        wsConnection.close();
      }
    }
  
    // Build WebSocket message based on selected options
    function buildWebSocketMessage() {
      const messageType = wsMessageTypeSelect.value;
      
      // Simple ping message
      if (messageType === "ping") {
        return { action: "ping" };
      }
      
      // Custom message
      if (messageType === "custom") {
        const customJsonInput = document.getElementById("ws-custom-json");
        try {
          return JSON.parse(customJsonInput.value);
        } catch (e) {
          logMessage("Invalid JSON: " + e.message, "error");
          return null;
        }
      }
      
      // Subscribe or unsubscribe message
      if (messageType === "subscribe" || messageType === "unsubscribe") {
        const topic = wsTopicSelect.value;
        const message = {
          action: messageType,
          topic: topic
        };
        
        // Add options for specific topics
        if (topic === "confirmation" && messageType === "subscribe") {
          const confirmationType = document.getElementById("ws-confirmation-type").value;
          const includeBlock = document.getElementById("ws-include-block").value === "true";
          const includeElectionInfo = document.getElementById("ws-include-election-info").value === "true";
          const includeSidebandInfo = document.getElementById("ws-include-sideband-info").value === "true";
          const accounts = document.getElementById("ws-accounts").value.trim();
          const allLocalAccounts = document.getElementById("ws-all-local-accounts").value === "true";
          
          const options = {};
          
          if (confirmationType !== "all") {
            options.confirmation_type = confirmationType;
          }
          
          options.include_block = includeBlock;
          
          if (includeElectionInfo) {
            options.include_election_info = includeElectionInfo;
          }
          
          if (includeSidebandInfo) {
            options.include_sideband_info = includeSidebandInfo;
          }
          
          if (accounts) {
            options.accounts = accounts.split(",").map(acc => acc.trim());
          }
          
          if (allLocalAccounts) {
            options.all_local_accounts = allLocalAccounts;
          }
          
          // Only add options if there are any
          if (Object.keys(options).length > 0) {
            message.options = options;
          }
        } else if (topic === "vote" && messageType === "subscribe") {
          const representatives = document.getElementById("ws-representatives").value.trim();
          const includeReplays = document.getElementById("ws-include-replays").value === "true";
          const includeIndeterminate = document.getElementById("ws-include-indeterminate").value === "true";
          
          const options = {};
          
          if (representatives) {
            options.representatives = representatives.split(",").map(rep => rep.trim());
          }
          
          if (includeReplays) {
            options.include_replays = includeReplays;
          }
          
          if (includeIndeterminate) {
            options.include_indeterminate = includeIndeterminate;
          }
          
          // Only add options if there are any
          if (Object.keys(options).length > 0) {
            message.options = options;
          }
        }
        
        return message;
      }
      
      // Update message
      if (messageType === "update") {
        const topic = document.getElementById("ws-update-topic").value;
        const accountsAdd = document.getElementById("ws-accounts-add").value.trim();
        const accountsDel = document.getElementById("ws-accounts-del").value.trim();
        
        const message = {
          action: "update",
          topic: topic
        };
        
        const options = {};
        
        if (accountsAdd) {
          options.accounts_add = accountsAdd.split(",").map(acc => acc.trim());
        }
        
        if (accountsDel) {
          options.accounts_del = accountsDel.split(",").map(acc => acc.trim());
        }
        
        // Only add options if there are any
        if (Object.keys(options).length > 0) {
          message.options = options;
        }
        
        return message;
      }
      
      return null;
    }
  
    // Log message to the console
    function logMessage(message, type) {
      const messageElement = document.createElement("div");
      messageElement.className = "ws-message ws-" + type;
      
      const timestamp = new Date().toLocaleTimeString();
      messageElement.innerHTML = `<span class="ws-timestamp">[${timestamp}]</span> ${message}`;
      
      wsLogArea.appendChild(messageElement);
      wsLogArea.scrollTop = wsLogArea.scrollHeight;
    }
  
    // Initialize the UI
    if (wsMessageTypeSelect) {
      wsMessageTypeSelect.dispatchEvent(new Event("change"));
    }
    
    if (wsTopicSelect) {
      wsTopicSelect.dispatchEvent(new Event("change"));
    }
  });