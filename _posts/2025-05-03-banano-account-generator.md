---
layout: post
title: "Banano Account Generator"
date: 2025-05-03 12:00:00 +0000
categories: tools
tags: [accounts, wallet, cryptocurrency]
scripts:
  - /assets/js/account-generator.js
---

# Banano Account Generator

This tool allows you to generate Banano accounts directly in your browser. You can generate a random seed or private key, and the tool will convert between different formats.

**IMPORTANT**: This tool runs entirely in your browser. No data is sent to any server. However, for real funds, we recommend using a trusted wallet application.

## How to use this tool

1. Click the "Random Seed" button to generate a new random seed
2. The tool will automatically derive the private key, public key, and account address
3. You can copy any of these values using the copy buttons
4. You can also input your own seed or keys and the tool will convert between formats

<div class="tool-container">
  <h3>Generate a BANANO account with a single click</h3>
  <p>Enter a seed or have the website generate one for you. You can import the seed to a wallet of your choice later.</p>
  
  <form id="keyconverter">
    <label for="fieldseed" style="font-weight:bold;">Seed</label><br/>
    <input type="text" id="fieldseed" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/> <br/>
    
    <div style="display:none;">
      <label for="fieldindex" style="font-weight:bold;">Index:</label>
      <input type="number" min="0" max="4294967295" id="fieldindex" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form8" maxlength="10" value="0"/> (max 4,294,967,295) <br/>
    </div>
    
    <label for="fieldprivatekey" style="font-weight:bold;">Account private key:</label>
    <input type="text" id="fieldprivatekey" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/> <br/>
    
    <label for="fieldpublickey" style="font-weight:bold;">Account public key:</label>
    <input type="text" id="fieldpublickey" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/> <br/>
    
    <label for="fieldaddress" style="font-weight:bold;">Account address:</label>
    <input type="text" id="fieldaddress" onfocus="removedash(this)" oninput="sanitizeandconvert(this.value, this.id);" autocomplete="off" class="form64 copy"/> <br/>
    
    <a class="buttona buttonblue" href="#" role="button" onclick="randomseed(); return false;">Random Seed</a>
    <a class="buttona buttonred" href="#" role="button" onclick="document.getElementById('keyconverter').reset(); return false;">Clear All Fields</a>
  </form>
</div>

## About Banano Addresses

A Banano address (like `ban_1nanoftwk6741wmdfinzojmt8td7g1iu1sn6wfgsxd8htcqojrur7tismbb6`) consists of several parts:

- A prefix (`ban_`)
- A public key encoded in base32 (`1nanoftwk6741wmdfinzojmt8td7g1iu1sn6wfgsxd8htcqojrur7`)
- A checksum (`tismbb6`)

The address is derived from your public key, which in turn is derived from your private key. The private key is derived from your seed and an index number.

## Security Considerations

- Always keep your seed and private key secure
- Never share your seed or private key with anyone
- Use hardware wallets for storing large amounts
- Consider using a password manager to store your seed

<div class="note-box">
  <p><strong>Note:</strong> This generator is for educational purposes. For managing real funds, use a full-featured wallet application.</p>
</div>
