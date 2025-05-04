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
<script src="https://cdn.jsdelivr.net/npm/blake2b@2.1.4/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tweetnacl@1.0.3/nacl-fast.min.js" integrity="sha256-PsU1wASu6yJXhdjpP7M7+Z9S45m9ffwBlptWKbrqUTE=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/nano-base32@1.0.1/index.min.js"></script>

<!-- Wallet functions -->
<script type="text/javascript">
// Functions from wallet-functions.js
stringFromHex = function(hex) {
  var hex = hex.toString(); // force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

stringToHex = function (str) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}

accountFromHexKey = function (hex) {
  var key_bytes = hex_uint8(hex)
  var checksum_bytes = blake2b(key_bytes, null, 5).reverse();
  var checksum = encode(checksum_bytes);
  var c_account = encode(key_bytes);
  return 'xrb_' + c_account + checksum;
};

parseXRBAccount = function(str) {
  var i = str.indexOf('xrb_');
  if (i != -1) {
    var acc = str.slice(i, i + 64);
    try {
      keyFromAccount(acc);
      return acc;
    } catch (e) {
      return false;
    }
  }
  return false;
}

dec2hex = function (str, bytes = null) {
  var dec = str.toString().split(''), sum = [], hex = [], i, s
  while (dec.length) {
    s = 1 * dec.shift()
    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10
      sum[i] = s % 16
      s = (s - sum[i]) / 16
    }
  }
  while (sum.length) {
    hex.push(sum.pop().toString(16));
  }

  hex = hex.join('');

  if (hex.length % 2 != 0)
    hex = "0" + hex;

  if (bytes > hex.length / 2) {
    var diff = bytes - hex.length / 2;
    for (var i = 0; i < diff; i++)
      hex = "00" + hex;
  }

  return hex;
}

hex2dec = function(s) {
  function add(x, y) {
    var c = 0, r = [];
    var x = x.split('').map(Number);
    var y = y.split('').map(Number);
    while (x.length || y.length) {
      var s = (x.pop() || 0) + (y.pop() || 0) + c;
      r.unshift(s < 10 ? s : s - 10);
      c = s < 10 ? 0 : 1;
    }
    if (c) r.unshift(c);
    return r.join('');
  }

  var dec = '0';
  s.split('').forEach(function (chr) {
    var n = parseInt(chr, 16);
    for (var t = 8; t; t >>= 1) {
      dec = add(dec, dec);
      if (n & t) dec = add(dec, '1');
    }
  });
  return dec;
}

hex_uint8 = function (hex) {
  var length = (hex.length / 2) | 0;
  var uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) uint8[i] = parseInt(hex.substr(i * 2, 2), 16);
  return uint8;
}

uint8_hex = function (uint8) {
  var hex = "";
  let aux;
  for (let i = 0; i < uint8.length; i++) {
    aux = uint8[i].toString(16).toUpperCase();
    if (aux.length == 1)
      aux = '0' + aux;
    hex += aux;
    aux = '';
  }
  return (hex);
}

uint4_hex = function (uint4) {
  var hex = "";
  for (let i = 0; i < uint4.length; i++) hex += uint4[i].toString(16).toUpperCase();
  return (hex);
}

function equal_arrays(array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i])  return false;
  }
  return true;
}

keyFromAccount = function(account) {
  if (
  ((account.startsWith('nano_1') || account.startsWith('nano_3')) && (account.length == 65))   ||
  ((account.startsWith('ban_1') || account.startsWith('ban_3')) && (account.length == 64))   ||
  ((account.startsWith('xrb_1') || account.startsWith('xrb_3')) && (account.length == 64))
  ) {
    var account_crop = account.slice(-60);
    var isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(account_crop);
    if (isValid) {
      var key_bytes = decode(account_crop.substring(0, 52));
      var hash_bytes = decode(account_crop.substring(52, 60));
      var blake_hash = blake2b(key_bytes, null, 5).reverse();
      if (equal_arrays(hash_bytes, blake_hash)) {
        var key = uint8_hex(key_bytes).toUpperCase();
        return key;
      }
      else
        throw "Checksum incorrect. Typo?";
    }
    else
      throw "Illegal characters found.";
  }
  throw "Invalid account.";
}
</script>

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

function hexToBytes(hex) {
  // Convert a hex string to Uint8Array
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

// Generates a new random seed and proceed to convert 
function randomseed() {
  var seed = nacl.randomBytes(32);
  var seedhex = uint8_hex(seed);
  document.getElementById("fieldseed").value = seedhex;
  sanitizeandconvert(seedhex, 'fieldseed');
}

// Generates a new random private key and proceed to convert 
function randomprivatekey() {
  var privatekey = nacl.randomBytes(32);
  var privatekeyhex = uint8_hex(privatekey);
  document.getElementById("fieldprivatekey").value = privatekeyhex;
  sanitizeandconvert(privatekeyhex, 'fieldprivatekey');
}

// Generates a new random public key and proceed to convert 
function randompublickey() {
  var publickey = nacl.randomBytes(32);
  var publickeyhex = uint8_hex(publickey);
  document.getElementById("fieldpublickey").value = publickeyhex;
  sanitizeandconvert(publickeyhex, 'fieldpublickey');
}

// This is where the conversion magic happens
function convert(string, field) {
  if (field == 'fieldseed' || field == 'fieldindex') {  
    if(document.getElementById("fieldseed").value.length == 64) { // will be skipped if only a index number has been entered
      var seed = document.getElementById("fieldseed").value; //will take each 2 HEX chars each and make it a byte from 0-255.  
      seed = hex_uint8(seed); //will take each 2 HEX chars each and make it a byte from 0-255.  
      var index = document.getElementById("fieldindex").value;
      var indexbytes = hex_uint8(dec2hex(index, 4));  
      var context = blake2bInit(32);
      blake2bUpdate(context, seed);
      blake2bUpdate(context, indexbytes);
      var resultingprivkey = blake2bFinal(context);
      document.getElementById("fieldprivatekey").value = uint8_hex(resultingprivkey);
      field = 'fieldprivatekey';
    }
  } // end seed input conversion 
  
  if (field == 'fieldprivatekey') {
    var privatekey = document.getElementById("fieldprivatekey").value;
    var privatekeyuint8 = hex_uint8(privatekey);
    var publickeyhex = uint8_hex(nacl.sign.keyPair.fromSecretKey(privatekeyuint8).publicKey);
    document.getElementById("fieldpublickey").value = publickeyhex;
    
    // Generate address from public key (use ban_ prefix instead of xrb_)
    var account = accountFromHexKey(publickeyhex);
    // Replace xrb_ with ban_
    account = account.replace('xrb_', 'ban_');
    document.getElementById("fieldaddress").value = account;
  }
  
  if (field == 'fieldpublickey') {
    document.getElementById("fieldprivatekey").value = '-';
    var publickeyhex = document.getElementById("fieldpublickey").value;
    try {
      var account = accountFromHexKey(publickeyhex);
      // Replace xrb_ with ban_
      account = account.replace('xrb_', 'ban_');
      document.getElementById("fieldaddress").value = account;
    } catch (err) {
      alert('Input error in public key field: ' + err);
    } 
  }
  
  if (field == 'fieldaddress') {
    document.getElementById("fieldprivatekey").value = '-';
    var address = document.getElementById("fieldaddress").value;
    try {
      // Convert ban_ to xrb_ temporarily if needed for keyFromAccount function
      if (address.startsWith('ban_')) {
        var temp_address = 'xrb_' + address.substring(4);
        document.getElementById("fieldpublickey").value = keyFromAccount(temp_address);
      } else {
        document.getElementById("fieldpublickey").value = keyFromAccount(address);
      }
    } catch (err) {
      alert('Input error in address field: ' + err);
    }
  }
}

// Automatic remove of dash on focus
function removedash(fieldobject) {
  if(fieldobject.value == '-') {fieldobject.value='';}
}

// This function is optional and does input sanitation and change visuals for errors
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
    document.getElementById("fieldindex").value = '-';
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