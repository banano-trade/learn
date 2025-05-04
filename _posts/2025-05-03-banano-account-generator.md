---
layout: post
title: Banano Account Generator
date: 2025-05-03
category: tools
---
<div class="tool-container">
  <h2>Banano Account Generator</h2>
  <p>Generate Banano seeds, private keys, public keys, and addresses. This tool runs entirely in your browser - your keys are never sent over the internet.</p>
  <form id="keyconverter">
    <div id="errorboxred"></div>
    
    <label for="fieldseed" style="font-weight:bold;">Seed:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldseed" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldseed')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldindex" style="font-weight:bold;">Index:</label>
    <input type="number" min="0" max="4294967295" id="fieldindex" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form8" maxlength="10" value="0"/> (max 4,294,967,295)
    <br/>
    
    <label for="fieldprivatekey" style="font-weight:bold;">Account private key:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldprivatekey" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldprivatekey')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldpublickey" style="font-weight:bold;">Account public key:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldpublickey" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldpublickey')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldaddress" style="font-weight:bold;">Account address:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldaddress" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldaddress')">Copy</button>
    </div>
    <br/>
    
    <a class="buttona buttonred" href="#" role="button" onclick="clearAllFields(); return false;">Clear all fields</a>
    <br/>
    
    <a class="buttona buttonblue" href="#" role="button" onclick="randomseed(); return false;">Random seed</a>
    <a class="buttona buttonblue" href="#" role="button" onclick="randomprivatekey(); return false;">Random private key</a>
    <a class="buttona buttonblue" href="#" role="button" onclick="randompublickey(); return false;">Random public key</a>
  </form>
  <p>You can use URL parameters like <code>?type=address&value=ban_3sete494gu1cbyondbjk8dcxx7ccrp1j31gc7owrk449dyq89qj6hkrhn8yg</code> to prefill fields. Allowed field types are <code>seed</code>, <code>privatekey</code>, <code>publickey</code>, and <code>address</code>.</p>
  
  <p class="warning">Never share your seed or private key with anyone. Always keep these values secure.</p>
</div>

<script type="text/javascript">
// Copy to clipboard functionality
function copyToClipboard(elementId) {
  var copyText = document.getElementById(elementId);
  copyText.select();
  document.execCommand("copy");
}

function clearAllFields() {
  document.getElementById('fieldseed').value = '';
  document.getElementById('fieldindex').value = '0';
  document.getElementById('fieldprivatekey').value = '';
  document.getElementById('fieldpublickey').value = '';
  document.getElementById('fieldaddress').value = '';
  
  // Remove any error borders
  document.getElementById('fieldseed').classList.remove("inputerrorborder");
  document.getElementById('fieldprivatekey').classList.remove("inputerrorborder");
  document.getElementById('fieldpublickey').classList.remove("inputerrorborder");
  document.getElementById('fieldaddress').classList.remove("inputerrorborder");
}

// Generates a new random seed and proceed to convert 
function randomseed() {
  var array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  var seedhex = window.banani.uint8array_to_hex(array);
  document.getElementById("fieldseed").value = seedhex;
  sanitizeandconvert(seedhex, 'fieldseed');
}

// Generates a new random private key and proceed to convert 
function randomprivatekey() {
  var array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  var privatekeyhex = window.banani.uint8array_to_hex(array);
  document.getElementById("fieldprivatekey").value = privatekeyhex;
  sanitizeandconvert(privatekeyhex, 'fieldprivatekey');
}

// Generates a new random public key and proceed to convert 
function randompublickey() {
  var array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  var publickeyhex = window.banani.uint8array_to_hex(array);
  document.getElementById("fieldpublickey").value = publickeyhex;
  sanitizeandconvert(publickeyhex, 'fieldpublickey');
}

// This is where the conversion magic happens
function convert(string, field) {
  if (field == 'fieldseed' || field == 'fieldindex') {  
    if(document.getElementById("fieldseed").value.length == 64) { // will be skipped if only a index number has been entered
      var seed = document.getElementById("fieldseed").value;
      var index = document.getElementById("fieldindex").value;
      
      // Use banani.js to derive private key from seed and index
      var privateKey = window.banani.get_private_key_from_seed(seed, parseInt(index, 10));
      document.getElementById("fieldprivatekey").value = privateKey;
      field = 'fieldprivatekey';
    }
  } // end seed input conversion 
  
  if (field == 'fieldprivatekey') {
    var privatekey = document.getElementById("fieldprivatekey").value;
    
    // Use banani.js to get public key from private key
    var publickeyhex = window.banani.get_public_key_from_private_key(privatekey);
    document.getElementById("fieldpublickey").value = publickeyhex;
    
    // Use banani.js to get address from public key
    var account = window.banani.get_address_from_public_key(publickeyhex);
    document.getElementById("fieldaddress").value = account;
  }
  
  if (field == 'fieldpublickey') {
    document.getElementById("fieldprivatekey").value = '-';
    var publickeyhex = document.getElementById("fieldpublickey").value;
    try {
      // Use banani.js to get address from public key
      var account = window.banani.get_address_from_public_key(publickeyhex);
      document.getElementById("fieldaddress").value = account;
    } catch (err) {
      alert('Input error in public key field: ' + err);
    } 
  }
  
  if (field == 'fieldaddress') {
    document.getElementById("fieldprivatekey").value = '-';
    var address = document.getElementById("fieldaddress").value;
    try {
      // Use banani.js to get public key from address
      var publicKey = window.banani.get_public_key_from_address(address);
      document.getElementById("fieldpublickey").value = publicKey;
    } catch (err) {
      alert('Input error in address field: ' + err);
    }
  }
}

// Automatic remove of dash on focus
function removedash(fieldobject) {
  if(fieldobject.value == '-') {fieldobject.value='';}
}

// This function does input sanitation and change visuals for errors
function sanitizeandconvert(string, field) {
  if (field == 'fieldseed' || field == 'fieldprivatekey' || field == 'fieldpublickey') {
    document.getElementById(field).value = document.getElementById(field).value.replace(/[^0-9A-F\.]/gi, '').toUpperCase().substr(0,64);
  }
  
  if (field == 'fieldseed' && !(parseInt(document.getElementById("fieldindex").value, 10) >= 0)) {
    document.getElementById("fieldindex").value = 0;
  }
  
  if (field == 'fieldindex') {
    index = document.getElementById("fieldindex").value.replace(/[^0-9\.]/g, ''); // delete all non-digits and then leading zeros with parseint
    if (parseInt(index, 10) > 4294967295) {
      document.getElementById("fieldindex").value = 4294967295;
    } else if (parseInt(index, 10) == index) {
      document.getElementById("fieldindex").value = parseInt(index, 10); // parseint only if no chars entered to not wipe the whole field
    } else {
      document.getElementById("fieldindex").value = index;
    }
    if (document.getElementById("fieldseed").value.length != 64) {
      document.getElementById("fieldprivatekey").value = '-';
      document.getElementById("fieldpublickey").value = '-';
      document.getElementById("fieldaddress").value = '-';
    }
  }
  
  if (field != 'fieldseed' && field != 'fieldindex') {
    document.getElementById("fieldseed").value = '-';
    document.getElementById("fieldindex").value = '0';
  }
  
  // Don't do anything if the field was cleared
  if (document.getElementById(field).value == '') {
    return;
  }
  
  if (document.getElementById("fieldseed").value.length == 64 || document.getElementById("fieldseed").value == '-') {
    document.getElementById('fieldseed').classList.remove("inputerrorborder");
    document.getElementById('fieldprivatekey').classList.remove("inputerrorborder");
    document.getElementById('fieldpublickey').classList.remove("inputerrorborder");
  }
  
  if (field == 'fieldseed' && document.getElementById('fieldseed').value.length != 64) {
    document.getElementById('fieldseed').classList.add("inputerrorborder");
    document.getElementById("fieldprivatekey").value = '-';
    document.getElementById("fieldpublickey").value = '-';
    document.getElementById("fieldaddress").value = '-';
  } else if (field == 'fieldseed' && document.getElementById('fieldseed').value.length == 64) {
    document.getElementById('fieldseed').classList.remove("inputerrorborder");
  }
  
  if (field == 'fieldindex' && document.getElementById('fieldseed').value.length != 64) {
    document.getElementById('fieldseed').classList.add("inputerrorborder");
    document.getElementById("fieldprivatekey").value = '-';
    document.getElementById("fieldpublickey").value = '-';
    document.getElementById("fieldaddress").value = '-';
    return;
  } else if (field == 'fieldindex' && document.getElementById('fieldseed').value.length == 64) {
    document.getElementById('fieldseed').classList.remove("inputerrorborder");
  }
  
  if (field == 'fieldprivatekey' && document.getElementById('fieldprivatekey').value.length != 64) {
    document.getElementById('fieldprivatekey').classList.add("inputerrorborder");
    document.getElementById("fieldpublickey").value = '-';
    document.getElementById("fieldaddress").value = '-';
  } else {
    document.getElementById('fieldprivatekey').classList.remove("inputerrorborder");
  }
  
  if (field == 'fieldpublickey' && document.getElementById('fieldpublickey').value.length != 64) {
    document.getElementById('fieldpublickey').classList.add("inputerrorborder");
    document.getElementById("fieldprivatekey").value = '-';
    document.getElementById("fieldaddress").value = '-';
  } else {
    document.getElementById('fieldpublickey').classList.remove("inputerrorborder");
  }
  
  if (field == 'fieldaddress') {
    document.getElementById('fieldaddress').value = document.getElementById('fieldaddress').value.toLowerCase();
    var rawaccount = document.getElementById('fieldaddress').value;
    if (rawaccount.startsWith('ban_') && (rawaccount.length == 64)) { 
      document.getElementById('fieldaddress').classList.remove("inputerrorborder");
    } else {
      document.getElementById('fieldaddress').classList.add("inputerrorborder");
      document.getElementById("fieldseed").value = '-';
      document.getElementById("fieldprivatekey").value = '-';
      document.getElementById("fieldpublickey").value = '-';
      return;
    }
  }
  
  if (field != 'fieldindex' && field != 'fieldaddress' && document.getElementById(field).value.length != 64) {
    return;
  }
  
  document.getElementById(field).classList.remove("inputerrorborder");
  convert(document.getElementById(field).value, field);
}

// Process URL parameters on page load
window.onload = function() {
  var urlParams = new URLSearchParams(window.location.search);
  var type = urlParams.get('type');
  var value = urlParams.get('value');
  
  if (type && value) {
    switch(type) {
      case 'seed':
        document.getElementById('fieldseed').value = value;
        sanitizeandconvert(value, 'fieldseed');
        break;
      case 'privatekey':
        document.getElementById('fieldprivatekey').value = value;
        sanitizeandconvert(value, 'fieldprivatekey');
        break;
      case 'publickey':
        document.getElementById('fieldpublickey').value = value;
        sanitizeandconvert(value, 'fieldpublickey');
        break;
      case 'address':
        document.getElementById('fieldaddress').value = value;
        sanitizeandconvert(value, 'fieldaddress');
        break;
    }
  }
};
</script>