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
      <input type="text" id="fieldseed" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldseed')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldindex" style="font-weight:bold;">Index:</label>
    <input type="number" min="0" max="4294967295" id="fieldindex" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form8" maxlength="10" value="0"/> (max 4,294,967,295)
    <br/>
    
    <label for="fieldprivatekey" style="font-weight:bold;">Account private key:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldprivatekey" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldprivatekey')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldpublickey" style="font-weight:bold;">Account public key:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldpublickey" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldpublickey')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldaddress" style="font-weight:bold;">Account address:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldaddress" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/>
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

<!-- Required JavaScript libraries -->
<script src="https://cdn.jsdelivr.net/npm/tweetnacl@1.0.3/nacl-fast.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/blake2b@2.1.4/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/nano-base32@1.0.1/index.min.js"></script>

<script type="text/javascript">
// Base32 alphabet used by Nano/Banano
const alphabet = '13456789abcdefghijkmnopqrstuwxyz';

// Helper function for encoding/decoding
function encode(input) {
  if (input.constructor !== Uint8Array) {
    throw new Error('Input must be a Uint8Array');
  }
  
  const length = input.length;
  const leftover = (length * 8) % 5;
  const offset = leftover === 0 ? 0 : 5 - leftover;

  let value = 0;
  let output = '';
  let bits = 0;

  for (let i = 0; i < length; i++) {
    value = (value << 8) | input[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits + offset - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - (bits + offset))) & 31];
  }

  return output;
}

function decode(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  function readChar(char) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) {
      throw new Error('Invalid character found: ' + char);
    }
    return idx;
  }
  
  const length = input.length;
  const leftover = (length * 5) % 8;
  const offset = leftover === 0 ? 0 : 8 - leftover;

  let bits = 0;
  let value = 0;

  let index = 0;
  let output = new Uint8Array(Math.ceil(length * 5 / 8));

  for (let i = 0; i < length; i++) {
    value = (value << 5) | readChar(input[i]);
    bits += 5;

    if (bits >= 8) {
      output[index++] = (value >>> (bits + offset - 8)) & 255;
      bits -= 8;
    }
  }
  
  if (bits > 0) {
    output[index++] = (value << (bits + offset - 8)) & 255;
  }

  if (leftover !== 0) {
    output = output.slice(1);
  }
  
  return output;
}

// Hex conversion utilities
function hex_uint8(hex) {
  const length = (hex.length / 2) | 0;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) uint8[i] = parseInt(hex.substr(i * 2, 2), 16);
  return uint8;
}

function uint8_hex(uint8) {
  let hex = "";
  for (let i = 0; i < uint8.length; i++) {
    let aux = uint8[i].toString(16).toUpperCase();
    if (aux.length === 1) aux = '0' + aux;
    hex += aux;
  }
  return hex;
}

// Function to convert from account address to public key
function keyFromAccount(account) {
  if (
    ((account.startsWith('nano_1') || account.startsWith('nano_3')) && (account.length === 65)) ||
    ((account.startsWith('ban_1') || account.startsWith('ban_3')) && (account.length === 64)) ||
    ((account.startsWith('xrb_1') || account.startsWith('xrb_3')) && (account.length === 64))
  ) {
    const account_crop = account.slice(-60);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(account_crop);
    
    if (isValid) {
      const key_bytes = decode(account_crop.substring(0, 52));
      const hash_bytes = decode(account_crop.substring(52, 60));
      
      // Create a Blake2b hash
      const context = blake2b(5);
      context.update(key_bytes);
      const blake_hash = new Uint8Array(context.digest()).reverse();
      
      if (equalArrays(hash_bytes, blake_hash)) {
        return uint8_hex(key_bytes).toUpperCase();
      } else {
        throw "Checksum incorrect. Typo?";
      }
    } else {
      throw "Illegal characters found.";
    }
  }
  throw "Invalid account.";
}

// Function to convert from public key to account address
function accountFromHexKey(hex, prefix = 'ban_') {
  const key_bytes = hex_uint8(hex);
  
  // Create a Blake2b hash
  const context = blake2b(5);
  context.update(key_bytes);
  const checksum_bytes = new Uint8Array(context.digest()).reverse();
  
  const checksum = encode(checksum_bytes);
  const c_account = encode(key_bytes);
  
  return prefix + c_account + checksum;
}

// Compare two arrays for equality
function equalArrays(array1, array2) {
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
}

// Function to derive private key from seed and index
function getPrivateKeyFromSeed(seed, index) {
  // Convert seed to bytes
  const seedBytes = hex_uint8(seed);
  
  // Convert index to bytes (big-endian)
  const indexBytes = new Uint8Array(4);
  indexBytes[0] = (index >> 24) & 0xFF;
  indexBytes[1] = (index >> 16) & 0xFF;
  indexBytes[2] = (index >> 8) & 0xFF;
  indexBytes[3] = index & 0xFF;
  
  // Create Blake2b hash
  const context = blake2b(32);
  context.update(seedBytes);
  context.update(indexBytes);
  const privateKey = context.digest();
  
  return uint8_hex(privateKey);
}

// Function to get public key from private key
function getPublicKeyFromPrivateKey(privateKey) {
  const privateKeyBytes = hex_uint8(privateKey);
  const keyPair = nacl.sign.keyPair.fromSecretKey(privateKeyBytes);
  return uint8_hex(keyPair.publicKey);
}

// Convert decimal to hex
function dec2hex(dec, bytes = null) {
  let hex = Number(dec).toString(16);
  if (hex.length % 2 !== 0) hex = "0" + hex;
  
  if (bytes && bytes > hex.length / 2) {
    const diff = bytes - hex.length / 2;
    for (let i = 0; i < diff; i++) {
      hex = "00" + hex;
    }
  }
  
  return hex;
}

// Copy to clipboard functionality
function copyToClipboard(elementId) {
  const copyText = document.getElementById(elementId);
  copyText.select();
  document.execCommand("copy");
}

// Automatic remove of dash on focus
function removedash(fieldobject) {
  if (fieldobject.value === '-') {
    fieldobject.value = '';
  }
}

// Clear all fields
function clearAllFields() {
  document.getElementById('keyconverter').reset();
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

// Generate a random seed
function randomseed() {
  const seed = uint8_hex(nacl.randomBytes(32));
  document.getElementById("fieldseed").value = seed;
  sanitizeandconvert(seed, 'fieldseed');
}

// Generate a random private key
function randomprivatekey() {
  const privateKey = uint8_hex(nacl.randomBytes(32));
  document.getElementById("fieldprivatekey").value = privateKey;
  sanitizeandconvert(privateKey, 'fieldprivatekey');
}

// Generate a random public key
function randompublickey() {
  const publicKey = uint8_hex(nacl.randomBytes(32));
  document.getElementById("fieldpublickey").value = publicKey;
  sanitizeandconvert(publicKey, 'fieldpublickey');
}

// This is where the conversion magic happens
function convert(string, field) {
  if (field === 'fieldseed' || field === 'fieldindex') {  
    if (document.getElementById("fieldseed").value.length === 64) {
      const seed = document.getElementById("fieldseed").value;
      const index = parseInt(document.getElementById("fieldindex").value) || 0;
      
      // Derive private key from seed and index
      const privateKey = getPrivateKeyFromSeed(seed, index);
      document.getElementById("fieldprivatekey").value = privateKey;
      field = 'fieldprivatekey';
    }
  }
  
  if (field === 'fieldprivatekey') {
    const privateKey = document.getElementById("fieldprivatekey").value;
    
    // Get public key from private key
    try {
      const publicKey = getPublicKeyFromPrivateKey(privateKey);
      document.getElementById("fieldpublickey").value = publicKey;
      
      // Get address from public key
      const address = accountFromHexKey(publicKey, 'ban_');
      document.getElementById("fieldaddress").value = address;
    } catch (err) {
      document.getElementById("fieldpublickey").value = '-';
      document.getElementById("fieldaddress").value = '-';
    }
  }
  
  if (field === 'fieldpublickey') {
    document.getElementById("fieldprivatekey").value = '-';
    const publicKey = document.getElementById("fieldpublickey").value;
    
    try {
      // Get address from public key
      const address = accountFromHexKey(publicKey, 'ban_');
      document.getElementById("fieldaddress").value = address;
    } catch (err) {
      document.getElementById("fieldaddress").value = '-';
    }
  }
  
  if (field === 'fieldaddress') {
    document.getElementById("fieldprivatekey").value = '-';
    const address = document.getElementById("fieldaddress").value;
    
    try {
      // Get public key from address
      const publicKey = keyFromAccount(address);
      document.getElementById("fieldpublickey").value = publicKey;
    } catch (err) {
      document.getElementById("fieldpublickey").value = '-';
    }
  }
}

// This function handles input sanitation and visual updates for errors
function sanitizeandconvert(string, field) {
  if (field === 'fieldseed' || field === 'fieldprivatekey' || field === 'fieldpublickey') {
    // Sanitize hex input (only allow hex characters and convert to uppercase)
    document.getElementById(field).value = document.getElementById(field).value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase().substr(0, 64);
  }
  
  if (field === 'fieldseed' && !(parseInt(document.getElementById("fieldindex").value, 10) >= 0)) {
    document.getElementById("fieldindex").value = 0;
  }
  
  if (field === 'fieldindex') {
    let index = document.getElementById("fieldindex").value.replace(/[^0-9]/g, '');
    
    if (parseInt(index, 10) > 4294967295) {
      document.getElementById("fieldindex").value = 4294967295;
    } else if (parseInt(index, 10) == index) {
      document.getElementById("fieldindex").value = parseInt(index, 10);
    } else {
      document.getElementById("fieldindex").value = index;
    }
    
    if (document.getElementById("fieldseed").value.length !== 64) {
      document.getElementById("fieldprivatekey").value = '-';
      document.getElementById("fieldpublickey").value = '-';
      document.getElementById("fieldaddress").value = '-';
    }
  }
  
  if (field !== 'fieldseed' && field !== 'fieldindex') {
    document.getElementById("fieldseed").value = '-';
    document.getElementById("fieldindex").value = '-';
  }
  
  if (document.getElementById(field).value === '') {
    return;
  }
  
  if (document.getElementById("fieldseed").value.length === 64 || document.getElementById("fieldseed").value === '-') {
    document.getElementById('fieldseed').classList.remove("inputerrorborder");
    document.getElementById('fieldprivatekey').classList.remove("inputerrorborder");
    document.getElementById('fieldpublickey').classList.remove("inputerrorborder");
  }
  
  if (field === 'fieldseed' && document.getElementById('fieldseed').value.length !== 64) {
    document.getElementById('fieldseed').classList.add("inputerrorborder");
    document.getElementById("fieldprivatekey").value = '-';
    document.getElementById("fieldpublickey").value = '-';
    document.getElementById("fieldaddress").value = '-';
  } else if (field === 'fieldseed' && document.getElementById('fieldseed').value.length === 64) {
    document.getElementById('fieldseed').classList.remove("inputerrorborder");
  }
  
  if (field === 'fieldindex' && document.getElementById('fieldseed').value.length !== 64) {
    document.getElementById('fieldseed').classList.add("inputerrorborder");
    document.getElementById("fieldprivatekey").value = '-';
    document.getElementById("fieldpublickey").value = '-';
    document.getElementById("fieldaddress").value = '-';
    return;
  } else if (field === 'fieldindex' && document.getElementById('fieldseed').value.length === 64) {
    document.getElementById('fieldseed').classList.remove("inputerrorborder");
  }
  
  if (field === 'fieldprivatekey' && document.getElementById('fieldprivatekey').value.length !== 64) {
    document.getElementById('fieldprivatekey').classList.add("inputerrorborder");
    document.getElementById("fieldpublickey").value = '-';
    document.getElementById("fieldaddress").value = '-';
  } else {
    document.getElementById('fieldprivatekey').classList.remove("inputerrorborder");
  }
  
  if (field === 'fieldpublickey' && document.getElementById('fieldpublickey').value.length !== 64) {
    document.getElementById('fieldpublickey').classList.add("inputerrorborder");
    document.getElementById("fieldprivatekey").value = '-';
    document.getElementById("fieldaddress").value = '-';
  } else {
    document.getElementById('fieldpublickey').classList.remove("inputerrorborder");
  }
  
  if (field === 'fieldaddress') {
    document.getElementById('fieldaddress').value = document.getElementById('fieldaddress').value.toLowerCase();
    const rawaccount = document.getElementById('fieldaddress').value;
    
    if (
      ((rawaccount.startsWith('nano_1') || rawaccount.startsWith('nano_3')) && (rawaccount.length === 65)) ||
      ((rawaccount.startsWith('ban_1') || rawaccount.startsWith('ban_3')) && (rawaccount.length === 64)) ||
      ((rawaccount.startsWith('xrb_1') || rawaccount.startsWith('xrb_3')) && (rawaccount.length === 64))
    ) { 
      document.getElementById('fieldaddress').classList.remove("inputerrorborder");
    } else {
      document.getElementById('fieldaddress').classList.add("inputerrorborder");
      document.getElementById("fieldseed").value = '-';
      document.getElementById("fieldprivatekey").value = '-';
      document.getElementById("fieldpublickey").value = '-';
      return;
    }
  }
  
  if (field !== 'fieldindex' && field !== 'fieldaddress' && document.getElementById(field).value.length !== 64) {
    return;
  }
  
  document.getElementById(field).classList.remove("inputerrorborder");
  convert(document.getElementById(field).value, field);
}

// Process URL parameters on page load
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type');
  const value = urlParams.get('value');
  
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

<style>
.input-with-copy {
  display: flex;
  width: 100%;
}

.input-with-copy input {
  flex-grow: 1;
}

.copy-button {
  margin-left: 8px;
  padding: 4px 8px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  cursor: pointer;
}

.copy-button:hover {
  background-color: #e1e1e1;
}

.buttona {
  display: inline-block;
  padding: 8px 16px;
  margin: 5px;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.buttonblue {
  background-color: #4a90e2;
  color: white;
}

.buttonred {
  background-color: #e24a4a;
  color: white;
}

.inputerrorborder {
  border: 2px solid red !important;
}

.warning {
  color: #e24a4a;
  font-weight: bold;
  padding: 10px;
  background-color: #fff8f8;
  border-left: 4px solid #e24a4a;
  margin-top: 20px;
}
</style>