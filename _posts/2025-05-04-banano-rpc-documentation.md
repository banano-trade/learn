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
    <label for="rpc-node-url"><strong>Select RPC Node:</strong></label>
    <select id="rpc-node-url">
      <option value="https://api.banano.trade/proxy">api.banano.trade/proxy</option>
      <option value="https://public.node.jungletv.live/rpc">public.node.jungletv.live/rpc</option>
      <option value="custom">Custom URL...</option>
    </select>
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
| **Unit Conversion RPCs** | For converting different units to and from raw. |

## Node RPCs

**Unconfirmed blocks returned**

Unless otherwise specified, RPC calls can return unconfirmed blocks and related details. In the most important cases where balances or similar details may include unconfirmed amounts, additional warnings have been included.

### account_balance

Returns how many RAW is owned and how many have not yet been received by **account**

**Request:**
```json
{
  "action": "account_balance",
  "account": "ban_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000"
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
      <input type="text" id="account_balance_account" placeholder="ban_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000" class="form-input">
    </div>
    <div class="form-group">
      <label for="account_balance_confirmed">Include only confirmed?</label>
      <select id="account_balance_confirmed" class="form-select">
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
  "account": "ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3"
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
      <input type="text" id="account_block_count_account" placeholder="ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3" class="form-input">
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
      <input type="text" id="account_get_key" placeholder="3068BB1CA04525BB0E416C485FE6A67FD52540227D267CC8B6E8DA958A7FA039" class="form-input">
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
  "account": "ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh",
  "count": "10"
}
```

**Response:**
```json
{
  "account": "ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh",
  "history": [
    {
      "type": "send",
      "account": "ban_38dzqpPXjaAytRjEBJGDpdKSWoJm1iKJREkDqdqJc8c3RJxA8yNMEm3bpsS",
      "amount": "100000000000000000000000000000",
      "local_timestamp": "1611671570",
      "height": "564",
      "hash": "4C1969CA6D313C8D3129EC3761120B8CA9A3B327BC4D08FC8E976C5F6954C590"
    }
  ],
  "previous": "8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72"
}
```

<div class="rpc-tester" data-action="account_history">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="account_history_account">Account:</label>
      <input type="text" id="account_history_account" placeholder="ban_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkk5jhd9gt9d4u5hxfq_pwfh" class="form-input">
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
  "account": "ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3"
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
      <input type="text" id="account_info_account" placeholder="ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3" class="form-input">
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
      <input type="text" id="account_key_account" placeholder="ban_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx" class="form-input">
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
  "account": "ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3"
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
      <input type="text" id="account_representative_account" placeholder="ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3" class="form-input">
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
  "accounts": ["ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3", "ban_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs"]
}
```

**Response:**
```json
{
  "balances": {
    "ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3": {
      "balance": "325586539664609129644855132177",
      "pending": "2309370929000000000000000000000000",
      "receivable": "2309370929000000000000000000000000"
    },
    "ban_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs": {
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
      <input type="text" id="accounts_balances_accounts" placeholder="ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3, ban_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs" class="form-input">
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
  "accounts": ["ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3", "ban_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs"]
}
```

**Response:**
```json
{
  "frontiers": {
    "ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3": "791AF413173EEE674A6FCF633B5DFC0F3C33F397F0DA08E987D9E0741D40D81A",
    "ban_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs": "6A32E2F2E2A14BA6815D52D0F523C2302F8BC3E34196E52E33CB9E86172D5E26"
  }
}
```

<div class="rpc-tester" data-action="accounts_frontiers">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="accounts_frontiers_accounts">Accounts (comma separated):</label>
      <input type="text" id="accounts_frontiers_accounts" placeholder="ban_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3, ban_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs" class="form-input">
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
  "hash": "87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9"
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
      <input type="text" id="block_info_hash" placeholder="87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9" class="form-input">
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
  "hashes": ["87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9"]
}
```

**Response:**
```json
{
  "blocks": {
    "87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9": {
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
  }
}
```

<div class="rpc-tester" data-action="blocks_info">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="blocks_info_hashes">Block Hashes (comma separated):</label>
      <input type="text" id="blocks_info_hashes" placeholder="87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9" class="form-input">
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

## Wallet RPCs

### wallet_create

Creates a new random wallet id

**Request:**
```json
{
  "action": "wallet_create"
}
```

**Response:**
```json
{
  "wallet": "000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F"
}
```

<div class="rpc-tester" data-action="wallet_create">
  <div class="rpc-request-builder">
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### wallet_balance_total

Returns the sum of all balances of the accounts in **wallet**

**Request:**
```json
{
  "action": "wallet_balance_total",
  "wallet": "000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F"
}
```

**Response:**
```json
{
  "balance": "10000",
  "pending": "0",
  "receivable": "0"
}
```

<div class="rpc-tester" data-action="wallet_balance_total">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="wallet_balance_total_wallet">Wallet ID:</label>
      <input type="text" id="wallet_balance_total_wallet" placeholder="000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

## Unit Conversion RPCs

### ban_to_raw

Multiplies an amount by the BANANO RAW ratio

**Request:**
```json
{
  "action": "ban_to_raw",
  "amount": "1"
}
```

**Response:**
```json
{
  "amount": "100000000000000000000000000000"
}
```

<div class="rpc-tester" data-action="ban_to_raw">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="ban_to_raw_amount">Amount (BAN):</label>
      <input type="text" id="ban_to_raw_amount" placeholder="1" class="form-input">
    </div>
    <button class="buttona buttonblue send-request">Send Request</button>
  </div>
  <div class="rpc-results" style="display:none;">
    <h4>Response:</h4>
    <pre class="response-area"></pre>
  </div>
</div>

### raw_to_ban

Divides an amount by the BANANO RAW ratio

**Request:**
```json
{
  "action": "raw_to_ban",
  "amount": "100000000000000000000000000000"
}
```

**Response:**
```json
{
  "amount": "1"
}
```

<div class="rpc-tester" data-action="raw_to_ban">
  <div class="rpc-request-builder">
    <div class="form-group">
      <label for="raw_to_ban_amount">Amount (RAW):</label>
      <input type="text" id="raw_to_ban_amount" placeholder="100000000000000000000000000000" class="form-input">
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
}

.rpc-node-selector {
  margin-top: 20px;
  margin-bottom: 20px;
}

.rpc-tester {
  background-color: #2A2A2E;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
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
</style>