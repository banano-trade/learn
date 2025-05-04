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
// Blake2b implementation for address checksums
// Initialization Vector
var BLAKE2B_IV32 = new Uint32Array([
  0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
  0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
  0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
  0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
]);

// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
function ADD64AA(v, a, b) {
  var o0 = v[a] + v[b];
  var o1 = v[a + 1] + v[b + 1];
  if (o0 >= 0x100000000) {
    o1++;
  }
  v[a] = o0;
  v[a + 1] = o1;
}

// 64-bit unsigned addition
// Sets v[a,a+1] += b
function ADD64AC(v, a, b0, b1) {
  var o0 = v[a] + b0;
  if (b0 < 0) {
    o0 += 0x100000000;
  }
  var o1 = v[a + 1] + b1;
  if (o0 >= 0x100000000) {
    o1++;
  }
  v[a] = o0;
  v[a + 1] = o1;
}

// Little-endian byte access
function B2B_GET32(arr, i) {
  return (arr[i] ^
  (arr[i + 1] << 8) ^
  (arr[i + 2] << 16) ^
  (arr[i + 3] << 24));
}

// G Mixing function
var v = new Uint32Array(32);
var m = new Uint32Array(32);
function B2B_G(a, b, c, d, ix, iy) {
  var x0 = m[ix];
  var x1 = m[ix + 1];
  var y0 = m[iy];
  var y1 = m[iy + 1];
  
  ADD64AA(v, a, b);
  ADD64AC(v, a, x0, x1);
  
  var xor0 = v[d] ^ v[a];
  var xor1 = v[d + 1] ^ v[a + 1];
  v[d] = xor1;
  v[d + 1] = xor0;
  
  ADD64AA(v, c, d);
  
  xor0 = v[b] ^ v[c];
  xor1 = v[b + 1] ^ v[c + 1];
  v[b] = (xor0 >>> 24) ^ (xor1 << 8);
  v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);
  
  ADD64AA(v, a, b);
  ADD64AC(v, a, y0, y1);
  
  xor0 = v[d] ^ v[a];
  xor1 = v[d + 1] ^ v[a + 1];
  v[d] = (xor0 >>> 16) ^ (xor1 << 16);
  v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);
  
  ADD64AA(v, c, d);
  
  xor0 = v[b] ^ v[c];
  xor1 = v[b + 1] ^ v[c + 1];
  v[b] = (xor1 >>> 31) ^ (xor0 << 1);
  v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
}

// Sigma values for Blake2b
var SIGMA8 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
  11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
  7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
  9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
  2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
  12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
  13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
  6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
  10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
];

// Convert to uint32 offsets for JS
var SIGMA82 = SIGMA8.map(function(x) { return x * 2; });

// Compression function
function blake2bCompress(ctx, last) {
  var i = 0;
  
  // Init work variables
  for (i = 0; i < 16; i++) {
    v[i] = ctx.h[i];
    v[i + 16] = BLAKE2B_IV32[i];
  }
  
  // Low 64 bits of offset
  v[24] = v[24] ^ ctx.t;
  v[25] = v[25] ^ (ctx.t / 0x100000000);
  
  // Last block flag
  if (last) {
    v[28] = ~v[28];
    v[29] = ~v[29];
  }
  
  // Get little-endian words
  for (i = 0; i < 32; i++) {
    m[i] = B2B_GET32(ctx.b, 4 * i);
  }
  
  // Twelve rounds of mixing
  for (i = 0; i < 12; i++) {
    B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
    B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
    B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
    B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
    B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
    B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
    B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
    B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
  }
  
  for (i = 0; i < 16; i++) {
    ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
  }
}

// Creates a BLAKE2b hashing context
function blake2bInit(outlen, key) {
  // State, 'param block'
  var ctx = {
    b: new Uint8Array(128),
    h: new Uint32Array(16),
    t: 0, // input count
    c: 0, // pointer within buffer
    outlen: outlen // output length in bytes
  };
  
  // Initialize hash state
  for (var i = 0; i < 16; i++) {
    ctx.h[i] = BLAKE2B_IV32[i];
  }
  var keylen = key ? key.length : 0;
  ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;
  
  // Key the hash, if applicable
  if (key) {
    blake2bUpdate(ctx, key);
    ctx.c = 128;
  }
  
  return ctx;
}

// Updates a BLAKE2b streaming hash
function blake2bUpdate(ctx, input) {
  for (var i = 0; i < input.length; i++) {
    if (ctx.c === 128) { // buffer full?
      ctx.t += ctx.c; // add counters
      blake2bCompress(ctx, false); // compress (not last)
      ctx.c = 0; // counter to zero
    }
    ctx.b[ctx.c++] = input[i];
  }
}

// Completes a BLAKE2b streaming hash
function blake2bFinal(ctx) {
  ctx.t += ctx.c; // mark last block offset
  
  while (ctx.c < 128) { // fill up with zeros
    ctx.b[ctx.c++] = 0;
  }
  blake2bCompress(ctx, true); // final block flag = 1
  
  // Little endian convert and store
  var out = new Uint8Array(ctx.outlen);
  for (var i = 0; i < ctx.outlen; i++) {
    out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
  }
  return out;
}

// Main Blake2b function
function blake2b(input, key, outlen) {
  outlen = outlen || 64;
  
  var ctx = blake2bInit(outlen, key);
  blake2bUpdate(ctx, input);
  return blake2bFinal(ctx);
}

// Base32 alphabet used for Banano addresses
const ALPHABET = '13456789abcdefghijkmnopqrstuwxyz';

// Base32 decoder - converts from base32 encoded address to bytes
function decode(input) {
  let bytes = [];
  let bits = 0;
  let value = 0;
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) continue;
    
    value = (value << 5) | idx;
    bits += 5;
    
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xFF);
    }
  }
  
  return new Uint8Array(bytes);
}

// Base32 encoder - converts bytes to base32 encoded string
function encode(data) {
  let bits = 0;
  let value = 0;
  let output = '';
  
  for (let i = 0; i < data.length; i++) {
    value = (value << 8) | data[i];
    bits += 8;
    
    while (bits >= 5) {
      bits -= 5;
      output += ALPHABET[(value >> bits) & 31];
    }
  }
  
  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }
  
  return output;
}

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
    // Convert the main part to a byte array
    const pubKeyBytes = decode(main);
    
    // Create checksum using Blake2b
    const checksumBytes = blake2b(pubKeyBytes, null, 5);
    
    // Reverse the checksum bytes (important for compatibility)
    const reversed = new Uint8Array(checksumBytes.length);
    for (let i = 0; i < checksumBytes.length; i++) {
      reversed[i] = checksumBytes[checksumBytes.length - 1 - i];
    }
    
    // Encode the checksum
    const checksum = encode(reversed);
    
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
  // Generate default address
  convertToBurnAddress();
}

// Initialize when the window loads
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

.input-with-addon {
  display: flex;
  align-items: center;
}

.input-addon-text {
  padding-left: 10px;
  color: #888;
}

.input-with-copy {
  display: flex;
  align-items: center;
}

.copy-button {
  background-color: #444;
  border: none;
  color: white;
  padding: 4px 8px;
  margin-left: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.copy-button:hover {
  background-color: #555;
}
</style>