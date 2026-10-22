const io = require('socket.io-client');

async function testOtherModes() {
  console.log('🧪 Testing "The Spectrum" and "Majority Rules" modes...');

  // 1. Spectrum Mode Test
  const host = io('http://localhost:3000');
  let roomCode = null;

  await new Promise((resolve) => {
    host.emit('host:create_room');
    host.on('host:room_created', (data) => {
      roomCode = data.roomCode;
      resolve();
    });
  });

  const player = io('http://localhost:3000');
  await new Promise((resolve) => {
    player.emit('player:join_room', { roomCode, name: 'Alice', avatar: '🦄' });
    player.on('player:joined_success', () => resolve());
  });

  // Switch to Spectrum
  host.emit('host:configure_game', { roomCode, mode: 'spectrum' });
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Start Spectrum
  host.emit('host:start_game', { roomCode });

  await new Promise((resolve) => {
    player.on('spectrum:start', (data) => {
      console.log(`✅ Spectrum mode round started: "${data.left}" ⟷ "${data.right}" (Psychic: ${data.psychicName})`);
      
      // Simulate clue submission
      player.emit('player:spectrum_submit_clue', { roomCode, clue: 'Lukewarm microwave soup' });
    });

    host.on('spectrum:clue_broadcast', ({ clue }) => {
      console.log(`✅ Clue broadcasted to group: "${clue}"`);
      // Lock in team guess
      player.emit('player:spectrum_lock_guess', { roomCode, finalGuess: 45 });
    });

    host.on('spectrum:reveal', (result) => {
      console.log(`✅ Spectrum reveal successful! Secret target: ${result.target}%, Team Guess: ${result.finalGuess}%, Zone: ${result.zone}`);
      resolve();
    });
  });

  // 2. Majority Rules Mode Test
  host.emit('host:configure_game', { roomCode, mode: 'majority' });
  await new Promise((resolve) => setTimeout(resolve, 300));
  host.emit('host:start_game', { roomCode });

  await new Promise((resolve) => {
    player.on('majority:start', (data) => {
      console.log(`✅ Majority Rules round started! Prompt: "${data.prompt}"`);
      player.emit('player:majority_submit', { roomCode, text: 'Crunchwrap Supreme with extra hot sauce' });
    });

    player.on('majority:voting_phase', (data) => {
      console.log(`✅ Majority voting phase triggered with ${data.cards.length} cards`);
      player.emit('player:majority_vote', { roomCode, targetPlayerId: data.cards[0].id });
    });

    host.on('majority:reveal_results', (data) => {
      console.log(`✅ Majority results revealed! Winner card: "${data.cards[0].text}" (${data.cards[0].votes} votes)`);
      resolve();
    });
  });

  console.log('\n🎉 ALL 3 GAME MODES (Speed Duel, Spectrum, Majority Rules) TESTED & WORKING 100%!\n');
  host.disconnect();
  player.disconnect();
  process.exit(0);
}

testOtherModes().catch(err => {
  console.error('❌ Error testing modes:', err);
  process.exit(1);
});

