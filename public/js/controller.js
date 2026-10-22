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

  // Speed stage
  speedLockBanner: document.getElementById('speedLockBanner'),
  speedStatusText: document.getElementById('speedStatusText'),
  shapePads: document.querySelectorAll('.shape-pad'),

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
  ctrlResultSubtitle: document.getElementById('ctrlResultSubtitle')
};

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  // Pre-fill room code from URL ?room=XXXX
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    ctrlElements.inputRoomCode.value = roomParam.toUpperCase().slice(0, 4);
  }

  // Pre-fill random funny name
  const funNames = ['QuizWhiz', 'BrainBox', 'PartyFox', 'PixelNinja', 'TurboTaco', 'LuckyStar'];
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

// ================= SOCKET EVENT HANDLERS =================
socket.on('player:joined_success', (data) => {
  currentRoom = data.roomCode;
  playerProfile = data.player;

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
});

socket.on('player:error', ({ message }) => {
  ctrlElements.joinErrorMsg.textContent = message;
  ctrlElements.joinErrorMsg.classList.remove('hidden');
  window.sound.playWrong();
});

// Speed Trivia Question Start
socket.on('round:speed_start', () => {
  switchCtrlStage(ctrlElements.ctrlStageSpeed);
  window.sound.playWhoosh();
  questionStartTime = Date.now();

  // Reset shape pads
  ctrlElements.shapePads.forEach(pad => {
    pad.classList.remove('selected', 'disabled');
    pad.disabled = false;
  });
  ctrlElements.speedLockBanner.classList.remove('bg-emerald-600/40', 'border-emerald-400');
  ctrlElements.speedStatusText.textContent = 'TAP AN ANSWER QUICKLY!';
});

// Speed Trivia Results
socket.on('round:speed_result', (data) => {
  const myResult = data.roundResults.find(r => r.id === socket.id);
  switchCtrlStage(ctrlElements.ctrlStageResult);

  if (myResult && myResult.isCorrect) {
    ctrlElements.ctrlResultIcon.textContent = '🎉';
    ctrlElements.ctrlResultTitle.textContent = 'CORRECT!';
    ctrlElements.ctrlResultSubtitle.textContent = `+${myResult.pointsEarned.toLocaleString()} Points! (${myResult.streak > 1 ? `🔥 x${myResult.streak} Streak` : 'Nice!'})`;
    ctrlElements.playerScorePill.textContent = `${myResult.newTotalScore.toLocaleString()} pts`;
    window.sound.playCorrect();
    confetti({ particleCount: 50, spread: 60 });
  } else {
    ctrlElements.ctrlResultIcon.textContent = '💀';
    ctrlElements.ctrlResultTitle.textContent = 'OOF! WRONG';
    ctrlElements.ctrlResultSubtitle.textContent = 'Streak reset to 0';
    window.sound.playWrong();
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
  ctrlElements.ctrlResultSubtitle.textContent = `+${data.points * 250} Team Points! (${data.diff}% from center)`;
  
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
    <button class="vote-answer-card w-full text-left p-3.5 rounded-xl bg-white/10 border border-white/20 hover:border-yellow-400 active:scale-98 transition flex items-center justify-between" data-target-id="${card.id}">
      <span class="font-bold text-white text-sm">"${card.text}"</span>
      <span class="text-xs text-yellow-300 font-bold ml-2">Vote 🗳️</span>
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
    ctrlElements.ctrlResultSubtitle.textContent = `Your answer won with ${myCard.votes} votes!`;
    confetti({ particleCount: 70, spread: 70 });
  } else {
    ctrlElements.ctrlResultIcon.textContent = '🗳️';
    ctrlElements.ctrlResultTitle.textContent = 'VOTES TALLIED';
    ctrlElements.ctrlResultSubtitle.textContent = myCard ? `Your answer got ${myCard.votes} votes!` : 'Round finished!';
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
        b.classList.remove('border-yellow-400', 'bg-white/10');
        b.classList.add('border-transparent');
      });
      btn.classList.add('border-yellow-400', 'bg-white/10');
      btn.classList.remove('border-transparent');
      playerProfile.avatar = btn.getAttribute('data-avatar');
      window.sound.playPop();
    });
  });

  // Join Room
  ctrlElements.btnJoinGame.addEventListener('click', () => {
    const code = ctrlElements.inputRoomCode.value.trim().toUpperCase();
    const name = ctrlElements.inputPlayerName.value.trim() || 'Contestant';
    if (!code || code.length < 3) {
      ctrlElements.joinErrorMsg.textContent = 'Please enter a valid room code!';
      ctrlElements.joinErrorMsg.classList.remove('hidden');
      return;
    }

    ctrlElements.joinErrorMsg.classList.add('hidden');
    socket.emit('player:join_room', {
      roomCode: code,
      name,
      avatar: playerProfile.avatar
    });
  });

  // Reaction Buttons (Cheer, Fire, Skull, etc.)
  ctrlElements.btnReactions.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      socket.emit('player:reaction', {
        roomCode: currentRoom,
        emoji,
        playerName: playerProfile.name
      });
      window.sound.playPop();
    });
  });

  // Speed Trivia Shape Tap
  ctrlElements.shapePads.forEach(pad => {
    pad.addEventListener('click', () => {
      if (pad.disabled) return;
      const choice = parseInt(pad.getAttribute('data-choice'), 10);
      const elapsed = Date.now() - questionStartTime;
      const timeRemainingMs = Math.max(100, 15000 - elapsed);

      // Lock buttons
      ctrlElements.shapePads.forEach(p => {
        p.disabled = true;
        if (p === pad) {
          p.classList.add('selected');
        } else {
          p.classList.add('disabled');
        }
      });

      ctrlElements.speedLockBanner.classList.add('bg-emerald-600/40', 'border-emerald-400');
      ctrlElements.speedStatusText.textContent = '🔒 ANSWER LOCKED IN! WAITING FOR TV...';

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

  function updateSlider(clientX) {
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    currentSliderValue = percent;

    dial.style.left = `${percent}%`;
    ctrlElements.ctrlSliderValLabel.textContent = `Dial Position: ${percent}%`;

    // Live sync to host board
    socket.emit('player:spectrum_slider_move', {
      roomCode: currentRoom,
      value: percent
    });
    window.sound.playDialTick();
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

