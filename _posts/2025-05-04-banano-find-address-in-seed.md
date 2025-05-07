---
layout: post
title: Banano Find Address in Seed
date: 2025-05-04
category: tools
---

<div class="tool-container">
  <h2>Find Banano Address in Seed</h2>
  <p>This tool helps you find which seed (and at which index) a specific Banano address was generated from. Your CPU can process ~<span id="benchmark">?</span> indices per second, so be patient for large searches.</p>
  <div class="warning">⚠️ Warning: Entering your seed online is a security risk. For maximum security, consider using the offline version of this tool on an air-gapped computer when handling large sums.</div>
  
  <form id="seedSearch">
    <div id="errorboxred" class="error-message"></div>
    <div id="errorboxyellow" class="warning-message"></div>
    
    <label for="fieldseeds" style="font-weight:bold;">Paste one or more seeds to search through:</label> <br/>
    <textarea id="fieldseeds" class="form-textarea"></textarea> <br/>
    
    <label for="fieldaccount" style="font-weight:bold;">Banano address to find:</label> <br/>
    <input type="text" id="fieldaccount" class="form-input" autocomplete="off" value=""/> <br/>
    
    <label for="fieldstartindex" style="font-weight:bold;">Start index:</label>
    <input type="text" id="fieldstartindex" class="form-small-input" autocomplete="off" value="0"/> <br/>
    
    <label for="fieldendindex" style="font-weight:bold;">End index:</label>
    <input type="text" id="fieldendindex" class="form-small-input" autocomplete="off" value="100"/> <br/>
    
    <div class="button-row">
      <a class="buttona buttongreen" id="startbutton" href="#" role="button" onclick="preparesearch(); return false;">Run search</a>
      <a class="buttona buttongreen" href="#" role="button" onclick="sampledata(); return false;">Enter sample data</a>
      <a class="buttona buttonred" href="#" role="button" onclick="document.getElementById('seedSearch').reset(); return false;">Clear all fields</a>
    </div>
  </form>
  
  <div id="messageboxgreen" class="success-message" style="display:none;">
    <p>Found account address: <span id="resultaddress"></span><br/>
    In seed: <span id="resultseed"></span><br/>
    Index: <span id="resultindex"></span><br/>
    Private key: <span id="resultprivatekey"></span></p>
  </div>
  
  <h3>How it works</h3>
  <p>This tool searches through the seeds you provide to find which one was used to generate a specific Banano address. It does this by:</p>
  <ol>
    <li>Taking each seed and generating addresses at each index in the specified range</li>
    <li>Comparing each generated address with the address you're looking for</li>
    <li>When a match is found, it displays the seed, index, and corresponding private key</li>
  </ol>
  <p>Most wallets start at index 0 and increment for each new account generated, but some may use different patterns.</p>
</div>

<script type="text/javascript">
// Prefill form fields with sample data
function sampledata() {
  document.getElementById("fieldseeds").value = "AC723DD846B7A841FAB2690ECA331B8431EB51AECE8AFD5CD4E7D11B8286092A\nSample_seed_2:0DE606FF894FF0A7C21E43FDB7E09147DEF2554AB8E9B217AED918AEFF319EB1\nAnother one:6CCABE075043D1EAF07879B35F9E98D10D8FF6454944C1B6232C817678E0D230";
  document.getElementById("fieldstartindex").value = '0';
  document.getElementById("fieldendindex").value = '130';
  document.getElementById("fieldaccount").value = 'ban_3sz39g7ruf3ww6m67bnc479kgicd768emxbayif91c3yyp8pxhp5qdzmwefh';
}

// Prepare the search process
function preparesearch() {
  // Reset UI
  document.getElementById("messageboxgreen").style.display = "none";
  document.getElementById('errorboxred').style.display = 'none';
  document.getElementById('errorboxyellow').style.display = 'none';
  
  // Update button state
  document.getElementById("startbutton").innerHTML = 'searching...';
  document.getElementById("startbutton").classList.remove("buttongreen");
  document.getElementById("startbutton").classList.add("buttonred");
  
  // Clear result fields
  document.getElementById("resultseed").innerHTML = '';
  document.getElementById("resultaddress").innerHTML = '';
  document.getElementById("resultindex").innerHTML = '';
  document.getElementById("resultprivatekey").innerHTML = '';
  
  // Delay to allow UI to update before starting search
  window.setTimeout(searchaddress, 80);
}

// Main search function
function searchaddress() {
  // Get input values
  var fieldseeds = document.getElementById("fieldseeds").value;
  var startindex = parseInt(document.getElementById("fieldstartindex").value.trim());
  var endindex = parseInt(document.getElementById("fieldendindex").value.trim());
  var account = document.getElementById("fieldaccount").value.trim();
  
  // Input validation
  if (!account.startsWith('ban_') || account.length !== 64) {
    document.getElementById('errorboxred').innerHTML = "Input error: Address field invalid! Must be a valid Banano address.";
    document.getElementById('errorboxred').style.display = 'block';
    initializebuttons();
    return;
  } else if (!Number.isInteger(startindex) || !Number.isInteger(endindex)) {
    document.getElementById('errorboxred').innerHTML = "Input error: Index range invalid! Should be integers between 0 and 4294967295.";
    document.getElementById('errorboxred').style.display = 'block';
    initializebuttons();
    return;
  }
  
  // Use regex to extract seeds from input
  var regex = /[0-9A-F]{64}/gi;
  var foundseeds = fieldseeds.match(regex);
  
  if (foundseeds === null) {
    document.getElementById('errorboxred').innerHTML = "No valid seeds found in input! Search halted!";
    document.getElementById('errorboxred').style.display = 'block';
    initializebuttons();
    return;
  }
  
  // Loop through each seed
  var match = false;
  var arrayLength = foundseeds.length;
  
  for (var i = 0; i < arrayLength && match === false; i++) {
    var currentSeed = foundseeds[i];
    
    // Search through each index in the range
    for (var j = startindex; j <= endindex && match === false; j++) {
      try {
        // Use the banani.js library to derive address from seed and index
        var privateKey = window.banani.get_private_key_from_seed(currentSeed, j);
        var publicKey = window.banani.get_public_key_from_private_key(privateKey);
        var generatedAddress = window.banani.get_address_from_public_key(publicKey);
        
        // Check if addresses match
        if (generatedAddress === account) {
          match = true;
          document.getElementById("resultseed").innerHTML = currentSeed;
          document.getElementById("resultaddress").innerHTML = generatedAddress;
          document.getElementById("resultindex").innerHTML = j;
          document.getElementById("resultprivatekey").innerHTML = privateKey;
          document.getElementById("messageboxgreen").style.display = "block";
          initializebuttons();
          break;
        }
      } catch (error) {
        console.error("Error processing seed at index " + j + ": " + error);
      }
    }
  }
  
  // If no match was found
  if (match === false) {
    document.getElementById('errorboxyellow').innerHTML = "Nothing found! Try a different address, seed, or index range!";
    document.getElementById('errorboxyellow').style.display = 'block';
    initializebuttons();
  }
}

// Reset button state after search completes
function initializebuttons() {
  document.getElementById("startbutton").innerHTML = 'Run search'; 
  document.getElementById("startbutton").classList.add("buttongreen");
  document.getElementById("startbutton").classList.remove("buttonred");
}

// Benchmark function to estimate performance
window.onload = function() {
  var start = new Date();
  var testSeed = "0000000000000000000000000000000000000000000000000000000000000000";
  
  // Run a test derivation to estimate performance
  var privateKey = window.banani.get_private_key_from_seed(testSeed, 0);
  var publicKey = window.banani.get_public_key_from_private_key(privateKey);
  window.banani.get_address_from_public_key(publicKey);
  
  var end = new Date();
  var time = end.getTime() - start.getTime();
  
  // Calculate indexes per second, adjusting for browser overhead
  document.getElementById("benchmark").innerHTML = ((1000 / time) * 3).toFixed(0);
};
</script>

<style>
.tool-container {
  background-color: #2A2A2E;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  font-family: monospace;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-input {
  width: 100%;
  margin-bottom: 10px;
  font-family: monospace;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-small-input {
  width: 150px;
  margin-bottom: 10px;
  font-family: monospace;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.button-row {
  margin: 15px 0;
}

.buttona {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.buttongreen {
  background-color: #4CAF50;
  color: white;
}

.buttonred {
  background-color: #f44336;
  color: white;
}

.error-message {
  background-color: #ffebee;
  border-left: 5px solid #f44336;
  color: #c62828;
  padding: 10px;
  margin: 10px 0;
  display: none;
}

.warning-message {
  background-color: #fff8e1;
  border-left: 5px solid #ffc107;
  color: #ff8f00;
  padding: 10px;
  margin: 10px 0;
  display: none;
}

.success-message {
  background-color: #e8f5e9;
  border-left: 5px solid #4caf50;
  color: #2e7d32;
  padding: 10px;
  margin: 10px 0;
}

.warning {
  background-color: #fff8e1;
  border-left: 5px solid #ffc107;
  color: #ff8f00;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}
</style>