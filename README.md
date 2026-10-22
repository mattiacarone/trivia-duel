# ⚡ Trivia Duel - Multiplayer Party Game Prototype

> **Inspired by Jackbox Games & Kahoot!**
> A modern web-based party game where one host screen runs on a TV/Laptop/Projector and up to 50 players join as contestants using their smartphones as game controllers via a simple 4-digit room code.

---

## 🎮 Core Game Modes

### 1. ⚡ Speed Duel (Battle Royale Trivia)
- **Mechanic:** Rapid 15-second countdown multiple-choice trivia.
- **Controller Interface:** 4 massive tactile shape pads (▲ Red Triangle, ◆ Blue Diamond, ● Yellow Circle, ■ Green Square) designed for instant one-thumb reaction.
- **Scoring:** Rewards both correct answers and reaction speed (up to 500 bonus points for millisecond response time) + combo streak multipliers (🔥 x2, x3, x4).
- **Post-Round:** Highlights the winner, shows answer selection distribution, and reveals a fascinating fun fact breakdown.

### 2. 🎯 "The Spectrum" Co-op Mode (Wavelength-Inspired)
- **Mechanic:** The entire group works together rather than competing 1v1.
- **The Board:** A hidden target zone is placed somewhere on a spectrum between two polar opposites (e.g. *"Worst Superpower"* ⟷ *"God-Tier Superpower"* or *"Mildly Annoying"* ⟷ *"Straight to Federal Prison"*).
- **The Psychic:** One rotating contestant is the "Psychic" who is secretly shown the target location. The psychic types a single clue (e.g., *"Being able to speak to pigeons"*).
- **Team Dial Sync:** The team debates and drags an interactive dial in real time. The TV screen mirrors the movement live as players adjust their mobile sliders.
- **The Reveal:** The curtain opens to reveal the bullseye! Points awarded based on proximity (Bullseye = 4 pts, Inner Ring = 3 pts, Close = 2 pts).

### 3. 👑 "Majority Rules" Mode (Quiplash / Crowd Consensus)
- **Mechanic:** Subjective, hilarious social party game questions (e.g. *"What is the undisputed champion of late-night fast food at 2 AM?"* or *"If animals could talk, which one would have the worst attitude?"*).
- **Phase 1 (Writing):** Contestants type their creative, witty answers on their phones.
- **Phase 2 (Anonymous Cards):** Answers appear on the host screen as anonymous cards.
- **Phase 3 (Voting):** Players tap on their mobile phones to cast votes for their favorite answer or the one they believe the room will pick.
- **Phase 4 (The Jackpot):** Votes are revealed. Authors gain 400 pts per vote, and players who matched the majority consensus win a 500 pt crowd jackpot!

---

## 💰 Monetization Architecture (IAPs, Subscriptions & Printables)

1. **Themed Premium Trivia Packs ($1.99 – $4.99 each):**
   - **Free Starter Pack:** 100 general pop culture & quirky questions included out of the box.
   - **Dev Humor & Tech Lore ($3.49):** Git disasters, StackOverflow tears, legacy bugs, and Silicon Valley lore.
   - **90s Cartoons & Saturday TV ($2.99):** Nostalgia-packed Rugrats, Dexter's Lab, Sailor Moon.
   - **True Crime Fanatics ($3.99):** Unsolved cryptograms, legendary art heists, forensic breakthroughs.
   - **Bachelorette / Bachelor Party Pack ($4.99):** Pop culture weddings, champagne trivia, icebreakers.

2. **"Pro Host" SaaS Subscription ($4.99/mo):**
   - Targeted at Twitch/YouTube streamers, school teachers, pub trivia hosts, and corporate HR / remote team-building managers.
   - Unlocks:
     - 50-player lobby capacity (vs 8 on free tier).
     - Custom company/channel logo upload directly onto the host board.
     - Custom vanity 4-letter room codes (e.g. `TECH`, `ACME`).
     - Profanity filter.
     - Unlimited AI Pack Generation.

3. **Etsy Printable Party Kits (PDF Flashcards):**
   - Host can export high-resolution printable PDF trivia cards and scorecards for physical tabletop game nights.

---

## ✨ AI Automation Engine (Gemini API Integration)

- **AI Pack Studio:** Directly accessible from the Host top bar.
- Enter any topic (e.g. *"90s Grunge Music"*, *"Formula 1 Racing"*, *"Quantum Computing & Memes"*), select difficulty (Casual / Spicy / Hardcore), and generate a fully structured 5-question pack with options, correct answer, and detailed fun facts in under 2 seconds.
- Instantly loads the generated pack into the active lobby for immediate play.

---

## 🏗️ Technical Architecture

- **Backend:** Node.js, Express, Socket.IO.
- **Frontend:** Vanilla modern HTML5 / Tailwind CSS / Web Audio API synthesizer for retro sound FX (zero external audio file dependencies).
- **Real-Time Bidirectional Sync:** Socket.IO WebSocket protocol syncs phone controllers with the host screen in real time (< 30ms latency).
- **Built-in Mobile Simulator Dock:** A collapsible floating iPhone preview on the Host screen allowing instant 1-screen multi-device testing without needing a second phone or window.
- **AI Bot Simulation:** 1-click "+1 AI Bot" and "+3 AI Bots" buttons in the lobby to test full 4+ player games instantly with realistic human reaction times and randomized witty answers.

---

## 🚀 Quickstart Guide

### 1. Launch Server
```bash
npm start
```

### 2. Open Interfaces
- **Host TV / Board:** [http://localhost:3000/host](http://localhost:3000/host)
- **Player Mobile Controller:** [http://localhost:3000/play](http://localhost:3000/play) (or scan the live QR code on the host screen using any phone on the same Wi-Fi!)
- **Landing Page:** [http://localhost:3000](http://localhost:3000)

### 3. Run Automated Integration Tests
```bash
npm test
```

