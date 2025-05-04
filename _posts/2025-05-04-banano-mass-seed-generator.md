---
layout: post
title: Banano Mass Seed Generator
date: 2025-05-04
category: tools
---

<div class="tool-container">
  <h2>Generate Multiple Banano Seeds at Once</h2>
  <p>This tool generates multiple random Banano seeds and their corresponding addresses (all at index 0) and outputs them in CSV format.</p>
  
  <div class="warning">⚠️ WARNING: Using websites to generate seeds can be potentially unsafe. For maximum security, consider downloading the page and running it on an air-gapped computer, especially when handling significant amounts.</div>
  
  <form id="massgen">  
    <div id="errorboxred" class="error-message"></div>
    <div id="errorboxyellow" class="warning-message"></div>
    
    <label for="fieldprefix" style="font-weight:bold;">Address prefix:</label>
    <input type="text" id="fieldprefix" autocomplete="off" class="form8" value="ban_"/> <br/> 
    
    <label for="fieldamount" style="font-weight:bold;">Number of seed/address pairs to generate:</label>
    <input type="text" id="fieldamount" autocomplete="off" class="form8" value="10"/> <br/> 
    
    <div class="button-row">
      <a class="buttona buttongreen" id="startbutton" href="#" role="button" onclick="preparegeneration(); return false;">Generate</a>  
      <a class="buttona buttonred" href="#" role="button" onclick="document.getElementById('massgen').reset(); return false;">Reset all fields</a>
    </div>
    
    <label for="fieldresult" style="font-weight:bold;">Generated CSV:</label> <br/>
    <div class="input-with-copy">
      <textarea id="fieldresult" class="form64" style="height:18em; font-size: 10px;"></textarea>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldresult')">Copy</button>
    </div>
    
    <a class="buttona buttonblue" id="downloadbutton" href="#" role="button" onclick="downloadCSV(); return false;" style="display: none;">Download CSV file</a>
  </form>
  
  <h3>About This Tool</h3>
  <p>Each generated seed is a random 64-character hexadecimal string that can be used as the master key for a Banano wallet. The corresponding address is derived from the seed at index 0 using the Banano algorithm.</p>
  
  <p>The output is formatted as CSV with pairs of <code>seed,address</code> on each line, making it easy to import into spreadsheets or other applications.</p>
</div>

<script type="text/javascript">
// Prepare the generation process
function preparegeneration() {
  // Reset UI
  document.getElementById('errorboxred').style.display = 'none';
  document.getElementById('errorboxyellow').style.display = 'none'; 
  document.getElementById("startbutton").innerHTML = 'generating...'; 
  document.getElementById("startbutton").classList.remove("buttongreen");
  document.getElementById("startbutton").classList.add("buttonred");
  document.getElementById("fieldresult").value = '';
  document.getElementById("downloadbutton").style.display = 'none';
  
  // Delay to allow UI to update before starting generation
  window.setTimeout(generate, 80);
}

// Main generation function
function generate() {
  // Get the requested number of seeds to generate
  var amount = parseInt(document.getElementById("fieldamount").value.trim());
  var prefix = document.getElementById("fieldprefix").value.trim();
  
  // Validate input
  if (isNaN(amount) || amount <= 0 || amount > 1000) {
    document.getElementById('errorboxred').innerHTML = "Please enter a valid number between 1 and 1000";
    document.getElementById('errorboxred').style.display = 'block';
    initializebuttons();
    return;
  }
  
  // Validate prefix
  if (prefix !== "ban_") {
    document.getElementById('errorboxyellow').innerHTML = "Warning: Using a non-standard prefix. Standard Banano addresses start with 'ban_'";
    document.getElementById('errorboxyellow').style.display = 'block';
  }
  
  // Generate the requested number of seeds and addresses
  var result = "";
  for (var i = 0; i < amount; i++) {
    try {
      // Generate a random seed
      var array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      var seed = window.banani.uint8array_to_hex(array);
      
      // Derive private key, public key, and address
      var privateKey = window.banani.get_private_key_from_seed(seed, 0);
      var publicKey = window.banani.get_public_key_from_private_key(privateKey);
      var address = window.banani.get_address_from_public_key(publicKey);
      
      // Add to result, replacing the prefix if needed
      if (prefix !== "ban_") {
        address = prefix + address.substring(4);
      }
      
      result += seed + "," + address + "\n";
    } catch (error) {
      console.error("Error generating seed/address pair:", error);
    }
  }
  
  // Display the result
  document.getElementById("fieldresult").value = result;
  document.getElementById("downloadbutton").style.display = 'inline-block';
  
  // Reset UI
  initializebuttons();
}

// Reset button state after generation
function initializebuttons() {
  document.getElementById("startbutton").innerHTML = 'Generate'; 
  document.getElementById("startbutton").classList.add("buttongreen");
  document.getElementById("startbutton").classList.remove("buttonred"); 
}

// Copy to clipboard functionality
function copyToClipboard(elementId) {
  var copyText = document.getElementById(elementId);
  copyText.select();
  document.execCommand("copy");
}

// Download CSV file
function downloadCSV() {
  var text = document.getElementById("fieldresult").value;
  var filename = document.getElementById("fieldamount").value + '_banano_seeds_' + formatDate(new Date());
  
  // Create a temporary link element to trigger the download
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename + '.csv');
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
}
</script>

<style>
.warning {
  background-color: #ffebee;
  border-left: 5px solid #f44336;
  color: #c62828;
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  font-weight: bold;
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

.button-row {
  margin: 15px 0;
}

.input-with-copy {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.input-with-copy textarea {
  flex-grow: 1;
}
</style>