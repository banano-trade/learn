/**
 * Banano Account Generator Tool
 */

// NaCl and BLAKE2b libraries should be loaded via custom-head.html

// Convert hex string to bytes
function hex_uint8(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return new Uint8Array(bytes);
}

// Convert bytes to hex string
function uint8_hex(bytes) {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    let aux = bytes[i].toString(16).toUpperCase();
    if (aux.length == 1) aux = '0' + aux;
    hex += aux;
  }
  return hex;
}

// Convert decimal to hex with padding
function dec2hex(dec, padding) {
  let hex = Number(dec).toString(16);
  padding = typeof padding === 'undefined' || padding === null ? 2 : padding;
  while (hex.length < padding) {
    hex = '0' + hex;
  }
  return hex;
}

// Alphabet used for encoding
const alphabet = "13456789abcdefghijkmnopqrstuwxyz";

// Encode public key to account address
function accountFromHexKey(publickey) {
  const key_bytes = hex_uint8(publickey);
  
  // Compute blake2b hash for the checksum
  const checksum = blake2bFinal(blake2bInit(5, null), key_bytes);
  
  // Convert public key to base32 encoding
  let encoded = '';
  for (let i = 0; i < key_bytes.length; i += 5) {
    let chunk = 0;
    for (let j = 0; j < 5 && i + j < key_bytes.length; j++) {
      chunk = chunk * 256 + key_bytes[i + j];
    }
    
    let digit = 0;
    for (let j = 0; j < 8; j++) {
      digit = chunk % 32;
      chunk = Math.floor(chunk / 32);
      encoded = alphabet[digit] + encoded;
    }
  }
  
  // Convert checksum to base32 encoding
  let checksumEncoded = '';
  for (let i = 0; i < checksum.length; i += 5) {
    let chunk = 0;
    for (let j = 0; j < 5 && i + j < checksum.length; j++) {
      chunk = chunk * 256 + checksum[i + j];
    }
    
    let digit = 0;
    for (let j = 0; j < 8; j++) {
      digit = chunk % 32;
      chunk = Math.floor(chunk / 32);
      checksumEncoded = alphabet[digit] + checksumEncoded;
    }
  }
  
  // Return complete address with prefix
  return `xrb_${encoded}${checksumEncoded}`;
}

// Derive public key from account address
function keyFromAccount(account) {
  if (account.startsWith('ban_')) {
    account = account.replace('ban_', 'xrb_');
  }
  
  if (!account.startsWith('xrb_') && !account.startsWith('nano_')) {
    throw new Error('Invalid account format');
  }
  
  const account_crop = account.substring(4, 56);
  const account_chars = account_crop.split('');
  
  // Convert base32 to bytes
  const bytes = [];
  for (let i = 0; i < account_chars.length; i += 8) {
    let chunk = 0;
    for (let j = 0; j < 8 && i + j < account_chars.length; j++) {
      chunk = chunk * 32 + alphabet.indexOf(account_chars[i + j]);
    }
    
    for (let j = 4; j >= 0; j--) {
      if (bytes.length < 32) { // Only need 32 bytes for the public key
        bytes.unshift(chunk % 256);
      }
      chunk = Math.floor(chunk / 256);
    }
  }
  
  return uint8_hex(bytes);
}

// Initialize BLAKE2b for hashing
function blake2bInit(outlen, key) {
  return window.blake.blake2bInit(outlen, key);
}

// Update BLAKE2b with data
function blake2bUpdate(ctx, data) {
  window.blake.blake2bUpdate(ctx, data);
}

// Finalize BLAKE2b hash
function blake2bFinal(ctx, out) {
  return window.blake.blake2bFinal(ctx, out);
}

// Generate a random seed
function randomseed() {
  var seed = nacl.randomBytes(32);
  var seedhex = uint8_hex(seed);
  document.getElementById("fieldseed").value = seedhex;
  sanitizeandconvert(seedhex, 'fieldseed');
}

// remove dash on focus
function removedash(fieldobject) {
  if (fieldobject.value == '-') {
    fieldobject.value = '';
  }
}

// Convert between different representations
function convert(string, field) {
  if (field == 'fieldseed' || field == 'fieldindex') {  
    if (document.getElementById("fieldseed").value.length == 64) {
      var seed = document.getElementById("fieldseed").value;
      seed = hex_uint8(seed);
      var index = document.getElementById("fieldindex").value;
      var indexbytes = hex_uint8(dec2hex(index, 4));  
      var context = blake2bInit(32);
      blake2bUpdate(context, seed);
      blake2bUpdate(context, indexbytes);
      var resultingprivkey = blake2bFinal(context);
      document.getElementById("fieldprivatekey").value = uint8_hex(resultingprivkey);
      field = 'fieldprivatekey';
    }
  }
  
  if (field == 'fieldprivatekey') {
    var privatekey = document.getElementById("fieldprivatekey").value;
    var privatekeyuint8 = hex_uint8(privatekey);
    var publickeyhex = uint8_hex(nacl.sign.keyPair.fromSecretKey(privatekeyuint8).publicKey);
    document.getElementById("fieldpublickey").value = publickeyhex;
    var account = accountFromHexKey(publickeyhex).replace("xrb_", "ban_");
    document.getElementById("fieldaddress").value = account;
  }
  
  if (field == 'fieldpublickey') {
    document.getElementById("fieldprivatekey").value = '-';
    var publickeyhex = document.getElementById("fieldpublickey").value;
    try {
      var account = accountFromHexKey(publickeyhex).replace("xrb_", "ban_");
      document.getElementById("fieldaddress").value = account;
    } catch (err) {
      alert('Input error in public key field: ' + err);
    } 
  }
  
  if (field == 'fieldaddress') {
    document.getElementById("fieldprivatekey").value = '-';
    var address = document.getElementById("fieldaddress").value;
    try {
      document.getElementById("fieldpublickey").value = keyFromAccount(address);
    } catch (err) {
      alert('Input error in address field: ' + err);
    }
  }
}

// Sanitize and validate input
function sanitizeandconvert(string, field) {
  if (field == 'fieldseed' || field == 'fieldprivatekey' || field == 'fieldpublickey') {
    document.getElementById(field).value = document.getElementById(field).value.replace(/[^0-9A-F]/gi, '').toUpperCase().substr(0, 64);
  }
  
  if (field == 'fieldseed' && !(parseInt(document.getElementById("fieldindex").value, 10) >= 0)) {
    document.getElementById("fieldindex").value = 0;
  }
  
  if (field == 'fieldindex') {
    index = document.getElementById("fieldindex").value.replace(/[^0-9\.]/g, '');
    if (parseInt(index, 10) > 4294967295) {
      document.getElementById("fieldindex").value = 4294967295;
    } else if (parseInt(index, 10) == index) {
      document.getElementById("fieldindex").value = parseInt(index, 10);
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
    document.getElementById("fieldindex").value = '-';
  }
  
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
    if (
      ((rawaccount.startsWith('nano_1') || rawaccount.startsWith('nano_3')) && (rawaccount.length == 65)) ||
      ((rawaccount.startsWith('ban_1') || rawaccount.startsWith('ban_3')) && (rawaccount.length == 64)) ||
      ((rawaccount.startsWith('xrb_1') || rawaccount.startsWith('xrb_3')) && (rawaccount.length == 64))
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
  
  if (field != 'fieldindex' && field != 'fieldaddress' && document.getElementById(field).value.length != 64) {
    return;
  }
  
  document.getElementById(field).classList.remove("inputerrorborder");
  convert(document.getElementById(field).value, field);
}

// Initialize the tool when the page loads
window.onload = function() {
  // Add copy functionality to elements with the copy class
  loadCopyHelper();
  
  // Set default values
  document.getElementById("fieldseed").value = '-';
  document.getElementById("fieldindex").value = '0';
  document.getElementById("fieldprivatekey").value = '-';
  document.getElementById("fieldpublickey").value = '-';
  document.getElementById("fieldaddress").value = '-';
};