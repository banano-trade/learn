---
layout: post
title: Banano Burn Address Designer
date: 2025-05-04
category: tools
---

<div class="tool-container">
  <h2>Banano Vanity Burn Address Generator</h2>
  <p>Create stylish Banano burn addresses that look legitimate but don't have usable private keys - any funds sent to these addresses will be permanently removed from circulation!</p>
  
  <div class="warning">⚠️ WARNING: Any funds sent to addresses generated with this tool will be PERMANENTLY LOST! This tool is for educational purposes only.</div>
  
  <form id="burnAddressGenerator">
    <div id="errorboxred"></div>
    
    <label for="fieldleadingnumber" style="font-weight:bold;">Leading number:</label>
    <div class="input-with-addon">
      ban_<input type="text" id="fieldleadingnumber" oninput="convertToBurnAddress();" autocomplete="off" class="form2" value="1" maxlength="1"/>
      <span class="input-addon-text">(must be 1 or 3)</span>
    </div>
    <br/>
    
    <label for="fieldpadding" style="font-weight:bold;">Fill character / padding:</label>
    <input type="text" id="fieldpadding" oninput="convertToBurnAddress();" autocomplete="off" class="form2" value="1" maxlength="1"/>
    <br/>
    
    <label for="fieldvanityinput" style="font-weight:bold;">Your vanity string:</label>
    <input type="text" id="fieldvanityinput" oninput="convertToBurnAddress();" autocomplete="off" class="form52" value="" maxlength="51"/>
    <br/>
    
    <label for="fieldvanityresult" style="font-weight:bold;">Resulting burn address:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldvanityresult" readonly class="form64"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldvanityresult')">Copy</button>
    </div>
    <br/>
    
    <a class="buttona buttonred" href="#" role="button" onclick="clearFields(); return false;">Reset all fields</a>
  </form>

  <h3>About Burn Addresses</h3>
  <p>Burn addresses don't have corresponding private keys that can be feasibly derived, or they're created with private keys that have been intentionally discarded. When you send coins to a burn address, they become permanently inaccessible to anyone.</p>
  
  <p>This tool creates burn addresses by generating addresses with:</p>
  <ol>
    <li>Your custom text (converted to valid address characters)</li>
    <li>A proper checksum that makes the address pass validation checks</li>
    <li>The standard Banano address format (ban_...)</li>
  </ol>
  
  <p>Common uses for burn addresses include:</p>
  <ul>
    <li>Removing coins from circulation (reducing supply)</li>
    <li>Creating symbolic "proof of burn" demonstrations</li>
    <li>Sending negligible amounts as a form of public message</li>
  </ul>
  
  <div class="warning">This is a joke tool. Please be extremely careful - coins sent to these addresses cannot be recovered!</div>
</div>

<script type="text/javascript">
// Function to generate a custom burn address
function convertToBurnAddress() {
  var vanity_part = document.getElementById('fieldvanityinput').value.toLowerCase();
  var start = document.getElementById('fieldleadingnumber').value; 
  var padding = document.getElementById('fieldpadding').value; 
  
  if(start == '') {start = '1'}
  if(padding == '') {padding = '1'}
  
  // Replace invalid characters with similar looking valid ones
  vanity_part = vanity_part.replace(/0/g, "o"); 
  vanity_part = vanity_part.replace(/2/g, "z"); 
  vanity_part = vanity_part.replace(/l/g, "1"); 
  vanity_part = vanity_part.replace(/v/g, "u");  
  vanity_part = vanity_part.replace(/à/g, "a");  
  vanity_part = vanity_part.replace(/á/g, "a");  
  vanity_part = vanity_part.replace(/ä/g, "ae");  
  vanity_part = vanity_part.replace(/â/g, "a");  
  vanity_part = vanity_part.replace(/č/g, "c");  
  vanity_part = vanity_part.replace(/ç/g, "c");  
  vanity_part = vanity_part.replace(/é/g, "e");  
  vanity_part = vanity_part.replace(/ě/g, "e");  
  vanity_part = vanity_part.replace(/ê/g, "e");  
  vanity_part = vanity_part.replace(/è/g, "e");  
  vanity_part = vanity_part.replace(/ë/g, "e");  
  vanity_part = vanity_part.replace(/î/g, "i");  
  vanity_part = vanity_part.replace(/ï/g, "i");  
  vanity_part = vanity_part.replace(/í/g, "i");  
  vanity_part = vanity_part.replace(/ô/g, "o");  
  vanity_part = vanity_part.replace(/ö/g, "oe");  
  vanity_part = vanity_part.replace(/ó/g, "o");  
  vanity_part = vanity_part.replace(/ß/g, "ss");  
  vanity_part = vanity_part.replace(/ù/g, "u");  
  vanity_part = vanity_part.replace(/û/g, "u");  
  vanity_part = vanity_part.replace(/ú/g, "u");  
  vanity_part = vanity_part.replace(/ü/g, "ue");  
  vanity_part = vanity_part.replace(/ů/g, "u");  
  vanity_part = vanity_part.replace(/š/g, "s");  
  vanity_part = vanity_part.replace(/ž/g, "z");  
  
  // Limit the length to 51 (max allowed minus 1 for leading number)
  if (vanity_part.length > 51) {
    vanity_part = vanity_part.substring(0, 51);
  }
  
  // Ensure leading number is either 1 or 3
  start = start.replace(/[^13]/g, '1');
  
  // Ensure padding character is valid
  padding = padding.replace(/[^13456789abcdefghijkmnopqrstuwxyz]/g, '1');
  
  // Replace any remaining invalid characters with the padding
  vanity_part = vanity_part.replace(/[^13456789abcdefghijkmnopqrstuwxyz]/g, padding);
  
  // Construct the main part of the address
  let main = start + vanity_part;
  
  // Add padding to reach the required length (52 chars)
  for (let i = main.length; i < 52; i++) {
    main += padding;
  }
  
  try {
    // Convert to public key bytes
    const pubKeyBytes = window.banani.base32_to_uint8array(main);
    
    // Calculate the checksum using blake2b
    const checksumBytes = window.banani.hash_block(pubKeyBytes, null, 5).reverse();
    
    // Encode the checksum
    const checksum = window.banani.uint8array_to_base32(checksumBytes);
    
    // Assemble the final address with ban_ prefix
    const final = 'ban_' + main + checksum;
    
    document.getElementById('fieldvanityresult').value = final;
  } catch (error) {
    // Handle any errors
    console.error("Error generating burn address:", error);
    document.getElementById('fieldvanityresult').value = "Error generating address";
  }
}

// Function to copy to clipboard
function copyToClipboard(elementId) {
  var copyText = document.getElementById(elementId);
  copyText.select();
  document.execCommand("copy");
}

// Function to clear all fields
function clearFields() {
  document.getElementById('fieldleadingnumber').value = '1';
  document.getElementById('fieldpadding').value = '1';
  document.getElementById('fieldvanityinput').value = '';
  document.getElementById('fieldvanityresult').value = '';
}

// Initialize with default values
window.onload = function() {
  // Set default values
  document.getElementById('fieldleadingnumber').value = '1';
  document.getElementById('fieldpadding').value = '1';
  
  // Generate initial burn address with empty vanity part
  convertToBurnAddress();
};
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

.form2 {
  width: 40px;
  font-family: monospace;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
}

.form52 {
  width: 100%;
  font-family: monospace;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
}

.input-with-addon {
  display: flex;
  align-items: center;
}

.input-addon-text {
  padding-left: 10px;
  color: #888;
}
</style>