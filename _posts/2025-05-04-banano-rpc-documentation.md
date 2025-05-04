---
layout: post
title: Banano RPC Documentation
date: 2025-05-04
category: docs
head_scripts:
  - "/assets/js/rpc-tester.js"
---

<div class="node-selector-container">
  <h2>Banano RPC Protocol</h2>
  
  <p>The RPC protocol accepts JSON HTTP POST requests. The following are RPC commands along with the responses that are expected. This page includes interactive examples where you can test the RPC commands directly.</p>
  
  <div class="rpc-node-selector">
    <div class="selector-group">
      <label for="rpc-node-url"><strong>Select RPC Node:</strong></label>
      <select id="rpc-node-url" class="node-select">
        <option value="https://api.banano.trade/proxy">api.banano.trade/proxy</option>
        <option value="https://public.node.jungletv.live/rpc">public.node.jungletv.live/rpc</option>
        <option value="custom">Custom URL...</option>
      </select>
    </div>
    <div id="custom-url-container" style="display:none; margin-top: 10px;">
      <input type="text" id="custom-rpc-url" placeholder="Enter custom RPC URL" class="form-input">
      <button id="custom-url-save" class="buttona buttonblue">Save</button>
    </div>
  </div>
</div>

This page is split into the following sections:

| Section | Purpose |
|---------|---------|
| **Node RPCs** | For interacting with the node and ledger. |
| **Wallet RPCs** | For interacting with the built-in wallet. **NOTE**: This wallet is only recommended for development and testing. |

## Node RPCs

**Unconfirmed blocks returned**

Unless otherwise specified, RPC calls can return unconfirmed blocks and related details. In the most important cases where balances or similar details may include unconfirmed amounts, additional warnings have been included.

### account_balance

Returns how many RAW is owned and how many have not yet been received by **account**

**Request:**
```json
{
  "action": "account_balance",
  "account": "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo"
}
```

**Response:**
```json
{
  "balance": "10000",
  "pending": "10000",
  "receivable": "10000"
}
```

**Optional "include_only_confirmed"** *version 22.0+* Boolean, true by default. Results in `balance` only including blocks on this account that have already been confirmed and `receivable` only including incoming send blocks that have already been confirmed on the sending account.

<div class="rpc-tester" data-action="account_balance">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_balance_account">Account:</label>
      <input type="text" id="account_balance_account" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo" class="form-input">
    </div>
    <div class="form-group">
      <label for="account_balance_include_only_confirmed">Include only confirmed?</label>
      <select id="account_balance_include_only_confirmed" class="form-select">
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### account_block_count

Get number of blocks for a specific **account**

**Request:**
```json
{
  "action": "account_block_count",
  "account": "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo"
}
```

**Response:**
```json
{
  "block_count" : "19"
}
```

<div class="rpc-tester" data-action="account_block_count">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_block_count_account">Account:</label>
      <input type="text" id="account_block_count_account" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### account_get

Get account number for the **public key**

**Request:**
```json
{
  "action": "account_get",
  "key": "3068BB1CA04525BB0E416C485FE6A67FD52540227D267CC8B6E8DA958A7FA039"
}
```

**Response:**
```json
{
  "account" : "ban_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx"
}
```

<div class="rpc-tester" data-action="account_get">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_get_key">Public Key (hex):</label>
      <input type="text" id="account_get_key" value="3068BB1CA04525BB0E416C485FE6A67FD52540227D267CC8B6E8DA958A7FA039" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### account_history

Reports send/receive information for an **account**

**Request:**
```json
{
  "action": "account_history",
  "account": "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo",
  "count": "10"
}
```

**Response:**
```json
{
  "account": "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo",
  "history": [
    {
      "type": "send",
      "account": "ban_38dzqpPXjaAytRjEBJGDpdKSWoJm1iKJREkDqdqJc8c3RJxA8yNMEm3bpsS",
      "amount": "100000000000000000000000000000",
      "local_timestamp": "1611671570",
      "height": "564",
      "hash": "4CEB66B38A3FCF19EC817143EB291234F2D279CD1651F6DC5812E3FAB5FF84B5"
    }
  ],
  "previous": "8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72"
}
```

<div class="rpc-tester" data-action="account_history">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_history_account">Account:</label>
      <input type="text" id="account_history_account" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo" class="form-input">
    </div>
    <div class="form-group">
      <label for="account_history_count">Count:</label>
      <input type="number" id="account_history_count" value="10" class="form-input" style="width: 100px;">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### account_info

Returns frontier, open block, change representative block, balance, last modified timestamp from local database & block count for **account**

**Request:**
```json
{
  "action": "account_info",
  "account": "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo"
}
```

**Response:**
```json
{
  "frontier": "FF84533A571D953A596EA401FD41743AC85D04F406E76FDE4408EAED50B473DD",
  "open_block": "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
  "representative_block": "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
  "balance": "235580100176034320859259343606608761791",
  "modified_timestamp": "1501793775",
  "block_count": "33",
  "account_version": "1",
  "confirmation_height": "28",
  "confirmation_height_frontier": "34C70FCA0952E29ADC7D6CACA30A12F98D1F6C6E0E0E5A5E237A5D304318FD86"
}
```

<div class="rpc-tester" data-action="account_info">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_info_account">Account:</label>
      <input type="text" id="account_info_account" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo" class="form-input">
    </div>
    <div class="form-group">
      <label for="account_info_representative">Include representative?</label>
      <select id="account_info_representative" class="form-select">
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
    <div class="form-group">
      <label for="account_info_weight">Include weight?</label>
      <select id="account_info_weight" class="form-select">
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### account_key

Get the public key for **account**

**Request:**
```json
{
  "action": "account_key",
  "account": "ban_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx"
}
```

**Response:**
```json
{
  "key": "3068BB1CA04525BB0E416C485FE6A67FD52540227D267CC8B6E8DA958A7FA039"
}
```

<div class="rpc-tester" data-action="account_key">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_key_account">Account:</label>
      <input type="text" id="account_key_account" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### account_representative

Returns the representative for **account**

**Request:**
```json
{
  "action": "account_representative",
  "account": "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo"
}
```

**Response:**
```json
{
  "representative": "ban_1anrzcuwe64rwxzcco8dkhpyxpi8kd7zsjc1oeimpc3ppca4mrjtwnqposrs"
}
```

<div class="rpc-tester" data-action="account_representative">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_representative_account">Account:</label>
      <input type="text" id="account_representative_account" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### accounts_balances

Returns how many RAW is owned and how many have not yet been received by **accounts list**

**Request:**
```json
{
  "action": "accounts_balances",
  "accounts": ["ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo", "ban_1waxp1c6c3jnonceb7io7xrmqwuc8ab3fh3wfytoruze97wxkipzaadh33nx"]
}
```

**Response:**
```json
{
  "balances": {
    "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo": {
      "balance": "325586539664609129644855132177",
      "pending": "2309370929000000000000000000000000",
      "receivable": "2309370929000000000000000000000000"
    },
    "ban_1waxp1c6c3jnonceb7io7xrmqwuc8ab3fh3wfytoruze97wxkipzaadh33nx": {
      "balance": "10000000",
      "pending": "0",
      "receivable": "0"
    }
  }
}
```

<div class="rpc-tester" data-action="accounts_balances">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="accounts_balances_accounts">Accounts (comma separated):</label>
      <input type="text" id="accounts_balances_accounts" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo, ban_1waxp1c6c3jnonceb7io7xrmqwuc8ab3fh3wfytoruze97wxkipzaadh33nx" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### accounts_frontiers

Returns a list of pairs of account and block hash representing the head block for **accounts list**

**Request:**
```json
{
  "action": "accounts_frontiers",
  "accounts": ["ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo", "ban_1waxp1c6c3jnonceb7io7xrmqwuc8ab3fh3wfytoruze97wxkipzaadh33nx"]
}
```

**Response:**
```json
{
  "frontiers": {
    "ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo": "791AF413173EEE674A6FCF633B5DFC0F3C33F397F0DA08E987D9E0741D40D81A",
    "ban_1waxp1c6c3jnonceb7io7xrmqwuc8ab3fh3wfytoruze97wxkipzaadh33nx": "6A32E2F2E2A14BA6815D52D0F523C2302F8BC3E34196E52E33CB9E86172D5E26"
  }
}
```

<div class="rpc-tester" data-action="accounts_frontiers">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="accounts_frontiers_accounts">Accounts (comma separated):</label>
      <input type="text" id="accounts_frontiers_accounts" value="ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo, ban_1waxp1c6c3jnonceb7io7xrmqwuc8ab3fh3wfytoruze97wxkipzaadh33nx" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### block_info

Retrieves a json representation of the **block**

**Request:**
```json
{
  "action": "block_info",
  "hash": "4CEB66B38A3FCF19EC817143EB291234F2D279CD1651F6DC5812E3FAB5FF84B5"
}
```

**Response:**
```json
{
  "block_account": "ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh",
  "amount": "30000000000000000000000000000000000",
  "balance": "5606157000000000000000000000000000000",
  "height": "58",
  "local_timestamp": "0",
  "confirmed": "true",
  "contents": {
    "type": "state",
    "account": "ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh",
    "previous": "CE898C131AAEE25E05362F247760F8A3ACF34A9796A5AE0D9204E86B0637965E",
    "representative": "ban_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou",
    "balance": "5606157000000000000000000000000000000",
    "link": "5D1AA8A45F8736519D707FCB375976A7F9AF795091021D7E9C7548D6F45DD8D5",
    "link_as_account": "ban_1qato4k7z3spc8gq1zyd8xeqfbzsoxwo36a45ozbrxcatut7up8ohyardu1z",
    "signature": "82D41BC16F313E4B2243D14DFFA2FB04679C540C2095FEE7EAE0F2F26880AD56DD48D87A7CC5DD760C5B2D76EE2C205506AA557BF00B60D8DEE312EC7343A501",
    "work": "8a142e07a10996d5"
  },
  "subtype": "send"
}
```

<div class="rpc-tester" data-action="block_info">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="block_info_hash">Block Hash:</label>
      <input type="text" id="block_info_hash" value="4CEB66B38A3FCF19EC817143EB291234F2D279CD1651F6DC5812E3FAB5FF84B5" class="form-input">
    </div>
    <div class="form-group">
      <label for="block_info_json_block">JSON Block?</label>
      <select id="block_info_json_block" class="form-select">
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### blocks_info

Retrieves information about blocks in **hashes**

**Request:**
```json
{
  "action": "blocks_info",
  "hashes": ["4CEB66B38A3FCF19EC817143EB291234F2D279CD1651F6DC5812E3FAB5FF84B5", "1DC3395B4CDCA9980851386E34B2081E2886D77E85ABA0A02A92C962080B411B"]
}
```

**Response:**
```json
{
  "blocks": {
    "4CEB66B38A3FCF19EC817143EB291234F2D279CD1651F6DC5812E3FAB5FF84B5": {
      "block_account": "ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh",
      "amount": "30000000000000000000000000000000000",
      "balance": "5606157000000000000000000000000000000",
      "height": "58",
      "local_timestamp": "0",
      "confirmed": "true",
      "contents": {
        "type": "state",
        "account": "ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh",
        "previous": "CE898C131AAEE25E05362F247760F8A3ACF34A9796A5AE0D9204E86B0637965E",
        "representative": "ban_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou",
        "balance": "5606157000000000000000000000000000000",
        "link": "5D1AA8A45F8736519D707FCB375976A7F9AF795091021D7E9C7548D6F45DD8D5",
        "link_as_account": "ban_1qato4k7z3spc8gq1zyd8xeqfbzsoxwo36a45ozbrxcatut7up8ohyardu1z",
        "signature": "82D41BC16F313E4B2243D14DFFA2FB04679C540C2095FEE7EAE0F2F26880AD56DD48D87A7CC5DD760C5B2D76EE2C205506AA557BF00B60D8DEE312EC7343A501",
        "work": "8a142e07a10996d5"
      },
      "subtype": "send"
    },
    "1DC3395B4CDCA9980851386E34B2081E2886D77E85ABA0A02A92C962080B411B": {
      "block_account": "ban_3kxxs46k7x581icfxfaxmdsg1gmzonj6m7cxgjip6oapte6naek5z1mpptmx",
      "amount": "1000000000000000000000000000000",
      "balance": "1203000000000000000000000000000000",
      "height": "21",
      "local_timestamp": "1612245620",
      "confirmed": "true",
      "contents": {
        "type": "state",
        "account": "ban_3kxxs46k7x581icfxfaxmdsg1gmzonj6m7cxgjip6oapte6naek5z1mpptmx",
        "previous": "B73B7CBA2DCA6EB53DFB7F10D0726E2C6BB5C34989G70C475AD8AF4026D2E09",
        "representative": "ban_1fomoz167m7o38gw4rzt7hz67oq6itejpt4yocrfywujbpatd711cjew8gjj",
        "balance": "1203000000000000000000000000000000",
        "link": "8C4D14A88B89F866A26EA97F324A641B86AB8AAD606B9B143A54592B201BFC2C",
        "link_as_account": "ban_31dhbgirwzd3ce7atkfqzjq8rkft18d389xkeus3zagwdf3fju8zmk59tdgt",
        "signature": "E6673D4A8D3D53FCD2DCE63F0AB9F0A68BC257CA0B343DADD6C8775456AA982ABB1644E679E2A988F8C25C95D4538F15B45D7C584C818A25A7C85B07C0A8503",
        "work": "ff07d8f0e949e19a"
      },
      "subtype": "send"
    }
  }
}
```

<div class="rpc-tester" data-action="blocks_info">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="blocks_info_hashes">Block Hashes (comma separated):</label>
      <input type="text" id="blocks_info_hashes" value="4CEB66B38A3FCF19EC817143EB291234F2D279CD1651F6DC5812E3FAB5FF84B5, 1DC3395B4CDCA9980851386E34B2081E2886D77E85ABA0A02A92C962080B411B" class="form-input">
    </div>
    <div class="form-group">
      <label for="blocks_info_json_block">JSON Block?</label>
      <select id="blocks_info_json_block" class="form-select">
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### representatives

Returns a list of pairs of representative and its voting weight

**Request:**
```json
{
  "action": "representatives"
}
```

**Response:**
```json
{
  "representatives": {
    "ban_1111111111111111111111111111111111111111111111111111hifc8npp": "3822372327060170000000000000000000000",
    "ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh": "30999999999999999999999999000000"
  }
}
```

<div class="rpc-tester" data-action="representatives">
  <div class="rpc-request-builder">
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### representatives_online

Returns a list of online representative accounts that have voted recently

**Request:**
```json
{
  "action": "representatives_online"
}
```

**Response:**
```json
{
  "representatives": [
    "ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3",
    "ban_1awsn43we17c1oshdru4azeqjz9wii41dy8npubm4rg11so7dx3jtqgoeahy" 
  ]
}
```

<div class="rpc-tester" data-action="representatives_online">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="representatives_online_weight">Weight?</label>
      <select id="representatives_online_weight" class="form-select">
        <option value="false">False</option>
        <option value="true">True</option>
      </select>
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

<style>
.node-selector-container {
  background-color: #2A2A2E;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.rpc-node-selector {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.selector-group {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.node-select {
  flex-grow: 1;
  padding: 10px;
  border-radius: 4px;
  background-color: #3A3A3E;
  color: white;
  border: 1px solid #555;
  font-size: 16px;
  min-width: 250px;
}

.rpc-tester {
  background-color: #2A2A2E;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 10px;
}

.form-input, .form-select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
  font-family: monospace;
}

.response-area {
  padding: 10px;
  background-color: #1E1E1E;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}

.error-message {
  color: #ff5555;
  font-weight: bold;
  margin-top: 5px;
}

.buttona {
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.buttonblue {
  background-color: #4D7EA8;
  color: white;
}

.buttonblue:hover {
  background-color: #3A6A8E;
}

.buttonblue:disabled {
  background-color: #355570;
  cursor: not-allowed;
}
</style>