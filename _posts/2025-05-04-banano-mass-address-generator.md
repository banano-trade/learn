---
layout: post
title: Banano Mass Address Generator
date: 2025-05-04
category: tools
---

<div class="tool-container">
  <h2>Generate Multiple Addresses from One Seed</h2>
  <p>This tool generates multiple Banano addresses from a single seed by iterating through a range of indices.</p>
  
  <div class="warning">⚠️ WARNING: Entering your seed on websites is a security risk, even with trusted sites. For maximum security, consider using this tool offline on an air-gapped computer when handling significant amounts.</div>
  
  <form id="addressGenerator">  
    <div id="errorboxred" class="error-message"></div>
    <div id="errorboxyellow" class="warning-message"></div>
    
    <label for="fieldseed" style="font-weight:bold;">Seed:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldseed" autocomplete="off" class="form64"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldseed')">Copy</button>
    </div>
     
    <label for="fieldprefix" style="font-weight:bold;">Address prefix:</label>
    <input type="text" id="fieldprefix" autocomplete="off" class="form8" value="ban_"/>  <br/>
    
    <label for="fieldstartindex" style="font-weight:bold;">Start index:</label>
    <input type="text" id="fieldstartindex" autocomplete="off" class="form8" value="0"/>  <br/>
    
    <label for="fieldendindex" style="font-weight:bold;">End index:</label>
    <input type="text" id="fieldendindex" autocomplete="off" class="form8" value="15"/> <br/> 
      
    <label for="prependindex" style="font-weight:bold;">Prepend index to result:</label>
    <input type="text" id="prependindex" autocomplete="off" class="form8" value="0"/> (1 or Y to enable)<br/> 
    
    <div class="button-row">
      <a class="buttona buttongreen" id="startbutton" href="#" role="button" onclick="preparesearch(); return false;">Generate</a> 
      <a class="buttona" href="#" role="button" onclick="sampledata(); return false;">Enter random sample data</a>
      <a class="buttona buttonred" href="#" role="button" onclick="document.getElementById('addressGenerator').reset(); return false;">Reset all fields</a>
    </div>
    
    <label for="fieldresult" style="font-weight:bold;">Generated addresses:</label>
    <div class="input-with-copy">
      <textarea id="fieldresult" class="form64" style="height:18em;"></textarea>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldresult')">Copy</button>
    </div>
    
    <a class="buttona buttonblue" id="downloadbutton" href="#" role="button" onclick="downloadAddresses(); return false;" style="display: none;">Download as CSV</a>
  </form>
  
  <h3>About This Tool</h3>
  <p>This tool derives multiple Banano addresses from a single seed by using different index values. Each seed can generate up to 4,294,967,296 (2^32) unique addresses by using index values from 0 to 4,294,967,295.</p>
  
  <p>When you create accounts in most wallets, they increment the index for each new address (starting at 0). This tool lets you:</p>
  <ul>
    <li>Generate a list of addresses associated with your seed at specific indices</li>
    <li>Recover addresses that may have received funds</li>
    <li>Create a CSV list for accounting or backup purposes</li>
  </ul>
  
  <p><strong>Note:</strong> While a seed can technically generate billions of addresses, most users only ever use a small number of them. The most commonly used indices are 0-20.</p>
</div>

<script type="text/javascript">
// Prefill form fields with sample data
function sampledata() {
  var array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  var seedhex = window.banani.uint8array_to_hex(array);
  
  document.getElementById("fieldseed").value = seedhex; 
  document.getElementById("fieldprefix").value = 'ban_';
  document.getElementById("fieldstartindex").value = '0';
  document.getElementById("fieldendindex").value = '11';
  document.getElementById("prependindex").value = '1';
  
  preparesearch(); 
}

// Prepare the address generation process
function preparesearch() {
  // Reset UI
  document.getElementById('errorboxred').style.display = 'none';
  document.getElementById('errorboxyellow').style.display = 'none';
  document.getElementById("startbutton").innerHTML = 'generating...'; 
  document.getElementById("startbutton").classList.remove("buttongreen");
  document.getElementById("startbutton").classList.add("buttonred");
  document.getElementById("fieldresult").value = '';
  document.getElementById("downloadbutton").style.display = 'none';
  
  // Delay to allow UI to update before starting generation
  window.setTimeout(makeaddresses, 80);
}

// Main function to generate addresses
function makeaddresses() {
  // Get input values
  var seed = document.getElementById("fieldseed").value.trim();
  var startindex = parseInt(document.getElementById("fieldstartindex").value.trim());
  var endindex = parseInt(document.getElementById("fieldendindex").value.trim());
  var prefix = document.getElementById("fieldprefix").value.trim();
  
  // Validate input using regex to find valid seed
  var regex = /[A-F0-9]{64}/i;
  var foundseed = seed.match(regex);
  
  // Input validation
  if (seed.length != 64 || foundseed == null) {
    document.getElementById('errorboxred').innerHTML = "Input error: Seed field invalid! Must be a 64-character hexadecimal string.";
    document.getElementById('errorboxred').style.display = 'block'; 
    initializebuttons();
    return;
  } else if (!Number.isInteger(startindex) || !Number.isInteger(endindex)) {
    document.getElementById('errorboxred').innerHTML = "Input error: Index range invalid! Should be integers between 0 and 4294967295.";
    document.getElementById('errorboxred').style.display = 'block';
    initializebuttons();
    return;
  }
  
  // Non-standard prefix warning
  if (prefix !== "ban_") {
    document.getElementById('errorboxyellow').innerHTML = "Warning: Using a non-standard prefix. Standard Banano addresses start with 'ban_'";
    document.getElementById('errorboxyellow').style.display = 'block';
  }
  
  // Convert to uppercase for consistency
  seed = foundseed[0].toUpperCase();
  
  // Should we prepend the index number?
  var prependIndex = document.getElementById('prependindex').value == "1" || 
                     document.getElementById('prependindex').value.toLowerCase() == "y";
  
  // Generate addresses for each index in the range
  var result = "";
  try {
    for (var i = startindex; i <= endindex; i++) {
      // Use banani.js to derive the private key, public key, and address
      var privateKey = window.banani.get_private_key_from_seed(seed, i);
      var publicKey = window.banani.get_public_key_from_private_key(privateKey);
      var address = window.banani.get_address_from_public_key(publicKey);
      
      // Replace prefix if needed
      if (prefix !== "ban_") {
        address = prefix + address.substring(4);
      }
      
      // Format the output line
      if(prependIndex) {
        result += i + "," + address + "\n";
      } else {
        result += address + "\n";
      }
    }
    
    // Display the result
    document.getElementById("fieldresult").value = result;
    document.getElementById("downloadbutton").style.display = 'inline-block';
  } catch (error) {
    document.getElementById('errorboxred').innerHTML = "Error generating addresses: " + error.message;
    document.getElementById('errorboxred').style.display = 'block';
  }
  
  // Reset button state
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

// Download addresses as CSV
function downloadAddresses() {
  var text = document.getElementById("fieldresult").value;
  var filename = "banano_addresses_" + formatDate(new Date());
  
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

.form8 {
  width: 80px;
  font-family: monospace;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
}

.form64 {
  width: 100%;
  font-family: monospace;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
}

.button-row {
  margin: 15px 0;
}

.input-with-copy {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.input-with-copy textarea,
.input-with-copy input {
  flex-grow: 1;
}
</style>