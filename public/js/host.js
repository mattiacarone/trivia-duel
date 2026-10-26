// Host Game Board Orchestrator & State Machine
const socket = io();

// State Variables
let roomCode = null;
let currentMode = 'speed';
let activePackId = 'starter';
let allPacks = {};
let unlockedPacks = ['starter'];
let isProHost = false;
let currentTimerInterval = null;
let secondsRemaining = 15;
let generatedAiPack = null;

// DOM Elements Cache
const elements = {
  // Top bar
  displayRoomCode: document.getElementById('displayRoomCode'),
  qrRoomCode: document.getElementById('qrRoomCode'),
  btnCopyLink: document.getElementById('btnCopyLink'),
  playerCount: document.getElementById('playerCount'),
  playerLimitLabel: document.getElementById('playerLimitLabel'),
  proBadge: document.getElementById('proBadge'),
  btnSoundToggle: document.getElementById('btnSoundToggle'),
  btnOpenAiStudio: document.getElementById('btnOpenAiStudio'),
  btnOpenStore: document.getElementById('btnOpenStore'),
  btnToggleSim: document.getElementById('btnToggleSim'),
  simDock: document.getElementById('simDock'),
  simIframe: document.getElementById('simIframe'),
  btnCloseSim: document.getElementById('btnCloseSim'),

  // Stage containers
  stageLobby: document.getElementById('stageLobby'),
  stageSpeedQuestion: document.getElementById('stageSpeedQuestion'),
  stageSpeedResult: document.getElementById('stageSpeedResult'),
  stageSpectrum: document.getElementById('stageSpectrum'),
  stageMajority: document.getElementById('stageMajority'),
  stagePodium: document.getElementById('stagePodium'),

  // Lobby elements
  qrCodeImg: document.getElementById('qrCodeImg'),
  joinUrlText: document.getElementById('joinUrlText'),
  playersGrid: document.getElementById('playersGrid'),
  rosterCount: document.getElementById('rosterCount'),
  btnAddBot: document.getElementById('btnAddBot'),
  btnAddThreeBots: document.getElementById('btnAddThreeBots'),
  btnStartGame: document.getElementById('btnStartGame'),
  modeCards: document.querySelectorAll('.mode-card'),
  packIcon: document.getElementById('packIcon'),
  packTitle: document.getElementById('packTitle'),
  packCategory: document.getElementById('packCategory'),
  packStatusBadge: document.getElementById('packStatusBadge'),
  btnBrowsePacks: document.getElementById('btnBrowsePacks'),

  // Speed Mode elements
  speedRoundCounter: document.getElementById('speedRoundCounter'),
  speedPackName: document.getElementById('speedPackName'),
  speedQuestionText: document.getElementById('speedQuestionText'),
  timerSeconds: document.getElementById('timerSeconds'),
  timerCircle: document.getElementById('timerCircle'),
  speedAnswerCount: document.getElementById('speedAnswerCount'),
  optText0: document.getElementById('optText0'),
  optText1: document.getElementById('optText1'),
  optText2: document.getElementById('optText2'),
  optText3: document.getElementById('optText3'),

  // Speed Result elements
  resultQuestionTitle: document.getElementById('resultQuestionTitle'),
  resultWinningText: document.getElementById('resultWinningText'),
  resultFunFact: document.getElementById('resultFunFact'),
  countOpt0: document.getElementById('countOpt0'),
  countOpt1: document.getElementById('countOpt1'),
  countOpt2: document.getElementById('countOpt2'),
  countOpt3: document.getElementById('countOpt3'),
  speedLeaderboardList: document.getElementById('speedLeaderboardList'),
  btnNextRound: document.getElementById('btnNextRound'),

  // The Spectrum elements
  spectrumRoundCounter: document.getElementById('spectrumRoundCounter'),
  spectrumCategoryLabel: document.getElementById('spectrumCategoryLabel'),
  spectrumLeftLabel: document.getElementById('spectrumLeftLabel'),
  spectrumRightLabel: document.getElementById('spectrumRightLabel'),
  spectrumPsychicStatus: document.getElementById('spectrumPsychicStatus'),
  spectrumClueDisplay: document.getElementById('spectrumClueDisplay'),
  spectrumTrack: document.getElementById('spectrumTrack'),
  spectrumTeamDial: document.getElementById('spectrumTeamDial'),
  spectrumTargetZone: document.getElementById('spectrumTargetZone'),
  spectrumResultBanner: document.getElementById('spectrumResultBanner'),
  spectrumZoneTitle: document.getElementById('spectrumZoneTitle'),
  spectrumPointsText: document.getElementById('spectrumPointsText'),
  btnSpectrumNext: document.getElementById('btnSpectrumNext'),

  // Majority Rules elements
  majorityRoundCounter: document.getElementById('majorityRoundCounter'),
  majorityCategoryLabel: document.getElementById('majorityCategoryLabel'),
  majorityPromptText: document.getElementById('majorityPromptText'),
  majorityPhaseIcon: document.getElementById('majorityPhaseIcon'),
  majorityStatusText: document.getElementById('majorityStatusText'),
  majorityCounterBadge: document.getElementById('majorityCounterBadge'),
  majorityCardsGrid: document.getElementById('majorityCardsGrid'),
  btnMajorityNext: document.getElementById('btnMajorityNext'),

  // Podium elements
  podium1Avatar: document.getElementById('podium1Avatar'),
  podium1Name: document.getElementById('podium1Name'),
  podium1Score: document.getElementById('podium1Score'),
  podium2Avatar: document.getElementById('podium2Avatar'),
  podium2Name: document.getElementById('podium2Name'),
  podium2Score: document.getElementById('podium2Score'),
  podium3Avatar: document.getElementById('podium3Avatar'),
  podium3Name: document.getElementById('podium3Name'),
  podium3Score: document.getElementById('podium3Score'),
  btnRematch: document.getElementById('btnRematch'),
  btnBackToLobby: document.getElementById('btnBackToLobby'),

  // Modals
  modalStore: document.getElementById('modalStore'),
  btnCloseStore: document.getElementById('btnCloseStore'),
  storePacksGrid: document.getElementById('storePacksGrid'),
  btnBuyProSub: document.getElementById('btnBuyProSub'),
  btnDownloadPrintables: document.getElementById('btnDownloadPrintables'),

  modalAiStudio: document.getElementById('modalAiStudio'),
  btnCloseAiStudio: document.getElementById('btnCloseAiStudio'),
  aiTopicInput: document.getElementById('aiTopicInput'),
  aiModeSelect: document.getElementById('aiModeSelect'),
  aiDifficultySelect: document.getElementById('aiDifficultySelect'),
  btnGeneratePack: document.getElementById('btnGeneratePack'),
  aiPreviewBox: document.getElementById('aiPreviewBox'),
  aiPackTitle: document.getElementById('aiPackTitle'),
  aiQuestionsList: document.getElementById('aiQuestionsList'),
  btnApplyAiPack: document.getElementById('btnApplyAiPack')
};

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  // Request server to create room
  socket.emit('host:create_room');
  setupEventListeners();
});

// Socket Event: Room Created
socket.on('host:room_created', (data) => {
  roomCode = data.roomCode;
  allPacks = data.packs;
  unlockedPacks = data.unlockedPacks || ['starter'];
  isProHost = data.isProHost;

  elements.displayRoomCode.textContent = roomCode;
  elements.qrRoomCode.textContent = roomCode;
  elements.qrCodeImg.src = data.qrDataUrl;
  elements.joinUrlText.textContent = data.playUrl;

  // Set simulator iframe URL to pre-fill room
  elements.simIframe.src = `/play?room=${roomCode}`;

  updatePackBanner();
  renderStorePacks();
});

// Socket Event: Players Updated
socket.on('room:players_updated', ({ players, count }) => {
  elements.playerCount.textContent = count;
  elements.rosterCount.textContent = count;
  renderPlayers(players);
  window.sound.playPop();
});

// Socket Event: Reaction Emoji Burst
socket.on('room:reaction_burst', ({ emoji, playerName }) => {
  spawnFloatingEmoji(emoji);
  window.sound.playPop();
});

// Socket Event: Pack Unlocked (via Stripe simulation)
socket.on('room:pack_unlocked', ({ packId, unlockedPacks: newPacks }) => {
  unlockedPacks = newPacks;
  renderStorePacks();
  updatePackBanner();
  triggerCelebrationConfetti();
  window.sound.playCorrect();
});

// Socket Event: Pro Host Updated
socket.on('room:pro_updated', ({ isProHost: proStatus }) => {
  isProHost = proStatus;
  elements.proBadge.classList.remove('hidden');
  elements.playerLimitLabel.textContent = '/ 50';
  triggerCelebrationConfetti();
  window.sound.playFanfare();
});

// ================= SPEED DUEL ROUND EVENTS =================
socket.on('round:speed_start', (data) => {
  switchStage('stageSpeedQuestion');
  window.sound.playWhoosh();

  elements.speedRoundCounter.textContent = `Round ${data.roundIndex} / ${data.totalRounds}`;
  elements.speedPackName.textContent = data.packTitle;
  elements.speedQuestionText.textContent = data.question;

  elements.optText0.textContent = data.options[0];
  elements.optText1.textContent = data.options[1];
  elements.optText2.textContent = data.options[2];
  elements.optText3.textContent = data.options[3];

  elements.speedAnswerCount.textContent = `0 / ${elements.playerCount.textContent}`;

  // Start 15s Timer
  startTimer(data.timeLimitSeconds || 15);
});

socket.on('round:player_locked_in', ({ answeredCount, totalPlayers }) => {
  elements.speedAnswerCount.textContent = `${answeredCount} / ${totalPlayers}`;
  window.sound.playLockIn();
});

socket.on('round:speed_result', (data) => {
  clearInterval(currentTimerInterval);
  switchStage('stageSpeedResult');

  elements.resultWinningText.textContent = elements[`optText${data.correctIndex}`].textContent;
  elements.resultFunFact.textContent = data.funFact;

  // Answer Breakdown Chart
  elements.countOpt0.textContent = data.optionCounts[0];
  elements.countOpt1.textContent = data.optionCounts[1];
  elements.countOpt2.textContent = data.optionCounts[2];
  elements.countOpt3.textContent = data.optionCounts[3];

  // Leaderboard render
  renderSpeedLeaderboard(data.leaderboard, data.roundResults);

  // Play audio
  window.sound.playCorrect();
  confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
});

// ================= THE SPECTRUM ROUND EVENTS =================
socket.on('spectrum:start', (data) => {
  switchStage('stageSpectrum');
  window.sound.playWhoosh();

  elements.spectrumRoundCounter.textContent = `The Spectrum Co-op • Round ${data.roundIndex} / ${data.totalRounds}`;
  elements.spectrumCategoryLabel.textContent = data.category;
  elements.spectrumLeftLabel.textContent = data.left;
  elements.spectrumRightLabel.textContent = data.right;
  elements.spectrumPsychicStatus.textContent = `🔮 Psychic ${data.psychicName} is composing a secret clue...`;
  elements.spectrumClueDisplay.textContent = `"..."`;

  // Reset dials & zones
  elements.spectrumTeamDial.style.left = '50%';
  elements.spectrumTargetZone.classList.add('hidden');
  elements.spectrumResultBanner.classList.add('hidden');
  elements.btnSpectrumNext.classList.add('hidden');
});

socket.on('spectrum:clue_broadcast', ({ clue, psychicName }) => {
  elements.spectrumPsychicStatus.textContent = `🔮 Clue from ${psychicName}:`;
  elements.spectrumClueDisplay.textContent = `"${clue}"`;
  window.sound.playLockIn();
});

socket.on('spectrum:live_dial_update', ({ value }) => {
  elements.spectrumTeamDial.style.left = `${value}%`;
  window.sound.playDialTick();
});

socket.on('spectrum:reveal', (data) => {
  // Show target bullseye
  elements.spectrumTargetZone.style.left = `${data.target}%`;
  elements.spectrumTargetZone.classList.remove('hidden');

  elements.spectrumResultBanner.classList.remove('hidden');
  elements.spectrumZoneTitle.textContent = data.zone;
  elements.spectrumPointsText.textContent = `Team was ${data.diff}% away! +${data.points * 250} Team Points Awarded!`;
  elements.btnSpectrumNext.classList.remove('hidden');

  if (data.points >= 3) {
    triggerCelebrationConfetti();
    window.sound.playCorrect();
  } else {
    window.sound.playWrong();
  }
});

// ================= MAJORITY RULES ROUND EVENTS =================
socket.on('majority:start', (data) => {
  switchStage('stageMajority');
  window.sound.playWhoosh();

  elements.majorityRoundCounter.textContent = `Majority Rules • Round ${data.roundIndex} / ${data.totalRounds}`;
  elements.majorityCategoryLabel.textContent = data.category;
  elements.majorityPromptText.textContent = data.prompt;
  elements.majorityPhaseIcon.textContent = '✍️';
  elements.majorityStatusText.textContent = 'Players are typing answers on their phones...';
  elements.majorityCounterBadge.textContent = `0 / ${elements.playerCount.textContent}`;
  elements.majorityCardsGrid.innerHTML = '';
  elements.btnMajorityNext.classList.add('hidden');
});

socket.on('majority:submission_progress', ({ submittedCount, totalPlayers }) => {
  elements.majorityCounterBadge.textContent = `${submittedCount} / ${totalPlayers}`;
  window.sound.playLockIn();
});

socket.on('majority:voting_phase', (data) => {
  elements.majorityPhaseIcon.textContent = '🗳️';
  elements.majorityStatusText.textContent = 'Answers locked in! Vote on your phones for the best!';
  elements.majorityCounterBadge.textContent = `0 / ${elements.playerCount.textContent} Voted`;
  window.sound.playWhoosh();

  // Render cards anonymously
  elements.majorityCardsGrid.innerHTML = data.cards.map((card, idx) => `
    <div class="party-card p-5 border-2 border-white/20 transform transition hover:scale-102">
      <div class="text-xs uppercase font-bold text-gray-400 mb-2">Answer #${idx + 1}</div>
      <div class="text-xl font-bold text-white mb-2">"${card.text}"</div>
      <div class="text-xs text-cyan-400 font-bold">Anonymous Submission</div>
    </div>
  `).join('');
});

socket.on('majority:vote_progress', ({ votedCount, totalPlayers }) => {
  elements.majorityCounterBadge.textContent = `${votedCount} / ${totalPlayers} Voted`;
  window.sound.playLockIn();
});

socket.on('majority:reveal_results', (data) => {
  elements.majorityPhaseIcon.textContent = '👑';
  elements.majorityStatusText.textContent = 'Majority Revealed!';
  elements.btnMajorityNext.classList.remove('hidden');

  elements.majorityCardsGrid.innerHTML = data.cards.map(card => `
    <div class="party-card p-5 border-2 ${card.isMajorityWinner ? 'border-yellow-400 bg-yellow-950/40 shadow-2xl scale-105' : 'border-white/10'}">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase font-bold ${card.isMajorityWinner ? 'text-yellow-300' : 'text-gray-400'}">
          ${card.isMajorityWinner ? '👑 MAJORITY WINNER!' : 'Contestant Answer'}
        </span>
        <span class="px-2.5 py-1 rounded-full bg-white/10 font-bold text-sm text-yellow-300">
          ${card.votes} Votes
        </span>
      </div>
      <div class="text-xl font-black text-white mb-3">"${card.text}"</div>
      <div class="flex items-center gap-2 pt-2 border-t border-white/10 text-sm font-bold text-purple-200">
        <span>${card.authorAvatar}</span>
        <span>By: ${card.authorName}</span>
      </div>
    </div>
  `).join('');

  triggerCelebrationConfetti();
  window.sound.playFanfare();
});

// ================= GAME OVER / PODIUM =================
socket.on('game:podium', (data) => {
  clearInterval(currentTimerInterval);
  switchStage('stagePodium');
  window.sound.playFanfare();
  triggerCelebrationConfetti();

  const [first, second, third] = data.topThree;

  if (first) {
    elements.podium1Avatar.textContent = first.avatar;
    elements.podium1Name.textContent = first.name;
    elements.podium1Score.textContent = `${first.score.toLocaleString()} pts`;
  }
  if (second) {
    elements.podium2Avatar.textContent = second.avatar;
    elements.podium2Name.textContent = second.name;
    elements.podium2Score.textContent = `${second.score.toLocaleString()} pts`;
  }
  if (third) {
    elements.podium3Avatar.textContent = third.avatar;
    elements.podium3Name.textContent = third.name;
    elements.podium3Score.textContent = `${third.score.toLocaleString()} pts`;
  }
});

socket.on('game:reset_to_lobby', ({ players }) => {
  switchStage('stageLobby');
  renderPlayers(players);
});

// ================= UI HELPERS & LISTENERS =================
function setupEventListeners() {
  // Mode selection clicks
  elements.modeCards.forEach(card => {
    card.addEventListener('click', () => {
      elements.modeCards.forEach(c => {
        c.classList.remove('active', 'border-cyan-400', 'bg-cyan-950/30', 'shadow-lg');
        c.classList.add('border-white/15', 'bg-white/5');
      });
      card.classList.add('active', 'border-cyan-400', 'bg-cyan-950/30', 'shadow-lg');
      card.classList.remove('border-white/15', 'bg-white/5');

      currentMode = card.getAttribute('data-mode');
      socket.emit('host:configure_game', { roomCode, mode: currentMode });
      window.sound.playLockIn();
    });
  });

  // Add Bot Player(s)
  elements.btnAddBot.addEventListener('click', () => {
    socket.emit('host:add_bot', { roomCode });
  });

  elements.btnAddThreeBots.addEventListener('click', () => {
    socket.emit('host:add_bot', { roomCode });
    setTimeout(() => socket.emit('host:add_bot', { roomCode }), 300);
    setTimeout(() => socket.emit('host:add_bot', { roomCode }), 600);
  });

  // Start Party Game Button
  elements.btnStartGame.addEventListener('click', () => {
    socket.emit('host:start_game', { roomCode });
  });

  // Next Round manual triggers
  elements.btnNextRound.addEventListener('click', () => {
    socket.emit('host:next_round', { roomCode });
  });
  elements.btnSpectrumNext.addEventListener('click', () => {
    socket.emit('host:next_round', { roomCode });
  });
  elements.btnMajorityNext.addEventListener('click', () => {
    socket.emit('host:next_round', { roomCode });
  });

  // Rematch and Lobby
  elements.btnRematch.addEventListener('click', () => {
    socket.emit('host:start_game', { roomCode });
  });
  elements.btnBackToLobby.addEventListener('click', () => {
    socket.emit('host:rematch', { roomCode });
  });

  // Sound toggle
  elements.btnSoundToggle.addEventListener('click', () => {
    const isMuted = window.sound.toggleMute();
    elements.btnSoundToggle.textContent = isMuted ? '🔇' : '🔊';
  });

  // Copy join link
  elements.btnCopyLink.addEventListener('click', () => {
    const url = elements.joinUrlText.textContent;
    navigator.clipboard.writeText(url).then(() => {
      elements.btnCopyLink.textContent = '✅';
      setTimeout(() => elements.btnCopyLink.textContent = '📋', 1500);
    });
  });

  // Phone Simulator Dock
  elements.btnToggleSim.addEventListener('click', () => {
    elements.simDock.classList.toggle('collapsed');
  });
  elements.btnCloseSim.addEventListener('click', () => {
    elements.simDock.classList.add('collapsed');
  });

  // Modals
  elements.btnOpenStore.addEventListener('click', () => {
    elements.modalStore.classList.add('open');
  });
  elements.btnBrowsePacks.addEventListener('click', () => {
    elements.modalStore.classList.add('open');
  });
  elements.btnCloseStore.addEventListener('click', () => {
    elements.modalStore.classList.remove('open');
  });

  elements.btnOpenAiStudio.addEventListener('click', () => {
    elements.modalAiStudio.classList.add('open');
  });
  elements.btnCloseAiStudio.addEventListener('click', () => {
    elements.modalAiStudio.classList.remove('open');
  });

  // Pro Subscription Purchase Simulation
  elements.btnBuyProSub.addEventListener('click', async () => {
    elements.btnBuyProSub.textContent = 'Processing Stripe... 💳';
    elements.btnBuyProSub.disabled = true;

    try {
      const res = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, itemType: 'pro_sub', amount: 499 })
      });
      const data = await res.json();
      if (data.success) {
        elements.btnBuyProSub.textContent = 'Active Pro Host ⭐';
        setTimeout(() => elements.modalStore.classList.remove('open'), 1200);
      }
    } catch (err) {
      elements.btnBuyProSub.textContent = '⚡ Upgrade to Pro';
      elements.btnBuyProSub.disabled = false;
    }
  });

  // AI Pack Generator Trigger
  elements.btnGeneratePack.addEventListener('click', async () => {
    const topic = elements.aiTopicInput.value.trim() || 'Tech Startups & Dad Jokes';
    const mode = elements.aiModeSelect.value;
    const difficulty = elements.aiDifficultySelect.value;

    elements.btnGeneratePack.innerHTML = `<span>Thinking with Gemini...</span> <span class="animate-spin">⏳</span>`;
    elements.btnGeneratePack.disabled = true;

    try {
      const res = await fetch('/api/generate-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, mode, difficulty })
      });
      const data = await res.json();
      if (data.success) {
        generatedAiPack = data.pack;
        displayAiPackPreview(data.pack);
      }
    } catch (err) {
      console.error(err);
    } finally {
      elements.btnGeneratePack.innerHTML = `<span>Generate 5-Question Pack with AI</span> <span>⚡</span>`;
      elements.btnGeneratePack.disabled = false;
    }
  });

  // Apply Generated AI Pack
  elements.btnApplyAiPack.addEventListener('click', () => {
    if (!generatedAiPack) return;
    GAME_PACKS.speed.push(generatedAiPack);
    activePackId = generatedAiPack.id;
    unlockedPacks.push(generatedAiPack.id);
    updatePackBanner();
    renderStorePacks();
    elements.modalAiStudio.classList.remove('open');
    triggerCelebrationConfetti();
    window.sound.playCorrect();
  });

  // Printable Etsy Flashcards preview
  elements.btnDownloadPrintables.addEventListener('click', () => {
    alert("🖨️ Generating printable high-res PDF Flashcards & Scorecards! In production, this delivers instant Etsy-style digital party downloads.");
  });
}

// Stage Switcher
function switchStage(stageId) {
  const stages = [
    elements.stageLobby,
    elements.stageSpeedQuestion,
    elements.stageSpeedResult,
    elements.stageSpectrum,
    elements.stageMajority,
    elements.stagePodium
  ];
  stages.forEach(s => {
    if (s.id === stageId) {
      s.classList.remove('hidden');
      s.classList.add('flex', 'pop-bounce');
    } else {
      s.classList.add('hidden');
      s.classList.remove('flex', 'pop-bounce');
    }
  });
}

// Timer Controller
function startTimer(durationSeconds) {
  clearInterval(currentTimerInterval);
  secondsRemaining = durationSeconds;
  elements.timerSeconds.textContent = secondsRemaining;
  elements.timerSeconds.classList.remove('timer-urgent');
  
  const circumference = 175.9;
  elements.timerCircle.style.strokeDashoffset = '0';
  elements.timerCircle.style.stroke = '#1dd1a1';

  currentTimerInterval = setInterval(() => {
    secondsRemaining--;
    elements.timerSeconds.textContent = secondsRemaining;

    // Progress circle
    const progress = (durationSeconds - secondsRemaining) / durationSeconds;
    elements.timerCircle.style.strokeDashoffset = circumference * progress;

    if (secondsRemaining <= 5) {
      elements.timerCircle.style.stroke = '#ff3838';
      elements.timerSeconds.classList.add('timer-urgent');
      window.sound.playTick(true);
    } else {
      elements.timerSeconds.classList.remove('timer-urgent');
      window.sound.playTick(false);
    }

    if (secondsRemaining <= 0) {
      clearInterval(currentTimerInterval);
      elements.timerSeconds.classList.remove('timer-urgent');
      window.sound.playWrong();
    }
  }, 1000);
}

// Render Players Roster
function renderPlayers(players) {
  if (players.length === 0) {
    elements.playersGrid.innerHTML = `
      <div class="col-span-full py-6 text-center text-gray-400 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2">
        <span class="text-4xl animate-bounce">📱</span>
        <p class="text-sm font-bold">Waiting for players to connect...</p>
        <p class="text-xs text-gray-500">Tip: Click "+1 AI Bot" or "+3 AI Bots" above to test right now!</p>
      </div>
    `;
    return;
  }

  elements.playersGrid.innerHTML = players.map(p => `
    <div class="party-card p-3 flex items-center gap-3 bg-white/10 border border-white/20 pop-bounce transform hover:scale-105 transition shadow-lg">
      <div class="text-3xl">${p.avatar}</div>
      <div class="truncate">
        <div class="font-bold text-sm text-white truncate">${p.name}</div>
        <div class="text-[10px] uppercase font-black tracking-wider ${p.isBot ? 'text-purple-300' : 'text-emerald-300'}">
          ${p.isBot ? '🤖 AI BOT' : '📱 PHONE JOIN'}
        </div>
      </div>
    </div>
  `).join('');
}

// Render Speed Leaderboard
function renderSpeedLeaderboard(leaderboard, roundResults) {
  elements.speedLeaderboardList.innerHTML = leaderboard.map((p, idx) => {
    const res = roundResults.find(r => r.id === p.id);
    const delta = res ? res.pointsEarned : 0;
    const streak = res ? res.streak : 0;

    return `
      <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="font-display font-black text-lg text-gray-400 w-5">${idx + 1}</span>
          <span class="text-2xl">${p.avatar}</span>
          <div>
            <div class="font-bold text-sm text-white">${p.name}</div>
            <div class="text-xs text-gray-400">
              ${streak > 1 ? `<span class="text-yellow-400 font-bold">🔥 x${streak} Streak</span>` : ''}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-display font-black text-base text-yellow-300">${p.score.toLocaleString()} pts</div>
          <div class="text-xs font-bold text-emerald-400">+${delta} pts</div>
        </div>
      </div>
    `;
  }).join('');
}

// Pack Banner UI
function updatePackBanner() {
  const pack = (GAME_PACKS.speed || []).find(p => p.id === activePackId) || GAME_PACKS.speed[0];
  if (!pack) return;

  elements.packIcon.textContent = pack.icon;
  elements.packTitle.textContent = pack.title;
  elements.packCategory.textContent = pack.category;
  const isUnlocked = unlockedPacks.includes(pack.id);
  elements.packStatusBadge.textContent = isUnlocked ? 'ACTIVE / READY' : 'LOCKED PACK';
  elements.packStatusBadge.className = isUnlocked 
    ? 'px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 text-xs font-bold'
    : 'px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold';
}

// Store Packs List
function renderStorePacks() {
  const packs = GAME_PACKS.speed || [];
  elements.storePacksGrid.innerHTML = packs.map(pack => {
    const isUnlocked = unlockedPacks.includes(pack.id);
    return `
      <div class="party-card p-4 flex flex-col justify-between border ${isUnlocked ? 'border-emerald-500/40' : 'border-white/15'}">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">${pack.icon}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}">
              ${pack.badge}
            </span>
          </div>
          <h5 class="font-bold text-base text-white mb-1">${pack.title}</h5>
          <p class="text-xs text-gray-300 mb-3">${pack.description}</p>
        </div>
        <div class="pt-3 border-t border-white/10 flex items-center justify-between">
          <span class="font-display font-black text-sm text-yellow-300">${pack.price}</span>
          ${isUnlocked 
            ? `<button class="btn-arcade btn-green text-xs py-1.5 px-3 select-pack-btn" data-pack-id="${pack.id}">Select Pack ✓</button>`
            : `<button class="btn-arcade btn-gold text-xs py-1.5 px-3 buy-pack-btn" data-pack-id="${pack.id}">Unlock ($${pack.price})</button>`
          }
        </div>
      </div>
    `;
  }).join('');

  // Attach button click events
  document.querySelectorAll('.select-pack-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.target.getAttribute('data-pack-id');
      activePackId = pid;
      socket.emit('host:configure_game', { roomCode, packId: pid });
      updatePackBanner();
      elements.modalStore.classList.remove('open');
      window.sound.playLockIn();
    });
  });

  document.querySelectorAll('.buy-pack-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const pid = e.target.getAttribute('data-pack-id');
      btn.textContent = 'Processing...';
      btn.disabled = true;

      const res = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, itemType: 'pack', itemId: pid, amount: 299 })
      });
      const data = await res.json();
      if (data.success) {
        activePackId = pid;
        socket.emit('host:configure_game', { roomCode, packId: pid });
        updatePackBanner();
        renderStorePacks();
      }
    });
  });
}

// AI Pack Preview
function displayAiPackPreview(pack) {
  elements.aiPreviewBox.classList.remove('hidden');
  elements.aiPackTitle.textContent = `${pack.title} (${pack.questions.length} Questions)`;
  elements.aiQuestionsList.innerHTML = pack.questions.map((q, i) => `
    <div class="p-2 rounded-lg bg-white/5 border border-white/10">
      <div class="font-bold text-white">${i + 1}. ${q.question}</div>
      <div class="text-[11px] text-emerald-400">Answer: ${q.options[q.answer]}</div>
    </div>
  `).join('');
}

// Floating reaction emoji animation
function spawnFloatingEmoji(emoji) {
  const el = document.createElement('div');
  el.className = 'floating-emoji';
  el.textContent = emoji;
  el.style.left = `${15 + Math.random() * 70}%`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2300);
}

// Confetti Celebration
function triggerCelebrationConfetti() {
  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.5 }
  });
}

