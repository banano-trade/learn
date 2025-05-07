---
layout: post
title: Banano WebSocket Documentation
date: 2025-05-07
category: docs
head_scripts:
  - "/assets/js/websocket-tester.js"
---

<div class="node-selector-container">
  <h2>Banano WebSocket Protocol</h2>
  
  <p>The WebSocket protocol allows for real-time notifications from Banano nodes. This is useful for applications that need to monitor events such as block confirmations, votes, and other network activity without repeatedly polling RPC endpoints.</p>
  
  <div class="websocket-selector">
    <div class="selector-group">
      <label for="websocket-url"><strong>Select WebSocket Server:</strong></label>
      <select id="websocket-url" class="node-select">
        <option value="wss://ws.banano.trade">ws.banano.trade</option>
        <option value="custom">Custom URL...</option>
      </select>
    </div>
    <div id="custom-ws-container" style="display:none; margin-top: 10px;">
      <input type="text" id="custom-ws-url" placeholder="Enter custom WebSocket URL" class="form-input">
      <button id="custom-ws-save" class="buttona buttonblue">Save</button>
    </div>
    <div id="websocket-status" class="websocket-status" style="margin-top: 10px;">
      WebSocket Status: <span id="ws-status-text">Disconnected</span>
      <button id="ws-connect" class="buttona buttonblue">Connect</button>
      <button id="ws-disconnect" class="buttona buttonred" style="display: none;">Disconnect</button>
    </div>
  </div>
</div>

This page covers the following sections:

| Section | Purpose |
|---------|---------|
| **WebSocket Concepts** | Core concepts and standard message formats |
| **Available Topics** | Detailed documentation on all available subscription topics |
| **Interactive Tester** | Tool to test WebSocket connections and subscriptions |

## WebSocket Tester

This interactive tool allows you to test WebSocket functionality directly in your browser.

<div class="websocket-tester">
  <div class="ws-connection-status">
    <div class="form-group">
      <label for="ws-message-type">Message Type:</label>
      <select id="ws-message-type" class="form-select">
        <option value="subscribe">Subscribe</option>
        <option value="unsubscribe">Unsubscribe</option>
        <option value="ping">Ping (Keepalive)</option>
        <option value="update">Update Subscription</option>
        <option value="custom">Custom Message</option>
      </select>
    </div>
    
    <div id="ws-subscribe-options" class="ws-message-options">
      <div class="form-group">
        <label for="ws-topic">Topic:</label>
        <select id="ws-topic" class="form-select">
          <option value="confirmation">Confirmation</option>
          <option value="vote">Vote</option>
          <option value="active_difficulty">Active Difficulty</option>
          <option value="work">Work Generation</option>
          <option value="bootstrap">Bootstrap</option>
          <option value="telemetry">Telemetry</option>
          <option value="new_unconfirmed_block">New Unconfirmed Block</option>
          <option value="stopped_election">Stopped Election</option>
          <option value="started_election">Started Election</option>
        </select>
      </div>
      
      <div id="ws-confirmation-options" class="ws-topic-options">
        <div class="form-group">
          <label for="ws-confirmation-type">Confirmation Type:</label>
          <select id="ws-confirmation-type" class="form-select">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="active_quorum">Active Quorum</option>
            <option value="active_confirmation_height">Active Confirmation Height</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="ws-include-block">Include Block:</label>
          <select id="ws-include-block" class="form-select">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="ws-include-election-info">Include Election Info:</label>
          <select id="ws-include-election-info" class="form-select">
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="ws-include-sideband-info">Include Sideband Info:</label>
          <select id="ws-include-sideband-info" class="form-select">
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="ws-accounts">Accounts (comma separated):</label>
          <input type="text" id="ws-accounts" class="form-input" placeholder="ban_1abc..., ban_2def...">
        </div>
        
        <div class="form-group">
          <label for="ws-all-local-accounts">Include All Local Accounts:</label>
          <select id="ws-all-local-accounts" class="form-select">
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
      </div>
      
      <div id="ws-vote-options" class="ws-topic-options" style="display: none;">
        <div class="form-group">
          <label for="ws-representatives">Representatives (comma separated):</label>
          <input type="text" id="ws-representatives" class="form-input" placeholder="ban_1abc..., ban_2def...">
        </div>
        
        <div class="form-group">
          <label for="ws-include-replays">Include Replays:</label>
          <select id="ws-include-replays" class="form-select">
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="ws-include-indeterminate">Include Indeterminate:</label>
          <select id="ws-include-indeterminate" class="form-select">
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
      </div>
    </div>
    
    <div id="ws-update-options" class="ws-message-options" style="display: none;">
      <div class="form-group">
        <label for="ws-update-topic">Topic to Update:</label>
        <select id="ws-update-topic" class="form-select">
          <option value="confirmation">Confirmation</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="ws-accounts-add">Accounts to Add (comma separated):</label>
        <input type="text" id="ws-accounts-add" class="form-input" placeholder="ban_1abc..., ban_2def...">
      </div>
      
      <div class="form-group">
        <label for="ws-accounts-del">Accounts to Remove (comma separated):</label>
        <input type="text" id="ws-accounts-del" class="form-input" placeholder="ban_1abc..., ban_2def...">
      </div>
    </div>
    
    <div id="ws-custom-message" class="ws-message-options" style="display: none;">
      <div class="form-group">
        <label for="ws-custom-json">Custom JSON Message:</label>
        <textarea id="ws-custom-json" class="form-textarea" rows="5" placeholder='{"action": "subscribe", "topic": "confirmation"}'></textarea>
      </div>
    </div>
    
    <div class="button-row">
      <button id="ws-send-message" class="buttona buttonblue" disabled>Send Message</button>
      <button id="ws-clear-log" class="buttona buttonred">Clear Log</button>
    </div>
  </div>
  
  <div class="ws-message-log">
    <h4>WebSocket Log:</h4>
    <div id="ws-log" class="ws-log-area"></div>
  </div>
</div>

## WebSocket Concepts

WebSockets enable real-time communication between clients and Banano nodes, allowing applications to receive immediate notifications about network events without polling.

### Standard Message Format

All messages sent to and received from the WebSocket server use JSON format.

### Acknowledgement

All WebSocket actions can optionally request an acknowledgement by including the `ack` field:

```json
{
  "action": "subscribe",
  "topic": "confirmation",
  "ack": true,
  "id": "<optional unique id>"
}
```

If the action succeeds, the following message will be sent back:

```json
{
  "ack": "subscribe",
  "time": "<milliseconds since epoch>",
  "id": "<optional unique id>"
}
```

### Keepalive

Keepalive allows checking the liveliness of the WebSocket without refreshing it or changing a subscription:

```json
{
  "action": "ping"
}
```

The expected response is:

```json
{
  "ack": "pong",
  "time": "<milliseconds since epoch>"
}
```

### Subscribe/Unsubscribe

To receive notifications through the WebSocket, you must subscribe to a specific topic:

```json
{
  "action": "subscribe",
  "topic": "confirmation"
}
```

To unsubscribe:

```json
{
  "action": "unsubscribe",
  "topic": "confirmation"
}
```

### Update

Some subscriptions can be updated without requiring unsubscribing and re-subscribing:

```json
{
  "action": "update",
  "topic": "confirmation",
  "options": {
    // Topic-specific options here
  }
}
```

## Available Topics

### Confirmations

Subscribe to all confirmed blocks:

```json
{
  "action": "subscribe",
  "topic": "confirmation"
}
```

#### Filtering Options

**Confirmation types:**

The node classifies block confirmations into categories:
- Active quorum: a block confirmed through voting
- Active confirmation height: a block confirmed as a dependent election
- Inactive: a block implicitly confirmed by a successor

Filter by confirmation type:

```json
{
  "action": "subscribe",
  "topic": "confirmation",
  "options": {
    "confirmation_type": "<type>"
  }
}
```

Common values for `confirmation_type` are `all` (default), `active`, and `inactive`.

**Account filtering:**

```json
{
  "action": "subscribe",
  "topic": "confirmation",
  "options": {
    "all_local_accounts": true,
    "accounts": [
      "ban_16c4ush661bbn2hxc6iqrunwoyqt95in4hmw6uw7tk37yfyi77s7dyxaw8ce",
      "ban_3dmtrrws3pocycmbqwawk6xs7446qxa36fcncush4s1pejk16ksbmakis32c"
    ]
  }
}
```

When `all_local_accounts` is set to true, blocks that mention accounts in any wallet will be broadcasted.

**Updating the list of accounts:**

```json
{
  "action": "update",
  "topic": "confirmation",
  "options": {
    "accounts_add": [
      "ban_1new1account1to1track111111111111111111111111111111111111111"
    ],
    "accounts_del": [
      "ban_1remove1account1from1tracking111111111111111111111111111111111"
    ]
  }
}
```

#### Response Options

**Block content inclusion:**

```json
{
  "action": "subscribe",
  "topic": "confirmation",
  "options": {
    "include_block": "false"
  }
}
```

**Election info:**

```json
{
  "action": "subscribe",
  "topic": "confirmation",
  "options": {
    "include_election_info": "true"
  }
}
```

**Sideband info:**

```json
{
  "action": "subscribe",
  "topic": "confirmation",
  "options": {
    "include_sideband_info": "true"
  }
}
```

#### Sample Results

```json
{
  "topic": "confirmation",
  "time": "1564935350664",
  "message": {
    "account": "ban_1tgkjkq9r96zd3pkr7edj8e4qbu3wr3ps6ettzse8hmoa37nurua7faupjhc",
    "amount": "15621963968634827029081574961",
    "hash": "0E889F83E28152A70E87B92D846CA3D8966F3AEEC65E11B25F7B4E6760C57CA3",
    "confirmation_type": "active_quorum",
    "election_info": {
      "duration": "546",
      "time": "1564935348219",
      "tally": "42535295865117307936387010521258262528",
      "request_count": "1",
      "blocks": "1",
      "voters": "52"
    },
    "block": {
      "type": "state",
      "account": "ban_1tgkjkq9r96zd3pkr7edj8e4qbu3wr3ps6ettzse8hmoa37nurua7faupjhc",
      "previous": "4E9003ABD469D1F58A70518234016797FA654B494A2627B8583052629A91689E",
      "representative": "ban_3rw4un6ys57hrb39sy1qx8qy5wukst1iiponztrz9qiz6qqa55kxzx4491or",
      "balance": "0",
      "link": "3098F4C0D1D8BD889AF078CDFF81E982B8EFA6D6D8FAE954CF0CDC7A256C3F8B",
      "link_as_account": "ban_1e6rym1f5p7xj4fh1y8fzy1ym1orxymffp9tx7cey58whakprhwdzuk533th",
      "signature": "D5C332587B1A4DEA35B6F03B0A9BEB45C5BBE582060B0252C313CF411F72478721F8E7DA83A779BA5006D571266F32BDE34C1447247F417F8F12101D3ADAF705",
      "work": "c950fc037d61e372",
      "subtype": "send"
    }
  }
}
```

### Votes

Subscribe to all votes notifications:

```json
{
  "action": "subscribe",
  "topic": "vote"
}
```

#### Filtering Options

**Representatives:**

```json
{
  "action": "subscribe",
  "topic": "vote",
  "options": {
    "representatives": [
      "ban_16c4ush661bbn2hxc6iqrunwoyqt95in4hmw6uw7tk37yfyi77s7dyxaw8ce",
      "ban_3dmtrrws3pocycmbqwawk6xs7446qxa36fcncush4s1pejk16ksbmakis32c"
    ]
  }
}
```

**Vote type:**

Votes are one of three types:
- `replay`: if this exact vote had been seen before
- `vote`: if it is the first time the vote has been seen
- `indeterminate`: when it cannot be determined due to lack of an associated election

By default, only `vote` type votes are broadcasted. To enable other types:

```json
{
  "action": "subscribe",
  "topic": "vote",
  "options": {
    "include_replays": "true",
    "include_indeterminate": "true"
  }
}
```

#### Sample Results

```json
{
  "topic": "vote",
  "time": "1554995525343",
  "message": {
    "account": "ban_1n5aisgwmq1oibg8c7aerrubboccp3mfcjgm8jaas1fwhxmcndaf4jrt75fy",
    "signature": "1950700796914893705657789944906107642480343124305202910152471520450456881722545967829502369630995363643731706156278026749554294222131169148120786048025353",
    "sequence": "855471574",
    "timestamp": "1554995525138",
    "blocks": [
      "6FB9DE5D7908DEB8A2EA391AEA95041587CBF3420EF8A606F1489FECEE75C869"
    ],
    "type": "replay"
  }
}
```

### Stopped Elections

Subscribe to stopped elections notifications:

```json
{
  "action": "subscribe",
  "topic": "stopped_election"
}
```

#### Sample Results

```json
{
  "topic": "stopped_election",
  "time": "1560437195533",
  "message": {
    "hash": "FA6D344ECAB2C5E1C04E62B2BC6EE072938DD47530AB26E0D5A9A384302FBEB3"
  }
}
```

### Started Elections

Subscribe to started elections notifications:

```json
{
  "action": "subscribe",
  "topic": "started_election"
}
```

#### Sample Results

```json
{
  "topic": "started_election",
  "time": "1674765709226",
  "message": {
    "hash": "FD8639F0AD19895B1A3A430DD5B4DCA5A2F713E7DD1CC8DCD5E90D5AE2BCA835"
  }
}
```

### Active Difficulty

Subscribe to active difficulty notifications:

```json
{
  "action": "subscribe",
  "topic": "active_difficulty"
}
```

#### Sample Results

```json
{
  "topic": "active_difficulty",
  "time": "1561661736065",
  "message": {
    "multiplier": "1.5",
    "network_current": "fffffffaaaaaaaab",
    "network_minimum": "fffffff800000000",
    "network_receive_current": "fffffff07c1f07c2",
    "network_receive_minimum": "fffffe0000000000"
  }
}
```

### Proof of Work

Subscribe to PoW generation notifications:

```json
{
  "action": "subscribe",
  "topic": "work"
}
```

#### Sample Results (successful work generation)

```json
{
  "success": "true",
  "reason": "",
  "duration": "306",
  "request": {
    "hash": "3ECE2684044C0EAF2CA6B1C72F11AFC5B5A75C00CFF993FB17B6E75F78ABF175",
    "difficulty": "ffffff999999999a",
    "multiplier": "10.000000000009095",
    "version": "work_1"
  },
  "result": {
    "source": "192.168.1.101:7000",
    "work": "4352c6e222703c57",
    "difficulty": "ffffffd2ca03b921",
    "multiplier": "22.649415016750655"
  },
  "bad_peers": ""
}
```

### Node Telemetry

Subscribe to telemetry response notifications:

```json
{
  "action": "subscribe",
  "topic": "telemetry"
}
```

#### Sample Results

```json
{
  "topic": "telemetry",
  "time": "1594654710305",
  "message": {
    "block_count": "51571901",
    "cemented_count": "51571901",
    "unchecked_count": "0",
    "account_count": "1376750",
    "bandwidth_cap": "10485760",
    "peer_count": "261",
    "protocol_version": "18",
    "uptime": "1223618",
    "genesis_block": "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
    "major_version": "21",
    "minor_version": "0",
    "patch_version": "0",
    "pre_release_version": "0",
    "maker": "0",
    "timestamp": "1594654710521",
    "active_difficulty": "ffffffc000000000",
    "node_id": "node_3cczh431wuh5gg64jen6a658xewpx7eiyfqn7f8gpdcfp786s7xdb51kr1rp",
    "signature": "C9429FBC069F15E9AE552FB80500B4BA0F0CF2E25DD6C6D2018FA1D96DC4353A75E4A86872E54E7B2BFF06526719076E792DA3C83F1B2FD40244804EAC324C00",
    "address": "::ffff:139.180.168.194",
    "port": "7075"
  }
}
```

### New Unconfirmed Blocks

Subscribe to new unconfirmed block notifications:

```json
{
  "action": "subscribe",
  "topic": "new_unconfirmed_block"
}
```

**Important Note:** Blocks received through this WebSocket should not be used for tracking confirmations, as they are unconfirmed and could be replaced by a conflicting block.

#### Sample Results

```json
{
  "topic": "new_unconfirmed_block",
  "time": "1587109495082",
  "message": {
    "type": "state",
    "account": "ban_1unw379kgu1iub1caswn5khfk4b6tzinku8ww7uds9z7nwubj3dgt6yzjpiw",
    "previous": "A01B96AFE86DC82FECD13F8C3A4F1AC779DCDAF60166F94F1A2CD3987F4609F0",
    "representative": "ban_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou",
    "balance": "2345399869764044123018481994",
    "link": "E0049F6D5D5661A714D8928D287285A0105B07720661F8C8B1FC8EE5B15FC067",
    "link_as_account": "ban_3r16mxpotom3nwcfj6nf73sada1ide5q63m3z56d5z6gwprozi59ocyuoxc1",
    "signature": "7BDD77BE14552263F9AF5130229A3BBB9038EE4B9C29E66D3D58280EF43B7FAF2DBC7070BD9CA39C844B7068E3AF40B04CE1D5CEEEA142C8FE20EE091A3C320E",
    "work": "8ebdd4aa0bf1263e",
    "subtype": "receive"
  }
}
```

### Bootstrap

Subscribe to bootstrap attempts start/exit notifications:

```json
{
  "action": "subscribe",
  "topic": "bootstrap"
}
```

#### Sample Results

Bootstrap started:
```json
{
  "topic": "bootstrap",
  "time": "1561661740065",
  "message": {
    "reason": "started",
    "id": "C9FF2347C4DF512A7F6B514CC4A0F79A",
    "mode": "legacy"
  }
}
```

Bootstrap exited:
```json
{
  "topic": "bootstrap",
  "time": "1561661740565",
  "message": {
    "reason": "exited",
    "id": "C9FF2347C4DF512A7F6B514CC4A0F79A",
    "mode": "legacy",
    "total_blocks": "1000000",
    "duration": "500"
  }
}
```

## Implementation Examples

### JavaScript (Browser)

```javascript
// Initialize WebSocket connection
const ws = new WebSocket('wss://ws.banano.trade');

// Connection opened
ws.addEventListener('open', (event) => {
  console.log('Connected to Banano WebSocket server');
  
  // Subscribe to confirmations
  const subscribeMsg = {
    action: 'subscribe',
    topic: 'confirmation'
  };
  
  ws.send(JSON.stringify(subscribeMsg));
});

// Listen for messages
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
  
  // Process confirmation data
  if (data.topic === 'confirmation') {
    const block = data.message.block;
    console.log(`New confirmed block for ${block.account}`);
    console.log(`Amount: ${data.message.amount}`);
    console.log(`Block type: ${block.subtype || 'change'}`);
  }
});

// Connection closed
ws.addEventListener('close', (event) => {
  console.log('Disconnected from Banano WebSocket server');
});

// Handle errors
ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});
```

### Node.js

```javascript
const WebSocket = require('ws');

// Initialize WebSocket connection
const ws = new WebSocket('wss://ws.banano.trade');

// Connection opened
ws.on('open', () => {
  console.log('Connected to Banano WebSocket server');
  
  // Subscribe to specific account confirmations
  const subscribeMsg = {
    action: 'subscribe',
    topic: 'confirmation',
    options: {
      accounts: [
        'ban_1youraccount111111111111111111111111111111111111111111111111111',
        'ban_3anotheraccount1111111111111111111111111111111111111111111111111'
      ]
    }
  };
  
  ws.send(JSON.stringify(subscribeMsg));
});

// Listen for messages
ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received:', message);
  
  // Process based on topic
  switch (message.topic) {
    case 'confirmation':
      handleConfirmation(message.message);
      break;
    case 'vote':
      handleVote(message.message);
      break;
    // Add handlers for other topics
  }
});

function handleConfirmation(data) {
  console.log(`Block confirmed: ${data.hash}`);
  console.log(`Account: ${data.account}`);
  console.log(`Amount: ${data.amount}`);
}

function handleVote(data) {
  console.log(`Vote from: ${data.account}`);
  console.log(`Voted for blocks: ${data.blocks.join(', ')}`);
}

// Handle connection close
ws.on('close', () => {
  console.log('Disconnected from Banano WebSocket server');
});

// Handle errors
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

## Best Practices

### Connection Management

1. **Reconnection Strategy**: Implement exponential backoff when reconnecting after connection loss
2. **Heartbeat Monitoring**: Use the ping/pong mechanism to detect stale connections
3. **Connection Pooling**: For high-volume applications, consider using multiple connections

### Subscription Management

1. **Filter Appropriately**: Only subscribe to topics and accounts you need to monitor
2. **Batch Updates**: Use the update mechanism to modify subscriptions in batches
3. **Handle Acknowledgements**: Set `ack: true` for critical subscriptions to ensure they're processed

### Processing Data

1. **Message Queuing**: Buffer WebSocket messages to avoid overwhelming your application
2. **Idempotent Processing**: Handle duplicate messages gracefully (especially for votes and confirmations)
3. **Validation**: Always validate received data before processing

## Common Use Cases

### Wallet Balance Monitoring

Track balance changes for specific accounts in real-time:

```javascript
// Subscribe to confirmations for specific accounts
const subscribeMsg = {
  action: 'subscribe',
  topic: 'confirmation',
  options: {
    accounts: [
      'ban_1youraccount111111111111111111111111111111111111111111111111111'
    ]
  }
};

// Process incoming confirmations
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.topic === 'confirmation') {
    updateAccountBalance(data.message.account, data.message.amount);
  }
});
```

### Payment Processing

Detect incoming payments to your Banano address:

```javascript
// Process incoming confirmations
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.topic === 'confirmation' && 
      data.message.block.subtype === 'receive' && 
      data.message.block.account === 'ban_1yourpaymentaddress1111111111111111111111111111111111111') {
    
    // Process payment
    handlePayment(data.message.amount, data.message.hash);
  }
});
```

### Block Explorer

Track new blocks, votes, and elections in real-time:

```javascript
// Subscribe to multiple topics
const topics = ['confirmation', 'new_unconfirmed_block', 'vote', 'started_election'];

topics.forEach(topic => {
  ws.send(JSON.stringify({
    action: 'subscribe',
    topic: topic
  }));
});

// Process various events
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.topic) {
    case 'confirmation':
      updateConfirmedBlock(data.message);
      break;
    case 'new_unconfirmed_block':
      updateUnconfirmedBlock(data.message);
      break;
    case 'vote':
      updateVoteStats(data.message);
      break;
    case 'started_election':
      updateElectionStatus(data.message);
      break;
  }
});
```

<style>
.node-selector-container {
  background-color: #2A2A2E;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.websocket-selector {
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

.websocket-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

#ws-status-text {
  font-weight: bold;
  color: #ff5555;
}

.websocket-tester {
  background-color: #2A2A2E;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ws-connection-status, .ws-message-log {
  width: 100%;
}

.ws-log-area {
  height: 300px;
  background-color: #1E1E1E;
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;
  font-family: monospace;
  white-space: pre-wrap;
  color: #E0E0E0;
  border-left: 3px solid #4CBF4B;
}

.ws-message {
  margin-bottom: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #444;
}

.ws-outgoing {
  color: #4CBF4B;
}

.ws-incoming {
  color: #FBDD11;
}

.ws-error {
  color: #ff5555;
}

.ws-connection {
  color: #4f9cff;
}

.form-textarea {
  width: 100%;
  height: 100px;
  font-family: monospace;
  padding: 8px;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
  resize: vertical;
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

.buttonred {
  background-color: #A84D4D;
  color: white;
}

.buttonred:hover {
  background-color: #8E3A3A;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
</style>