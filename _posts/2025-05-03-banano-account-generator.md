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
      <input type="text" id="fieldseed" onfocus="removedash(this)" oninput="seedChanged()" autocomplete="off" class="form64 copy"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldseed')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldindex" style="font-weight:bold;">Index:</label>
    <input type="number" min="0" max="4294967295" id="fieldindex" oninput="indexChanged()" autocomplete="off" class="form8" maxlength="10" value="0"/> (max 4,294,967,295)
    <br/>
    
    <label for="fieldprivatekey" style="font-weight:bold;">Account private key:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldprivatekey" onfocus="removedash(this)" oninput="privateKeyChanged()" autocomplete="off" class="form64 copy"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldprivatekey')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldpublickey" style="font-weight:bold;">Account public key:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldpublickey" onfocus="removedash(this)" oninput="publicKeyChanged()" autocomplete="off" class="form64 copy"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldpublickey')">Copy</button>
    </div>
    <br/>
    
    <label for="fieldaddress" style="font-weight:bold;">Account address:</label>
    <div class="input-with-copy">
      <input type="text" id="fieldaddress" onfocus="removedash(this)" oninput="addressChanged()" autocomplete="off" class="form64 copy"/>
      <button type="button" class="copy-button" onclick="copyToClipboard('fieldaddress')">Copy</button>
    </div>
    <br/>
    
    <a class="buttona buttonred" href="#" role="button" onclick="clearAllFields(); return false;">Clear all fields</a>
    <br/>
    
    <a class="buttona buttonblue" href="#" role="button" onclick="generateRandomSeed(); return false;">Random seed</a>
    <a class="buttona buttonblue" href="#" role="button" onclick="generateRandomPrivateKey(); return false;">Random private key</a>
    <a class="buttona buttonblue" href="#" role="button" onclick="generateRandomPublicKey(); return false;">Random public key</a>
  </form>

  <p>You can use URL parameters like <code>?type=address&value=ban_3sete494gu1cbyondbjk8dcxx7ccrp1j31gc7owrk449dyq89qj6hkrhn8yg</code> to prefill fields. Allowed field types are <code>seed</code>, <code>privatekey</code>, <code>publickey</code>, and <code>address</code>.</p>
  
  <p class="warning">Never share your seed or private key with anyone. Always keep these values secure.</p>
</div>

<!-- Required JavaScript libraries -->
<script src="https://cdn.jsdelivr.net/npm/banani@1.0.9/main.min.js"></script>

<script type="text/javascript">
// Initialize a dummy RPC for wallet operations
const rpc = new window.banani.RPC("https://kaliumapi.appditto.com/api");

// Copy to clipboard functionality
function copyToClipboard(elementId) {
  var copyText = document.getElementById(elementId);
  copyText.select();
  document.execCommand("copy");
}

// Utility to remove dash from fields
function removedash(fieldobject) {
  if(fieldobject.value == '-') {
    fieldobject.value = '';
  }
}

// Clear all fields
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

// Generate a random seed
function generateRandomSeed() {
  const randomWallet = window.banani.Wallet.gen_random_wallet(rpc);
  const seed = randomWallet.seed;
  
  document.getElementById('fieldseed').value = seed;
  document.getElementById('fieldindex').value = 0;
  
  updatePrivateKeyFromSeed();
}

// Generate a random private key
function generateRandomPrivateKey() {
  // Use the wallet generation and then extract just the private key
  const randomWallet = window.banani.Wallet.gen_random_wallet(rpc);
  const privateKey = window.banani.get_private_key_from_seed(randomWallet.seed, 0);
  
  document.getElementById('fieldseed').value = '-';
  document.getElementById('fieldindex').value = '-';
  document.getElementById('fieldprivatekey').value = privateKey;
  
  updatePublicKeyFromPrivateKey();
}

// Generate a random public key
function generateRandomPublicKey() {
  // Generate a wallet, get private key, then public key
  const randomWallet = window.banani.Wallet.gen_random_wallet(rpc);
  const privateKey = window.banani.get_private_key_from_seed(randomWallet.seed, 0);
  const publicKey = window.banani.get_public_key_from_private_key(privateKey);
  
  document.getElementById('fieldseed').value = '-';
  document.getElementById('fieldindex').value = '-';
  document.getElementById('fieldprivatekey').value = '-';
  document.getElementById('fieldpublickey').value = publicKey;
  
  updateAddressFromPublicKey();
}

// Validate seed format (64 hex characters)
function isValidSeed(seed) {
  return /^[0-9A-Fa-f]{64}$/.test(seed);
}

// Validate private key format (64 hex characters)
function isValidPrivateKey(privateKey) {
  return /^[0-9A-Fa-f]{64}$/.test(privateKey);
}

// Validate public key format (64 hex characters)
function isValidPublicKey(publicKey) {
  return /^[0-9A-Fa-f]{64}$/.test(publicKey);
}

// Validate Banano address format
function isValidAddress(address) {
  return /^(ban|nano|xrb)_(1|3)[13456789abcdefghijkmnopqrstuwxyz]{59}$/.test(address);
}

// Handle seed changes
function seedChanged() {
  const seed = document.getElementById('fieldseed').value;
  
  // Clear error state
  document.getElementById('fieldseed').classList.remove("inputerrorborder");
  
  if (seed === '') return;
  
  // Sanitize input (allow only hex characters)
  const sanitizedSeed = seed.replace(/[^0-9A-Fa-f]/g, '').substring(0, 64).toUpperCase();
  document.getElementById('fieldseed').value = sanitizedSeed;
  
  // Validate the seed
  if (isValidSeed(sanitizedSeed)) {
    updatePrivateKeyFromSeed();
  } else if (sanitizedSeed !== '') {
    document.getElementById('fieldseed').classList.add("inputerrorborder");
    document.getElementById('fieldprivatekey').value = '-';
    document.getElementById('fieldpublickey').value = '-';
    document.getElementById('fieldaddress').value = '-';
  }
}

// Handle index changes
function indexChanged() {
  let index = document.getElementById('fieldindex').value;
  
  // Only proceed if we have a valid seed
  const seed = document.getElementById('fieldseed').value;
  if (!isValidSeed(seed)) {
    document.getElementById('fieldprivatekey').value = '-';
    document.getElementById('fieldpublickey').value = '-';
    document.getElementById('fieldaddress').value = '-';
    return;
  }
  
  // Sanitize input (allow only digits)
  index = index.replace(/[^0-9]/g, '');
  
  // Cap at max index value
  if (parseInt(index) > 4294967295) {
    index = '4294967295';
  }
  
  document.getElementById('fieldindex').value = index;
  
  if (index === '') return;
  
  updatePrivateKeyFromSeed();
}

// Handle private key changes
function privateKeyChanged() {
  const privateKey = document.getElementById('fieldprivatekey').value;
  
  // Clear error state
  document.getElementById('fieldprivatekey').classList.remove("inputerrorborder");
  
  if (privateKey === '') return;
  
  // Clear seed and index since we're entering a private key directly
  document.getElementById('fieldseed').value = '-';
  document.getElementById('fieldindex').value = '-';
  
  // Sanitize input (allow only hex characters)
  const sanitizedPrivateKey = privateKey.replace(/[^0-9A-Fa-f]/g, '').substring(0, 64).toUpperCase();
  document.getElementById('fieldprivatekey').value = sanitizedPrivateKey;
  
  // Validate the private key
  if (isValidPrivateKey(sanitizedPrivateKey)) {
    updatePublicKeyFromPrivateKey();
  } else if (sanitizedPrivateKey !== '') {
    document.getElementById('fieldprivatekey').classList.add("inputerrorborder");
    document.getElementById('fieldpublickey').value = '-';
    document.getElementById('fieldaddress').value = '-';
  }
}

// Handle public key changes
function publicKeyChanged() {
  const publicKey = document.getElementById('fieldpublickey').value;
  
  // Clear error state
  document.getElementById('fieldpublickey').classList.remove("inputerrorborder");
  
  if (publicKey === '') return;
  
  // Clear previous fields
  document.getElementById('fieldseed').value = '-';
  document.getElementById('fieldindex').value = '-';
  document.getElementById('fieldprivatekey').value = '-';
  
  // Sanitize input (allow only hex characters)
  const sanitizedPublicKey = publicKey.replace(/[^0-9A-Fa-f]/g, '').substring(0, 64).toUpperCase();
  document.getElementById('fieldpublickey').value = sanitizedPublicKey;
  
  // Validate the public key
  if (isValidPublicKey(sanitizedPublicKey)) {
    updateAddressFromPublicKey();
  } else if (sanitizedPublicKey !== '') {
    document.getElementById('fieldpublickey').classList.add("inputerrorborder");
    document.getElementById('fieldaddress').value = '-';
  }
}

// Handle address changes
function addressChanged() {
  const address = document.getElementById('fieldaddress').value.toLowerCase();
  
  // Clear error state
  document.getElementById('fieldaddress').classList.remove("inputerrorborder");
  
  if (address === '') return;
  
  // Clear previous fields
  document.getElementById('fieldseed').value = '-';
  document.getElementById('fieldindex').value = '-';
  document.getElementById('fieldprivatekey').value = '-';
  
  document.getElementById('fieldaddress').value = address;
  
  // Validate the address
  if (isValidAddress(address)) {
    try {
      const publicKey = window.banani.get_public_key_from_address(address);
      document.getElementById('fieldpublickey').value = publicKey;
    } catch (err) {
      document.getElementById('fieldaddress').classList.add("inputerrorborder");
      document.getElementById('fieldpublickey').value = '-';
    }
  } else if (address !== '') {
    document.getElementById('fieldaddress').classList.add("inputerrorborder");
    document.getElementById('fieldpublickey').value = '-';
  }
}

// Update private key based on seed and index
function updatePrivateKeyFromSeed() {
  const seed = document.getElementById('fieldseed').value;
  const index = parseInt(document.getElementById('fieldindex').value) || 0;
  
  if (isValidSeed(seed)) {
    try {
      const privateKey = window.banani.get_private_key_from_seed(seed, index);
      document.getElementById('fieldprivatekey').value = privateKey;
      updatePublicKeyFromPrivateKey();
    } catch (err) {
      document.getElementById('fieldprivatekey').value = '-';
      document.getElementById('fieldpublickey').value = '-';
      document.getElementById('fieldaddress').value = '-';
    }
  }
}

// Update public key based on private key
function updatePublicKeyFromPrivateKey() {
  const privateKey = document.getElementById('fieldprivatekey').value;
  
  if (isValidPrivateKey(privateKey)) {
    try {
      const publicKey = window.banani.get_public_key_from_private_key(privateKey);
      document.getElementById('fieldpublickey').value = publicKey;
      updateAddressFromPublicKey();
    } catch (err) {
      document.getElementById('fieldpublickey').value = '-';
      document.getElementById('fieldaddress').value = '-';
    }
  }
}

// Update address based on public key
function updateAddressFromPublicKey() {
  const publicKey = document.getElementById('fieldpublickey').value;
  
  if (isValidPublicKey(publicKey)) {
    try {
      const address = window.banani.get_address_from_public_key(publicKey);
      document.getElementById('fieldaddress').value = address;
    } catch (err) {
      document.getElementById('fieldaddress').value = '-';
    }
  }
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
        seedChanged();
        break;
      case 'privatekey':
        document.getElementById('fieldprivatekey').value = value;
        privateKeyChanged();
        break;
      case 'publickey':
        document.getElementById('fieldpublickey').value = value;
        publicKeyChanged();
        break;
      case 'address':
        document.getElementById('fieldaddress').value = value;
        addressChanged();
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