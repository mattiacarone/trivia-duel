const io = require('socket.io-client');
const http = require('http');

async function testProductionFeatures() {
  console.log('🚀 Running Production Suite Tests (Licensing, Printables, Reconnect, Lifelines, XSS)...');

  // 1. Host creates room
  const host = io('http://localhost:3000');
  let roomCode = null;

  await new Promise((resolve) => {
    host.emit('host:create_room');
    host.on('host:room_created', (data) => {
      roomCode = data.roomCode;
      console.log(`✅ Host room created: ${roomCode}`);
      resolve();
    });
  });

  // 2. Test VIP License Key Activation API
  await new Promise((resolve, reject) => {
    const postData = JSON.stringify({ roomCode, licenseKey: 'PRO-PARTY-2026' });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/activate-license',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.success && json.isProHost && json.unlockedPacks.length >= 9) {
          console.log(`✅ VIP License Key activated! Unlocked ${json.unlockedPacks.length} packs & Pro tier`);
          resolve();
        } else {
          reject(new Error(`License activation failed: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  // 3. Test Printable Party Kit PDF Generator endpoint
  await new Promise((resolve, reject) => {
    http.get(`http://localhost:3000/api/printable-kit/${roomCode}`, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && html.toLowerCase().includes('printable party pack') && html.includes(roomCode)) {
          console.log('✅ Printable Party Kit endpoint generated print-ready HTML flashcards & scorecards');
          resolve();
        } else {
          reject(new Error(`Printable kit check failed: status ${res.statusCode}, length: ${html.length}`));
        }
      });
    }).on('error', reject);
  });

  // 4. Test Player Join with XSS protection and Session Token
  const player1 = io('http://localhost:3000');
  let playerToken = null;
  let playerId = null;

  await new Promise((resolve) => {
    player1.emit('player:join_room', {
      roomCode,
      name: '<script>alert("hacked")</script>Sam',
      avatar: '🦊'
    });

    player1.on('player:joined_success', (data) => {
      playerToken = data.playerToken;
      playerId = data.player.id;
      if (data.player.name.includes('&lt;script&gt;')) {
        console.log(`✅ XSS Injection sanitized cleanly: "${data.player.name}"`);
      }
      if (playerToken) {
        console.log(`✅ Player session token issued: ${playerToken.substring(0, 16)}...`);
      }
      resolve();
    });
  });

  // 5. Test Player Disconnect & Reconnection Recovery Flow
  player1.disconnect();
  console.log('ℹ️ Simulating phone lock / network sleep (disconnect)...');
  await new Promise(r => setTimeout(r, 600));

  const player1Reconnected = io('http://localhost:3000');
  await new Promise((resolve, reject) => {
    player1Reconnected.emit('player:reconnect', {
      roomCode,
      playerToken
    });

    player1Reconnected.on('player:reconnected_success', (data) => {
      if (data.playerToken === playerToken && data.player.name.includes('&lt;script&gt;')) {
        console.log(`✅ Session successfully restored for player "${data.player.name}" after disconnect!`);
        resolve();
      } else {
        reject(new Error(`Session recovery returned unexpected player token or profile: name=${data?.player?.name}`));
      }
    });

    player1Reconnected.on('player:reconnect_failed', (err) => {
      reject(new Error(`Reconnect failed: ${err.message}`));
    });
  });

  // 6. Test Lifeline Power-up in Speed Mode
  host.emit('host:start_game', { roomCode });

  await new Promise((resolve, reject) => {
    player1Reconnected.on('round:speed_start', (roundData) => {
      console.log(`✅ Speed round started for lifeline test. Question: "${roundData.question}"`);
      // Use 50:50 Lifeline
      player1Reconnected.emit('player:use_lifeline', {
        roomCode,
        lifelineType: 'fiftyFifty'
      });
    });

    player1Reconnected.on('player:lifeline_fifty_fifty', (data) => {
      if (Array.isArray(data.eliminatedIndices) && data.eliminatedIndices.length === 2) {
        console.log(`✅ 50:50 Lifeline successfully eliminated wrong options: [${data.eliminatedIndices.join(', ')}]`);
        resolve();
      } else {
        reject(new Error('Invalid fifty fifty response'));
      }
    });
  });

  console.log('\n🎉 ALL PRODUCTION SUITE VERIFICATIONS PASSED WITH 100% SUCCESS!\n');
  host.disconnect();
  player1Reconnected.disconnect();
  process.exit(0);
}

testProductionFeatures().catch((err) => {
  console.error('❌ Production test failure:', err);
  process.exit(1);
});
