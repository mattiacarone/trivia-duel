const io = require('socket.io-client');
const http = require('http');

async function runTest() {
  console.log('🧪 Starting Trivia Duel Automated Test Suite...');

  // 1. Test AI Pack API
  const aiPackPromise = new Promise((resolve, reject) => {
    const postData = JSON.stringify({ topic: '80s Rock Bands', mode: 'speed', difficulty: 'casual' });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/generate-pack',
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
        if (json.success && json.pack.questions.length === 5) {
          console.log('✅ AI Pack Generator API verified: 5 questions created on topic "80s Rock Bands"');
          resolve(json.pack);
        } else {
          reject(new Error('AI Pack generation failed'));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
  await aiPackPromise;

  // 2. Test Socket.IO Host Room Creation
  let roomCode = null;
  const host = io('http://localhost:3000');
  
  await new Promise((resolve) => {
    host.emit('host:create_room');
    host.on('host:room_created', (data) => {
      roomCode = data.roomCode;
      console.log(`✅ Host Room created successfully with 4-letter code: "${roomCode}"`);
      console.log(`   Join URL: ${data.playUrl}`);
      console.log(`   QR Code generated: ${data.qrDataUrl.substring(0, 30)}...`);
      resolve();
    });
  });

  // 3. Test Stripe Checkout Simulation API
  const checkoutPromise = new Promise((resolve, reject) => {
    const postData = JSON.stringify({ roomCode, itemType: 'pro_sub', amount: 499 });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/checkout-session',
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
        if (json.success && json.unlocked === 'PRO_HOST') {
          console.log('✅ Stripe Checkout Simulation verified: Pro Host tier instantly activated');
          resolve();
        } else {
          reject(new Error('Checkout failed'));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
  await checkoutPromise;

  // 4. Test Mobile Player Join
  const player = io('http://localhost:3000');
  await new Promise((resolve) => {
    player.emit('player:join_room', {
      roomCode,
      name: 'MobileTester',
      avatar: '🦊'
    });

    player.on('player:joined_success', (data) => {
      console.log(`✅ Player "${data.player.name}" (${data.player.avatar}) joined room "${data.roomCode}" successfully!`);
      resolve();
    });
  });

  // 5. Test Adding Bot
  await new Promise((resolve) => {
    host.emit('host:add_bot', { roomCode });
    host.on('room:players_updated', ({ players, count }) => {
      if (count >= 2) {
        console.log(`✅ AI Bot added! Total players in lobby: ${count}`);
        resolve();
      }
    });
  });

  // 6. Test Start Game & Round Flow
  await new Promise((resolve) => {
    host.emit('host:start_game', { roomCode });
    player.on('round:speed_start', (data) => {
      console.log(`✅ Speed Duel Round 1 started! Question: "${data.question}"`);
      // Submit answer from mobile controller
      player.emit('player:submit_speed_answer', {
        roomCode,
        optionIndex: 0,
        timeRemainingMs: 12000
      });
    });

    host.on('round:speed_result', (result) => {
      console.log(`✅ Question completed! Correct option index: ${result.correctIndex}`);
      console.log(`   Fun fact: "${result.funFact}"`);
      console.log(`   Top player score: ${result.leaderboard[0].name} (${result.leaderboard[0].score} pts)`);
      resolve();
    });
  });

  console.log('\n🎉 ALL TRIVIA DUEL AUTOMATED TESTS PASSED WITH 100% SUCCESS!\n');
  host.disconnect();
  player.disconnect();
  process.exit(0);
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

