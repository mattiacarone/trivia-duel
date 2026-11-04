// Trivia Duel Mobile Controller Script
const socket = io();

let currentRoom = null;
let playerProfile = {
  id: null,
  name: 'Contestant',
  avatar: '😎',
  score: 0
};
let isPsychic = false;
let currentSliderValue = 50;
let questionStartTime = Date.now();
let phoneTimerInterval = null;

// DOM elements cache
const ctrlElements = {
  // Top bar
  playerPill: document.getElementById('playerPill'),
  playerAvatarPill: document.getElementById('playerAvatarPill'),
  playerNamePill: document.getElementById('playerNamePill'),
  playerScorePill: document.getElementById('playerScorePill'),
  ctrlRoomLabel: document.getElementById('ctrlRoomLabel'),
  ctrlSoundBtn: document.getElementById('ctrlSoundBtn'),

  // Stages
  ctrlStageJoin: document.getElementById('ctrlStageJoin'),
  ctrlStageLobby: document.getElementById('ctrlStageLobby'),
  ctrlStageSpeed: document.getElementById('ctrlStageSpeed'),
  ctrlStageSpectrum: document.getElementById('ctrlStageSpectrum'),
  ctrlStageMajority: document.getElementById('ctrlStageMajority'),
  ctrlStageResult: document.getElementById('ctrlStageResult'),

  // Join stage
  inputRoomCode: document.getElementById('inputRoomCode'),
  inputPlayerName: document.getElementById('inputPlayerName'),
  avatarOpts: document.querySelectorAll('.avatar-opt'),
  btnJoinGame: document.getElementById('btnJoinGame'),
  joinErrorMsg: document.getElementById('joinErrorMsg'),

  // Lobby stage
  lobbyPlayerAvatar: document.getElementById('lobbyPlayerAvatar'),
  lobbyPlayerName: document.getElementById('lobbyPlayerName'),
  lobbyRoomBadge: document.getElementById('lobbyRoomBadge'),
  btnReactions: document.querySelectorAll('.btn-reaction'),

  // Speed stage (Full Question & Answers on Phone!)
  speedLockBanner: document.getElementById('speedLockBanner'),
  speedStatusText: document.getElementById('speedStatusText'),
  ctrlRoundCounter: document.getElementById('ctrlRoundCounter'),
  ctrlTimerBox: document.getElementById('ctrlTimerBox'),
  ctrlTimerSecText: document.getElementById('ctrlTimerSecText'),
  ctrlTimerBar: document.getElementById('ctrlTimerBar'),
  ctrlQuestionText: document.getElementById('ctrlQuestionText'),
  ctrlOptionCards: document.querySelectorAll('.ctrl-option-card'),
  ctrlOptText0: document.getElementById('ctrlOptText0'),
  ctrlOptText1: document.getElementById('ctrlOptText1'),
  ctrlOptText2: document.getElementById('ctrlOptText2'),
  ctrlOptText3: document.getElementById('ctrlOptText3'),

  // Spectrum stage
  spectrumPsychicView: document.getElementById('spectrumPsychicView'),
  spectrumGuessView: document.getElementById('spectrumGuessView'),
  ctrlSecretTargetLabel: document.getElementById('ctrlSecretTargetLabel'),
  ctrlSecretTargetBar: document.getElementById('ctrlSecretTargetBar'),
  ctrlPsychicClueInput: document.getElementById('ctrlPsychicClueInput'),
  btnSubmitClue: document.getElementById('btnSubmitClue'),
  ctrlSpectrumClue: document.getElementById('ctrlSpectrumClue'),
  ctrlSpectrumLeft: document.getElementById('ctrlSpectrumLeft'),
  ctrlSpectrumRight: document.getElementById('ctrlSpectrumRight'),
  ctrlSpectrumTrack: document.getElementById('ctrlSpectrumTrack'),
  ctrlSpectrumDial: document.getElementById('ctrlSpectrumDial'),
  ctrlSliderValLabel: document.getElementById('ctrlSliderValLabel'),
  btnLockSpectrumGuess: document.getElementById('btnLockSpectrumGuess'),

  // Majority stage
  majorityInputView: document.getElementById('majorityInputView'),
  majorityVoteView: document.getElementById('majorityVoteView'),
  ctrlMajorityPrompt: document.getElementById('ctrlMajorityPrompt'),
  ctrlMajorityText: document.getElementById('ctrlMajorityText'),
  btnSubmitMajorityText: document.getElementById('btnSubmitMajorityText'),
  ctrlMajorityVoteCards: document.getElementById('ctrlMajorityVoteCards'),

  // Result overlay stage
  ctrlResultIcon: document.getElementById('ctrlResultIcon'),
  ctrlResultTitle: document.getElementById('ctrlResultTitle'),
  ctrlResultSubtitle: document.getElementById('ctrlResultSubtitle'),
  ctrlResultQuestionRecap: document.getElementById('ctrlResultQuestionRecap'),
  ctrlResultCorrectText: document.getElementById('ctrlResultCorrectText'),
  ctrlResultFunFactText: document.getElementById('ctrlResultFunFactText'),

  // Lifelines & Toast
  ctrlToast: document.getElementById('ctrlToast'),
  btnLifeline5050: document.getElementById('btnLifeline5050'),
  badge5050Count: document.getElementById('badge5050Count'),
  btnLifelineDouble: document.getElementById('btnLifelineDouble'),
  badgeDoubleCount: document.getElementById('badgeDoubleCount')
};

// Toast notification helper
function showToast(msg, duration = 3000) {
  if (!ctrlElements.ctrlToast) return;
  ctrlElements.ctrlToast.textContent = msg;
  ctrlElements.ctrlToast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
  ctrlElements.ctrlToast.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    ctrlElements.ctrlToast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
    ctrlElements.ctrlToast.classList.remove('opacity-100', 'translate-y-0');
  }, duration);
}

// Mobile Tactile Haptic Feedback Engine
function triggerHaptic(pattern = [25]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (_) {}
}

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  // Pre-fill room code from URL ?room=XXXX or last room
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    ctrlElements.inputRoomCode.value = roomParam.toUpperCase().slice(0, 4);
  } else {
    const savedRoom = localStorage.getItem('trivia_last_room');
    if (savedRoom) ctrlElements.inputRoomCode.value = savedRoom;
  }

  // Pre-fill random funny name
  const funNames = ['QuizWhiz', 'BrainBox', 'PartyFox', 'PixelNinja', 'TurboTaco', 'LuckyStar', 'NeonViper'];
  ctrlElements.inputPlayerName.value = funNames[Math.floor(Math.random() * funNames.length)];

  setupControllerListeners();
  setupSpectrumSlider();
});

// Switch Controller Screen
function switchCtrlStage(stageEl) {
  const allStages = [
    ctrlElements.ctrlStageJoin,
    ctrlElements.ctrlStageLobby,
    ctrlElements.ctrlStageSpeed,
    ctrlElements.ctrlStageSpectrum,
    ctrlElements.ctrlStageMajority,
    ctrlElements.ctrlStageResult
  ];
  allStages.forEach(s => {
    if (s === stageEl) {
      s.classList.remove('hidden');
      s.classList.add('flex');
    } else {
      s.classList.add('hidden');
      s.classList.remove('flex');
    }
  });
}

// Synchronized Phone Countdown Timer Bar
function startPhoneCountdown(seconds) {
  clearInterval(phoneTimerInterval);
  let remaining = seconds;
  if (ctrlElements.ctrlTimerSecText) ctrlElements.ctrlTimerSecText.textContent = `${remaining}s`;
  if (ctrlElements.ctrlTimerBar) {
    ctrlElements.ctrlTimerBar.style.width = '100%';
    ctrlElements.ctrlTimerBar.className = 'h-full bg-emerald-400 rounded-full transition-all duration-1000 linear';
  }
  if (ctrlElements.ctrlTimerBox) ctrlElements.ctrlTimerBox.classList.remove('timer-urgent');

  phoneTimerInterval = setInterval(() => {
    remaining--;
    if (remaining < 0) {
      clearInterval(phoneTimerInterval);
      return;
    }
    if (ctrlElements.ctrlTimerSecText) ctrlElements.ctrlTimerSecText.textContent = `${remaining}s`;
    if (ctrlElements.ctrlTimerBar) {
      const pct = Math.max(0, (remaining / seconds) * 100);
      ctrlElements.ctrlTimerBar.style.width = `${pct}%`;
      if (remaining <= 5) {
        ctrlElements.ctrlTimerBar.className = 'h-full bg-red-500 rounded-full transition-all duration-1000 linear';
        if (ctrlElements.ctrlTimerBox) ctrlElements.ctrlTimerBox.classList.add('timer-urgent');
      } else if (remaining <= 9) {
        ctrlElements.ctrlTimerBar.className = 'h-full bg-yellow-400 rounded-full transition-all duration-1000 linear';
      }
    }
  }, 1000);
}

// ================= SOCKET EVENT HANDLERS =================
socket.on('player:joined_success', (data) => {
  currentRoom = data.roomCode;
  playerProfile = data.player;

  // Persist session token for seamless mobile reconnection
  if (playerProfile.token) {
    localStorage.setItem('trivia_player_token', playerProfile.token);
    localStorage.setItem('trivia_last_room', currentRoom);
  }

  // Update top bar pill
  ctrlElements.ctrlRoomLabel.textContent = `ROOM: ${currentRoom}`;
  ctrlElements.playerPill.classList.remove('hidden');
  ctrlElements.playerAvatarPill.textContent = playerProfile.avatar;
  ctrlElements.playerNamePill.textContent = playerProfile.name;
  ctrlElements.playerScorePill.textContent = `${playerProfile.score} pts`;

  // Update lobby display
  ctrlElements.lobbyPlayerAvatar.textContent = playerProfile.avatar;
  ctrlElements.lobbyPlayerName.textContent = playerProfile.name;
  ctrlElements.lobbyRoomBadge.textContent = currentRoom;

  switchCtrlStage(ctrlElements.ctrlStageLobby);
  window.sound.playCorrect();
  showToast(`Joined Room ${currentRoom} as ${playerProfile.name}! 🎉`);
});

// Reconnection recovery event
socket.on('player:reconnected_success', (data) => {
  currentRoom = data.roomCode;
  playerProfile = data.player;

  ctrlElements.ctrlRoomLabel.textContent = `ROOM: ${currentRoom}`;
  ctrlElements.playerPill.classList.remove('hidden');
  ctrlElements.playerAvatarPill.textContent = playerProfile.avatar;
  ctrlElements.playerNamePill.textContent = playerProfile.name;
  ctrlElements.playerScorePill.textContent = `${playerProfile.score} pts`;

  showToast(`⚡ Welcome back ${playerProfile.name}! Score restored.`);
  window.sound.playLockIn();

  if (data.state === 'QUESTION_ACTIVE' && data.currentQuestion) {
    switchCtrlStage(ctrlElements.ctrlStageSpeed);
    ctrlElements.ctrlRoundCounter.textContent = `Question ${data.currentQuestion.roundIndex} / ${data.currentQuestion.totalRounds}`;
    ctrlElements.ctrlQuestionText.textContent = data.currentQuestion.question;
    data.currentQuestion.options.forEach((opt, idx) => {
      const el = ctrlElements[`ctrlOptText${idx}`];
      if (el) el.textContent = opt;
    });

    if (data.currentQuestion.hasAnswered) {
      ctrlElements.ctrlOptionCards.forEach(c => {
        c.disabled = true;
        const choice = parseInt(c.getAttribute('data-choice'), 10);
        if (choice === data.currentQuestion.lastAnswerIndex) {
          c.classList.add('selected');
        } else {
          c.classList.add('dimmed');
        }
      });
      ctrlElements.speedLockBanner.classList.add('bg-emerald-600/40', 'border-emerald-400');
      ctrlElements.speedStatusText.textContent = '🔒 ANSWER LOCKED IN! WAITING FOR REVEAL...';
    }
  } else {
    ctrlElements.lobbyPlayerAvatar.textContent = playerProfile.avatar;
    ctrlElements.lobbyPlayerName.textContent = playerProfile.name;
    ctrlElements.lobbyRoomBadge.textContent = currentRoom;
    switchCtrlStage(ctrlElements.ctrlStageLobby);
  }
});

socket.on('player:error', ({ message }) => {
  ctrlElements.joinErrorMsg.textContent = message;
  ctrlElements.joinErrorMsg.classList.remove('hidden');
  window.sound.playWrong();
});

// Speed Trivia Question Start (Question + Options loaded directly on phone!)
socket.on('round:speed_start', (data) => {
  switchCtrlStage(ctrlElements.ctrlStageSpeed);
  window.sound.playWhoosh();
  questionStartTime = Date.now();

  // Populate round, question, and full option texts
  if (data) {
    if (ctrlElements.ctrlRoundCounter) {
      ctrlElements.ctrlRoundCounter.textContent = `Question ${data.roundIndex} / ${data.totalRounds || 5}`;
    }
    if (ctrlElements.ctrlQuestionText) {
      ctrlElements.ctrlQuestionText.textContent = data.question || 'Answer the question:';
    }
    if (data.options && data.options.length >= 4) {
      if (ctrlElements.ctrlOptText0) ctrlElements.ctrlOptText0.textContent = data.options[0];
      if (ctrlElements.ctrlOptText1) ctrlElements.ctrlOptText1.textContent = data.options[1];
      if (ctrlElements.ctrlOptText2) ctrlElements.ctrlOptText2.textContent = data.options[2];
      if (ctrlElements.ctrlOptText3) ctrlElements.ctrlOptText3.textContent = data.options[3];
    }
    startPhoneCountdown(data.timeLimitSeconds || 15);
  }

  // Update lifeline button availability
  if (ctrlElements.btnLifeline5050) {
    const count5050 = playerProfile.lifelines?.fiftyFifty ?? 1;
    ctrlElements.btnLifeline5050.disabled = count5050 <= 0;
    if (count5050 <= 0) ctrlElements.btnLifeline5050.classList.add('opacity-40');
    else ctrlElements.btnLifeline5050.classList.remove('opacity-40');
    if (ctrlElements.badge5050Count) ctrlElements.badge5050Count.textContent = count5050;
  }
  if (ctrlElements.btnLifelineDouble) {
    const countDouble = playerProfile.lifelines?.doubleDown ?? 1;
    ctrlElements.btnLifelineDouble.disabled = countDouble <= 0;
    if (countDouble <= 0) ctrlElements.btnLifelineDouble.classList.add('opacity-40');
    else ctrlElements.btnLifelineDouble.classList.remove('opacity-40');
    if (ctrlElements.badgeDoubleCount) ctrlElements.badgeDoubleCount.textContent = countDouble;
  }

  // Reset option cards
  ctrlElements.ctrlOptionCards.forEach(card => {
    card.classList.remove('selected', 'dimmed', 'opacity-20');
    card.style.transform = '';
    card.disabled = false;
    const check = card.querySelector('.check-indicator');
    if (check) {
      check.innerHTML = '';
      check.className = 'w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center shrink-0 check-indicator';
    }
  });

  ctrlElements.speedLockBanner.className = 'p-2.5 rounded-xl bg-purple-950/60 border border-purple-400/30 mb-2.5 text-center transition';
  ctrlElements.speedStatusText.textContent = 'TAP YOUR ANSWER! ⏱️';
});

// Lifeline Handlers
socket.on('player:lifeline_fifty_fifty', ({ eliminatedIndices }) => {
  eliminatedIndices.forEach(idx => {
    const card = document.querySelector(`.ctrl-option-card[data-choice="${idx}"]`);
    if (card) {
      card.disabled = true;
      card.classList.add('dimmed', 'opacity-20');
      card.style.transform = 'scale(0.92)';
    }
  });
  if (playerProfile.lifelines) playerProfile.lifelines.fiftyFifty = 0;
  if (ctrlElements.btnLifeline5050) {
    ctrlElements.btnLifeline5050.disabled = true;
    ctrlElements.btnLifeline5050.classList.add('opacity-40');
    if (ctrlElements.badge5050Count) ctrlElements.badge5050Count.textContent = '0';
  }
  showToast('✂️ 50:50 Applied! 2 wrong options eliminated.');
  window.sound.playPop();
  triggerHaptic([30, 20]);
});

socket.on('player:lifeline_double_down', () => {
  if (playerProfile.lifelines) playerProfile.lifelines.doubleDown = 0;
  if (ctrlElements.btnLifelineDouble) {
    ctrlElements.btnLifelineDouble.disabled = true;
    ctrlElements.btnLifelineDouble.classList.add('opacity-40');
    if (ctrlElements.badgeDoubleCount) ctrlElements.badgeDoubleCount.textContent = '0';
  }
  ctrlElements.speedLockBanner.classList.add('border-amber-400', 'bg-amber-950/60');
  ctrlElements.speedStatusText.textContent = '⚡ DOUBLE DOWN ACTIVE! (2X POINTS)';
  showToast('⚡ Double Down Activated! 2X Points if correct.');
  window.sound.playLockIn();
  triggerHaptic([40, 40]);
});

socket.on('player:toast', ({ message }) => {
  showToast(message);
});

socket.on('game:sudden_death_alert', (data) => {
  showToast(`⚡ SUDDEN DEATH TIE-BREAKER! ${data.tiedPlayers || ''}`, 5000);
  window.sound.playTick(true);
  triggerHaptic([80, 80, 80]);
});

// Speed Trivia Results (Detailed with correct answer & lore on phone!)
socket.on('round:speed_result', (data) => {
  clearInterval(phoneTimerInterval);
  const myResult = data.roundResults.find(r => r.id === socket.id);
  switchCtrlStage(ctrlElements.ctrlStageResult);

  if (ctrlElements.ctrlResultQuestionRecap) {
    const qText = ctrlElements.ctrlQuestionText ? ctrlElements.ctrlQuestionText.textContent : (data.question || '');
    if (qText) {
      ctrlElements.ctrlResultQuestionRecap.textContent = `Q: "${qText}"`;
      ctrlElements.ctrlResultQuestionRecap.classList.remove('hidden');
    } else {
      ctrlElements.ctrlResultQuestionRecap.classList.add('hidden');
    }
  }

  const correctText = data.correctText || (data.options ? data.options[data.correctIndex] : 'Correct answer');
  if (ctrlElements.ctrlResultCorrectText) {
    ctrlElements.ctrlResultCorrectText.textContent = correctText;
  }
  if (ctrlElements.ctrlResultFunFactText) {
    ctrlElements.ctrlResultFunFactText.textContent = data.funFact || 'Great round!';
  }

  if (myResult && myResult.isCorrect) {
    ctrlElements.ctrlResultIcon.textContent = '🎉';
    ctrlElements.ctrlResultTitle.textContent = 'CORRECT!';
    ctrlElements.ctrlResultTitle.className = 'text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400 mb-1';
    ctrlElements.ctrlResultSubtitle.textContent = `+${myResult.pointsEarned.toLocaleString()} Points! (${myResult.streak > 1 ? `🔥 x${myResult.streak} Streak!` : 'Nice!'})`;
    ctrlElements.playerScorePill.textContent = `${myResult.newTotalScore.toLocaleString()} pts`;
    window.sound.playCorrect();
    triggerHaptic([40, 60, 80]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  } else {
    ctrlElements.ctrlResultIcon.textContent = '💀';
    ctrlElements.ctrlResultTitle.textContent = 'OOF! WRONG';
    ctrlElements.ctrlResultTitle.className = 'text-3xl font-black text-red-400 mb-1';
    ctrlElements.ctrlResultSubtitle.textContent = 'Streak reset to 0';
    window.sound.playWrong();
    triggerHaptic([100]);
  }
});

// ================= THE SPECTRUM EVENTS =================
socket.on('spectrum:start', (data) => {
  switchCtrlStage(ctrlElements.ctrlStageSpectrum);
  window.sound.playWhoosh();

  isPsychic = (data.psychicId === socket.id);
  ctrlElements.ctrlSpectrumLeft.textContent = data.left;
  ctrlElements.ctrlSpectrumRight.textContent = data.right;

  if (isPsychic) {
    ctrlElements.spectrumPsychicView.classList.remove('hidden');
    ctrlElements.spectrumPsychicView.classList.add('flex');
    ctrlElements.spectrumGuessView.classList.add('hidden');
    ctrlElements.spectrumGuessView.classList.remove('flex');
    ctrlElements.ctrlPsychicClueInput.value = '';
  } else {
    ctrlElements.spectrumPsychicView.classList.add('hidden');
    ctrlElements.spectrumPsychicView.classList.remove('flex');
    ctrlElements.spectrumGuessView.classList.remove('hidden');
    ctrlElements.spectrumGuessView.classList.add('flex');
    ctrlElements.ctrlSpectrumClue.textContent = `Waiting for ${data.psychicName} to send clue...`;
  }
});

socket.on('spectrum:secret_target', ({ target }) => {
  ctrlElements.ctrlSecretTargetLabel.textContent = `${target}%`;
  ctrlElements.ctrlSecretTargetBar.style.width = `${target}%`;
});

socket.on('spectrum:clue_broadcast', ({ clue, psychicName }) => {
  ctrlElements.ctrlSpectrumClue.textContent = `"${clue}"`;
  window.sound.playLockIn();
});

socket.on('spectrum:reveal', (data) => {
  switchCtrlStage(ctrlElements.ctrlStageResult);
  ctrlElements.ctrlResultIcon.textContent = data.points >= 3 ? '🎯' : '👍';
  ctrlElements.ctrlResultTitle.textContent = data.zone;
  ctrlElements.ctrlResultTitle.className = 'text-3xl font-black text-yellow-300 mb-1';
  ctrlElements.ctrlResultSubtitle.textContent = `+${data.points * 250} Team Points! (${data.diff}% from center)`;
  
  if (ctrlElements.ctrlResultCorrectText) {
    ctrlElements.ctrlResultCorrectText.textContent = `Target: ${data.target}% (Your guess: ${data.finalGuess}%)`;
  }
  if (ctrlElements.ctrlResultFunFactText) {
    ctrlElements.ctrlResultFunFactText.textContent = 'Cooperative intuition round complete!';
  }

  const myPlayer = data.leaderboard.find(p => p.id === socket.id);
  if (myPlayer) {
    ctrlElements.playerScorePill.textContent = `${myPlayer.score.toLocaleString()} pts`;
  }
});

// ================= MAJORITY RULES EVENTS =================
socket.on('majority:start', (data) => {
  switchCtrlStage(ctrlElements.ctrlStageMajority);
  window.sound.playWhoosh();

  ctrlElements.majorityInputView.classList.remove('hidden');
  ctrlElements.majorityInputView.classList.add('flex');
  ctrlElements.majorityVoteView.classList.add('hidden');
  ctrlElements.majorityVoteView.classList.remove('flex');

  ctrlElements.ctrlMajorityPrompt.textContent = data.prompt;
  ctrlElements.ctrlMajorityText.value = '';
  ctrlElements.btnSubmitMajorityText.disabled = false;
  ctrlElements.btnSubmitMajorityText.textContent = 'SUBMIT ANSWER ✍️';
});

socket.on('majority:voting_phase', (data) => {
  ctrlElements.majorityInputView.classList.add('hidden');
  ctrlElements.majorityInputView.classList.remove('flex');
  ctrlElements.majorityVoteView.classList.remove('hidden');
  ctrlElements.majorityVoteView.classList.add('flex');
  window.sound.playWhoosh();

  // Render clickable voting cards
  ctrlElements.ctrlMajorityVoteCards.innerHTML = data.cards.map((card, idx) => `
    <button class="vote-answer-card w-full text-left p-4 rounded-2xl bg-white/10 border-2 border-white/20 hover:border-yellow-400 active:scale-98 transition flex items-center justify-between" data-target-id="${card.id}">
      <span class="font-bold text-white text-sm sm:text-base">"${card.text}"</span>
      <span class="text-xs text-yellow-300 font-bold ml-2 shrink-0">Vote 🗳️</span>
    </button>
  `).join('');

  document.querySelectorAll('.vote-answer-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target-id');
      socket.emit('player:majority_vote', { roomCode: currentRoom, targetPlayerId: targetId });
      
      document.querySelectorAll('.vote-answer-card').forEach(b => {
        b.disabled = true;
        b.classList.add('opacity-50');
      });
      btn.classList.remove('opacity-50');
      btn.classList.add('border-yellow-400', 'bg-yellow-950/40');
      btn.innerHTML += ` <span class="text-xs font-bold text-emerald-400">✓ Voted</span>`;
      triggerHaptic([30]);
      window.sound.playLockIn();
    });
  });
});

socket.on('majority:reveal_results', (data) => {
  switchCtrlStage(ctrlElements.ctrlStageResult);
  const myPlayer = data.leaderboard.find(p => p.id === socket.id);
  const myCard = data.cards.find(c => c.authorId === socket.id);

  if (myCard && myCard.isMajorityWinner) {
    ctrlElements.ctrlResultIcon.textContent = '👑';
    ctrlElements.ctrlResultTitle.textContent = 'MAJORITY WINNER!';
    ctrlElements.ctrlResultTitle.className = 'text-3xl font-black text-yellow-300 mb-1';
    ctrlElements.ctrlResultSubtitle.textContent = `Your answer won with ${myCard.votes} votes!`;
    confetti({ particleCount: 70, spread: 70 });
  } else {
    ctrlElements.ctrlResultIcon.textContent = '🗳️';
    ctrlElements.ctrlResultTitle.textContent = 'VOTES TALLIED';
    ctrlElements.ctrlResultTitle.className = 'text-3xl font-black text-cyan-300 mb-1';
    ctrlElements.ctrlResultSubtitle.textContent = myCard ? `Your answer got ${myCard.votes} votes!` : 'Round finished!';
  }

  if (ctrlElements.ctrlResultCorrectText) {
    ctrlElements.ctrlResultCorrectText.textContent = data.cards[0] ? `Top Answer: "${data.cards[0].text}" (${data.cards[0].votes} votes)` : 'Consensus complete';
  }
  if (ctrlElements.ctrlResultFunFactText) {
    ctrlElements.ctrlResultFunFactText.textContent = 'Points awarded for majority consensus!';
  }

  if (myPlayer) {
    ctrlElements.playerScorePill.textContent = `${myPlayer.score.toLocaleString()} pts`;
  }
});

// Game Over / Podium & Reset
socket.on('game:podium', (data) => {
  switchCtrlStage(ctrlElements.ctrlStageResult);
  const myRank = data.leaderboard.findIndex(p => p.id === socket.id) + 1;
  ctrlElements.ctrlResultIcon.textContent = myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : '🥉';
  ctrlElements.ctrlResultTitle.textContent = myRank === 1 ? 'YOU WON THE GAME!' : `Finished #${myRank}!`;
  ctrlElements.ctrlResultTitle.className = 'text-3xl font-black text-yellow-300 mb-1';
  ctrlElements.ctrlResultSubtitle.textContent = 'Great game! Look at the podium on TV!';
  window.sound.playFanfare();
});

socket.on('game:reset_to_lobby', () => {
  switchCtrlStage(ctrlElements.ctrlStageLobby);
});

// ================= CONTROLLER EVENT LISTENERS =================
function setupControllerListeners() {
  // Avatar selection
  ctrlElements.avatarOpts.forEach(btn => {
    btn.addEventListener('click', () => {
      ctrlElements.avatarOpts.forEach(b => {
        b.classList.remove('border-yellow-400', 'bg-white/15');
        b.classList.add('border-transparent');
      });
      btn.classList.add('border-yellow-400', 'bg-white/15');
      btn.classList.remove('border-transparent');
      playerProfile.avatar = btn.getAttribute('data-avatar');
      triggerHaptic([20]);
      window.sound.playPop();
    });
  });

  // Join Room (with auto-session token for reconnects)
  ctrlElements.btnJoinGame.addEventListener('click', () => {
    const code = ctrlElements.inputRoomCode.value.trim().toUpperCase();
    const name = ctrlElements.inputPlayerName.value.trim() || 'Contestant';
    if (!code || code.length < 3) {
      ctrlElements.joinErrorMsg.textContent = 'Please enter a valid room code!';
      ctrlElements.joinErrorMsg.classList.remove('hidden');
      triggerHaptic([60, 40, 60]);
      return;
    }

    ctrlElements.joinErrorMsg.classList.add('hidden');
    triggerHaptic([30]);
    const savedToken = localStorage.getItem('trivia_player_token') || null;
    socket.emit('player:join_room', {
      roomCode: code,
      name,
      avatar: playerProfile.avatar,
      token: savedToken
    });
  });

  // Lifelines: 50:50 and Double Down
  if (ctrlElements.btnLifeline5050) {
    ctrlElements.btnLifeline5050.addEventListener('click', () => {
      triggerHaptic([30]);
      socket.emit('player:use_lifeline', { roomCode: currentRoom, lifelineType: 'fiftyFifty' });
    });
  }

  if (ctrlElements.btnLifelineDouble) {
    ctrlElements.btnLifelineDouble.addEventListener('click', () => {
      triggerHaptic([40]);
      socket.emit('player:use_lifeline', { roomCode: currentRoom, lifelineType: 'doubleDown' });
    });
  }

  // Reaction Buttons (Cheer, Fire, Skull, etc.)
  ctrlElements.btnReactions.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      socket.emit('player:reaction', {
        roomCode: currentRoom,
        emoji,
        playerName: playerProfile.name
      });
      triggerHaptic([25]);
      window.sound.playPop();
    });
  });

  // Speed Trivia Option Action Card Click
  ctrlElements.ctrlOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.disabled) return;
      const choice = parseInt(card.getAttribute('data-choice'), 10);
      const elapsed = Date.now() - questionStartTime;
      const timeRemainingMs = Math.max(100, 15000 - elapsed);

      // Lock buttons visually and tactilely
      ctrlElements.ctrlOptionCards.forEach(c => {
        c.disabled = true;
        if (c === card) {
          c.classList.add('selected');
          const check = c.querySelector('.check-indicator');
          if (check) {
            check.className = 'w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shrink-0 check-indicator';
            check.innerHTML = '<span class="text-xs font-black text-white">✓</span>';
          }
        } else {
          c.classList.add('dimmed');
        }
      });

      ctrlElements.speedLockBanner.classList.add('bg-emerald-600/40', 'border-emerald-400');
      ctrlElements.speedStatusText.textContent = '🔒 ANSWER LOCKED IN! WAITING FOR REVEAL...';

      triggerHaptic([35]);
      window.sound.playLockIn();
      socket.emit('player:submit_speed_answer', {
        roomCode: currentRoom,
        optionIndex: choice,
        timeRemainingMs
      });
    });
  });

  // Psychic Clue Submission
  ctrlElements.btnSubmitClue.addEventListener('click', () => {
    const clue = ctrlElements.ctrlPsychicClueInput.value.trim();
    if (!clue) return;
    triggerHaptic([30]);
    socket.emit('player:spectrum_submit_clue', {
      roomCode: currentRoom,
      clue
    });
    ctrlElements.spectrumPsychicView.classList.add('hidden');
    ctrlElements.spectrumPsychicView.classList.remove('flex');
    ctrlElements.spectrumGuessView.classList.remove('hidden');
    ctrlElements.spectrumGuessView.classList.add('flex');
    ctrlElements.ctrlSpectrumClue.textContent = `"${clue}"`;
  });

  // Lock Spectrum Guess
  ctrlElements.btnLockSpectrumGuess.addEventListener('click', () => {
    triggerHaptic([40]);
    socket.emit('player:spectrum_lock_guess', {
      roomCode: currentRoom,
      finalGuess: currentSliderValue
    });
    ctrlElements.btnLockSpectrumGuess.disabled = true;
    ctrlElements.btnLockSpectrumGuess.textContent = 'GUESS LOCKED IN! 🔒';
    window.sound.playLockIn();
  });

  // Majority Rules Submit Text
  ctrlElements.btnSubmitMajorityText.addEventListener('click', () => {
    const text = ctrlElements.ctrlMajorityText.value.trim();
    if (!text) return;
    triggerHaptic([30]);
    socket.emit('player:majority_submit', {
      roomCode: currentRoom,
      text
    });
    ctrlElements.btnSubmitMajorityText.disabled = true;
    ctrlElements.btnSubmitMajorityText.textContent = '✓ ANSWER SUBMITTED!';
    window.sound.playLockIn();
  });

  // Sound toggle
  ctrlElements.ctrlSoundBtn.addEventListener('click', () => {
    const isMuted = window.sound.toggleMute();
    ctrlElements.ctrlSoundBtn.textContent = isMuted ? '🔇' : '🔊';
  });
}

// Spectrum Interactive Slider Touch & Drag Engine
function setupSpectrumSlider() {
  const track = ctrlElements.ctrlSpectrumTrack;
  const dial = ctrlElements.ctrlSpectrumDial;
  let isDragging = false;
  let lastDetent = 50;

  function updateSlider(clientX) {
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    currentSliderValue = percent;

    dial.style.left = `${percent}%`;
    ctrlElements.ctrlSliderValLabel.textContent = `Dial Position: ${percent}%`;

    // Tactile detent feedback every 5%
    if (Math.abs(percent - lastDetent) >= 5) {
      lastDetent = percent;
      triggerHaptic([12]);
      window.sound.playDialTick();
    }

    // Live sync to host board
    socket.emit('player:spectrum_slider_move', {
      roomCode: currentRoom,
      value: percent
    });
  }

  // Pointer events
  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    track.setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  });

  track.addEventListener('pointermove', (e) => {
    if (isDragging) {
      updateSlider(e.clientX);
    }
  });

  track.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      try { track.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  });

  track.addEventListener('pointercancel', () => {
    isDragging = false;
  });
}
