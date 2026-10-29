/**
 * Quantum Computing Lab - Application Orchestration & UI Controllers
 * Affiliation: Ada Lovelace Software Pvt. Ltd. & STPI Bengaluru
 * Dr. Rakesh L, Chief AI & Quantum Scientist
 */

(function () {
  'use strict';

  // Complete Scientific Kannada Translations for All 10 Experiments
  const TRANSLATIONS_KN = [
    {
      aim: 'ಉದ್ದೇಶ: H ಮತ್ತು X ಗೇಟ್‌ಗಳು ಕ್ಯೂಬಿಟ್ ಅನ್ನು ಹೇಗೆ ಚಲಿಸುತ್ತವೆ ಮತ್ತು ಅಳತೆ ಮಾಡಿದಾಗ ಏನಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: H ಗೇಟ್ ಬಾಣವನ್ನು ಉತ್ತರ ಧ್ರುವದಿಂದ ಸಮಭಾಜಕ ರೇಖೆಗೆ ತರುತ್ತದೆ; ಅಂದರೆ ಸೊನ್ನೆ ಮತ್ತು ಒಂದರ ಸಮ ಮಿಶ್ರಣ. X ಗೇಟ್ ಅದನ್ನು ದಕ್ಷಿಣ ಧ್ರುವಕ್ಕೆ ತಿರುಗಿಸುತ್ತದೆ. ಅಳತೆ ಮಾಡಿದಾಗ ಬಾಣ ಒಂದು ಧ್ರುವಕ್ಕೆ ಜಿಗಿಯುತ್ತದೆ.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ಸಿದ್ಧಪಡಿಸಿದ ಕ್ಯೂಬಿಟ್ ಅನ್ನು ಹಲವು ಬಾರಿ ಅಳತೆ ಮಾಡಿ, ಎಣಿಕೆಗಳನ್ನು ಸಿದ್ಧಾಂತದೊಂದಿಗೆ ಹೋಲಿಸುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: H ಗೇಟ್ ಹಾಕಿದಾಗ ಫಲಿತಾಂಶ ನ್ಯಾಯಯುತ ನಾಣ್ಯದಂತೆ ಸುಮಾರು ಐವತ್ತು-ಐವತ್ತು ಶೇಕಡಾ ಇರುತ್ತದೆ; ಹೆಚ್ಚು ಶಾಟ್‌ಗಳನ್ನು ಬಳಸಿದಂತೆ ಅದು ಇನ್ನಷ್ಟು ಹತ್ತಿರವಾಗುತ್ತದೆ. H ಗೇಟ್ ಅನ್ನು ಎರಡು ಬಾರಿ ಹಾಕಿದರೆ ಕ್ಯೂಬಿಟ್ ಮತ್ತೆ ಸೊನ್ನೆಗೆ ಮರಳುತ್ತದೆ; ಇದೇ ಇಂಟರ್ಫರೆನ್ಸ್.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ಗೇಟ್‌ಗಳನ್ನು ಒಂದೊಂದಾಗಿ ಸೇರಿಸಿ ಸರ್ಕ್ಯೂಟ್ ನಿರ್ಮಿಸಿ, ಬೆಲ್ ಸ್ಥಿತಿಯನ್ನು ರಚಿಸುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: ಮೊದಲ ಕ್ಯೂಬಿಟ್ ಮೇಲೆ H ಹಾಕಿದರೆ ಸೊನ್ನೆ ಸೊನ್ನೆ ಮತ್ತು ಒಂದು ಸೊನ್ನೆಯ ಸಮ ಮಿಶ್ರಣ ಸಿಗುತ್ತದೆ. ನಂತರ CNOT ಎರಡನೇ ಕ್ಯೂಬಿಟ್ ಅನ್ನು ಜೋಡಿಸುತ್ತದೆ. ಅಳತೆಯಲ್ಲಿ ಸೊನ್ನೆ ಸೊನ್ನೆ ಅಥವಾ ಒಂದು ಒಂದು ಮಾತ್ರ ಬರುತ್ತದೆ, ಪ್ರತಿಯೊಂದೂ ಸುಮಾರು ಅರ್ಧದಷ್ಟು; ಸೊನ್ನೆ ಒಂದು ಅಥವಾ ಒಂದು ಸೊನ್ನೆ ಎಂದಿಗೂ ಬರುವುದಿಲ್ಲ.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ನಿಯಂತ್ರಣ ಕ್ಯೂಬಿಟ್ ಒಂದಾಗಿದ್ದಾಗ ಮಾತ್ರ CNOT ಗುರಿ ಕ್ಯೂಬಿಟ್ ಅನ್ನು ತಿರುಗಿಸುತ್ತದೆ ಎಂದು ಪರಿಶೀಲಿಸುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: ನಿಯಂತ್ರಣ ಕ್ಯೂಬಿಟ್ ಒಂದಾಗಿದ್ದರೆ ಮಾತ್ರ CNOT ಗುರಿಯನ್ನು ತಿರುಗಿಸುತ್ತದೆ. ಆದ್ದರಿಂದ ಸೊನ್ನೆ ಒಂದು ಹಾಗೆಯೇ ಉಳಿಯುತ್ತದೆ, ಒಂದು ಸೊನ್ನೆ ಒಂದು ಒಂದು ಆಗುತ್ತದೆ, ಮತ್ತು ಒಂದು ಒಂದು ಒಂದು ಸೊನ್ನೆ ಆಗುತ್ತದೆ.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ಹಂತದ ಬದಲಾವಣೆಯು (Phase change) ಎರಡು ಹಡಮಾರ್ಡ್ ಗೇಟ್‌ಗಳ ಫಲಿತಾಂಶವನ್ನು ಹೇಗೆ ನಿರ್ಧರಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: ಹಂತವು 0° ಯಿಂದ 180° ಗೆ ಬದಲಾದಂತೆ 1 ಬರುವ ಸಂಭವನೀಯತೆಯು 0 ಯಿಂದ 1 ರವರೆಗೆ ಸರಾಗವಾಗಿ ಏರುತ್ತದೆ. ಇದೇ ಕ್ವಾಂಟಮ್ ಇಂಟರ್ಫರೆನ್ಸ್ (ವ್ಯತಿಕರಣ).'
    },
    {
      aim: 'ಉದ್ದೇಶ: ಎಂಟ್ಯಾಂಗಲ್‌ಮೆಂಟ್ ಮತ್ತು ಎರಡು ಸಾಂಪ್ರದಾಯಿಕ ಬಿಟ್‌ಗಳನ್ನು ಬಳಸಿ ಅಜ್ಞಾತ ಕ್ಯೂಬಿಟ್ ಸ್ಥಿತಿಯನ್ನು ಟೆಲಿಪೋರ್ಟ್ ಮಾಡುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: ಬಾಬ್‌ನ ತಿದ್ದುಪಡಿಯ ನಂತರ, ಮೂಲ ಸ್ಥಿತಿಯೊಂದಿಗೆ ಬಾಬ್‌ನ ಕ್ಯೂಬಿಟ್ 100% ನಿಖರತೆಯನ್ನು (Fidelity) ಹೊಂದುತ್ತದೆ; ಯಾವುದೇ ಕ್ಯೂಬಿಟ್ ಅಥವಾ ದ್ರವ್ಯ ನೇರವಾಗಿ ಚಲಿಸುವುದಿಲ್ಲ.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ಕ್ವಾಂಟಮ್ ಎಂಟ್ಯಾಂಗಲ್‌ಮೆಂಟ್ ಅನ್ನು ಅಳೆಯುವುದು ಮತ್ತು ಕ್ಲಾಸಿಕಲ್ ಮಿತಿಯನ್ನು (CHSH Bell Inequality) ಮೀರುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: 45° ಕೋನದಲ್ಲಿ ಸ್ಕೋರ್ S ಸುಮಾರು 2.8 ಆಗಿದ್ದು, ಕ್ಲಾಸಿಕಲ್ ಗರಿಷ್ಠ ಮಿತಿಯಾದ 2 ಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಇದು ಈ ಪರಸ್ಪರ ಸಂಬಂಧಗಳು ನಿಜವಾದ ಕ್ವಾಂಟಮ್ ಎನ್ನುವುದನ್ನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ಕ್ವಾಂಟಮ್ ಪರಿಸರದ ಶಬ್ದ ಮತ್ತು ಡಿಕೊಹೆರೆನ್ಸ್ ಬೆಲ್ ಸ್ಥಿತಿಯನ್ನು ಹೇಗೆ ಹಾನಿಗೊಳಿಸುತ್ತವೆ ಎಂಬುದನ್ನು ನೋಡುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: ದೋಷದ ಪ್ರಮಾಣ ಹೆಚ್ಚಾದಂತೆ ನಿಷೇಧಿತ ಜೋಡಿಗಳಾದ 01 ಮತ್ತು 10 ರ ಪ್ರಮಾಣ ಹೆಚ್ಚಾಗುತ್ತದೆ ಮತ್ತು ಸರಿಯಾದ ಜೋಡಿಗಳ ಪಾಲು ಕಡಿಮೆಯಾಗುತ್ತದೆ.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ನಾಲ್ಕು ಅಂಶಗಳಲ್ಲಿ ಗುರುತಿಸಲಾದ ಅಂಶವನ್ನು ಗ್ರೋವರ್ ಶೋಧನಾ ಅಲ್ಗಾರಿದಮ್ ಮೂಲಕ ಒಂದೇ ಹಂತದಲ್ಲಿ ಕಂಡುಹಿಡಿಯುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: ಒರಾಕಲ್ ಮತ್ತು ಡಿಫ್ಯೂಷನ್ ಹಂತದ ನಂತರ, ಗುರುತಿಸಲಾದ ಐಟಂನ ಸಂಭವನೀಯತೆಯು 100% ತಲುಪುತ್ತದೆ.'
    },
    {
      aim: 'ಉದ್ದೇಶ: ಎಂಟ್ಯಾಂಗಲ್ಡ್ ಜೋಡಿಯ ಫಲಿತಾಂಶಗಳನ್ನು ಸ್ವತಂತ್ರ ಕ್ಯೂಬಿಟ್‌ಗಳ ಜೋಡಿಯೊಂದಿಗೆ ಹೋಲಿಸುವುದು.',
      obs: 'ವೀಕ್ಷಣೆ: ಎಂಟ್ಯಾಂಗಲ್ಡ್ ಜೋಡಿಯು ಪ್ರತಿ ಬಾರಿಯೂ (100%) ಒಂದೇ ಫಲಿತಾಂಶವನ್ನು ನೀಡುತ್ತದೆ, ಆದರೆ ಸ್ವತಂತ್ರ ಕ್ಯೂಬಿಟ್‌ಗಳು ಶೇಕಡಾ 50 ರಷ್ಟು ಮಾತ್ರ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತವೆ.'
    }
  ];

  // English Narration Scripts for Synced Subtitles & Audio
  const NARRATIONS_EN = [
    "Experiment one: the qubit and the Bloch sphere. The aim is to see how H and X gates move a qubit, and what measuring does to it. Procedure: Start with the qubit at the north pole, the state zero. Press Apply H and watch the arrow travel to the equator. Press Apply X to flip it to the south pole. Then press Measure, and reset to try again. Explanation: A qubit state is a point on a sphere. The north pole is zero and the south pole is one. H turns zero into an equal mix of zero and one, so the arrow lands on the equator. X is the NOT gate. It swaps zero and one. Measuring forces a choice, so the arrow snaps to one pole. Observation: H moves the arrow from the north pole to the equator, an equal mix of zero and one. X flips it to the south pole. Measuring snaps the arrow to one pole.",
    "Experiment two: superposition and measurement. The aim is to measure a prepared qubit many times and compare the counts with the theory. Procedure: Choose H on zero, and run ten shots. Then run a thousand shots. Compare the measured bar with the theory bar. Finally choose H then H, and run again. Explanation: Each shot is one run of the circuit and one measurement. The result is random, but the odds are fixed by the state. With H, the odds are fifty fifty, so a few shots look uneven and many shots look fair. Applying H twice makes the paths interfere, and the amplitude for one cancels, so you always get zero. Observation: With H the result is a fair coin. It is close to fifty fifty, and gets closer with more shots. Applying H twice returns the qubit to zero, which is interference.",
    "Experiment three: the Bell state lab. The aim is to build a circuit gate by gate and create the Bell state. Procedure: Apply H on qubit zero. Then apply CNOT from qubit zero to qubit one. Check that the state reads zero zero plus one one, over root two. Run a thousand shots and look for zero one and one zero. Explanation: H puts the first qubit in superposition. CNOT copies that choice onto the second qubit, but without fixing it. The two qubits now share one joint state, which cannot be split into separate states. That is entanglement. Each result alone is random, but the two always match. Observation: H on the first qubit gives an equal mix of zero zero and one zero. CNOT then links the second qubit. Measurements give only zero zero or one one, each about half, and never zero one or one zero.",
    "Experiment four: the CNOT truth table. The aim is to verify that CNOT flips the target only when the control is one. Procedure: Press Run on each of the four rows in turn. Watch the target circle. Note which inputs change the output. Explanation: CNOT has a control qubit and a target qubit. If the control is zero, nothing happens. If the control is one, the target is flipped. This conditional action is what lets two qubits become linked, and it is the second ingredient of the Bell state. Observation: CNOT flips the target only when the control is one. So zero one stays, one zero becomes one one, and one one becomes one zero.",
    "Experiment five: interference with a phase slider. The aim is to see how a phase change decides the outcome of two Hadamard gates. Procedure: Set the phase to zero degrees and run a thousand shots. Slide the phase to ninety degrees, then to one hundred eighty, and run again at each setting. Explanation: The first H splits the qubit into two paths. The phase gate shifts one path. The second H recombines them, and the paths either add or cancel. At zero degrees the one cancels, and at one hundred eighty degrees the zero cancels. Observation: The chance of measuring one rises smoothly from zero to one as the phase goes from zero to one hundred eighty degrees. This is quantum interference.",
    "Experiment six: quantum teleportation. The aim is to send an unknown qubit state using entanglement and two classical bits. Procedure: Choose a state with the angle slider. Press Next step to prepare it, make the Bell pair, let Alice entangle and measure, and let Bob correct. Compare Bob's qubit with the original. Explanation: Alice and Bob share a Bell pair. Alice's measurement gives two random classical bits and destroys her copy. Bob applies a fix based on those bits, and his qubit becomes exactly the original state. No qubit travels, and nothing moves faster than light. Observation: After the correction, Bob's qubit matches the original with fidelity one, whatever the measurement result was.",
    "Experiment seven: the CHSH Bell test. The aim is to measure entanglement and beat the classical limit. Procedure: Set Bob's angle to forty five degrees. Press Run shots and read the score S. Then slide the angle to zero and run again. Explanation: Alice and Bob measure a Bell pair at different angles, and the score S combines four correlations. Any classical model with hidden information scores at most two. Quantum mechanics predicts up to two root two, about two point eight three. Observation: At forty five degrees the score is about two point eight, above the classical limit of two, which shows the correlations are truly quantum.",
    "Experiment eight: noise and decoherence. The aim is to see how errors damage a Bell state. Procedure: Set the error rate to zero and run a thousand shots. Raise the error rate to ten percent and run again. Try twenty five percent. Explanation: Real qubits are disturbed by heat and stray fields, which sometimes flip a bit. A flipped bit turns zero zero into zero one, so results that should never appear start to show up. Observation: As the error rate rises, the wrong pairs, zero one and one zero, grow, and the share of correct pairs falls. This is why error correction is needed.",
    "Experiment nine: Grover search on two qubits. The aim is to find a marked item among four in a single step. Procedure: Choose the marked item. Press Next step to create an equal superposition, flip the sign of the marked item with the oracle, and apply the diffusion step. Then measure. Explanation: Grover's algorithm boosts the marked answer. The oracle flips its sign. The diffusion step reflects every amplitude about the average, which shrinks the others and enlarges the marked one. With four items, one round reaches certainty, while a classical search needs up to three tries. Observation: After one oracle and one diffusion step, the marked item has probability one hundred percent.",
    "Experiment ten: entanglement. The aim is to compare the measurement results of an entangled pair with a pair of independent qubits. Procedure: Choose the entangled pair and run two hundred pairs. Then choose independent qubits and run again. Compare the match rate. Explanation: Each qubit of an entangled pair gives a random result on its own. But the two results always agree, because the qubits share one joint state. Independent qubits agree only half the time, by chance. No signal passes between the qubits. Observation: The entangled pair matches every time, one hundred percent. The independent pair matches about half the time."
  ];

  // State Management
  let currentExp = 0;
  let currentLang = 'en';
  let activeAudio = null;
  const hasTTS = 'speechSynthesis' in window;

  // DOM Elements Cache
  const navItems = document.querySelectorAll('.exp-nav-item');
  const expSections = document.querySelectorAll('.exp-section');
  const langSelect = document.getElementById('select-lang');
  const themeToggle = document.getElementById('btn-theme-toggle');
  const studentNameInput = document.getElementById('input-student-name');
  const studentRollInput = document.getElementById('input-student-roll');
  const ttsStatusPill = document.getElementById('tts-status-pill');
  const searchInput = document.getElementById('sidebar-search-input');
  const progressBadge = document.getElementById('session-progress-badge');

  // Load Saved Preferences
  function initPreferences() {
    const savedTheme = localStorage.getItem('quantum_lab_theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    const savedName = localStorage.getItem('quantum_student_name');
    const savedRoll = localStorage.getItem('quantum_student_roll');
    if (savedName && studentNameInput) studentNameInput.value = savedName;
    if (savedRoll && studentRollInput) studentRollInput.value = savedRoll;

    if (studentNameInput) {
      studentNameInput.addEventListener('input', () => {
        localStorage.setItem('quantum_student_name', studentNameInput.value.trim());
      });
    }
    if (studentRollInput) {
      studentRollInput.addEventListener('input', () => {
        localStorage.setItem('quantum_student_roll', studentRollInput.value.trim());
      });
    }
  }

  // Theme Switching
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quantum_lab_theme', theme);
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'none' : 'block';
      moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Check Text-To-Speech Engine
  function getVoiceForLang(lang) {
    if (!hasTTS) return null;
    const voices = speechSynthesis.getVoices();
    const clean = s => s.lang.replace('_', '-').toLowerCase();
    if (lang === 'kn') {
      return voices.find(v => clean(v).startsWith('kn'));
    }
    return voices.find(v => clean(v) === 'en-in') ||
           voices.find(v => clean(v).startsWith('en'));
  }

  function updateTTSStatus() {
    if (!ttsStatusPill) return;
    if (!hasTTS) {
      ttsStatusPill.innerHTML = '<span class="tts-dot" style="background:#ef4444"></span> Speech: Unsupported';
      ttsStatusPill.title = 'Browser does not support Web Speech API.';
      return;
    }
    if (currentLang === 'kn') {
      const knVoice = getVoiceForLang('kn');
      if (knVoice) {
        ttsStatusPill.innerHTML = `<span class="tts-dot"></span> Kannada TTS: ${knVoice.name.slice(0, 16)}`;
        ttsStatusPill.classList.add('active');
      } else {
        ttsStatusPill.innerHTML = `<span class="tts-dot" style="background:#f59e0b"></span> Kannada TTS: Device Fallback`;
        ttsStatusPill.classList.remove('active');
        ttsStatusPill.title = 'No native Kannada voice found. Google Chrome on Android or Microsoft Edge recommended for Kannada TTS.';
      }
    } else {
      ttsStatusPill.innerHTML = '<span class="tts-dot"></span> Studio Voice Narration Active';
      ttsStatusPill.classList.add('active');
    }
  }

  if (hasTTS) {
    speechSynthesis.onvoiceschanged = updateTTSStatus;
  }

  // Multilingual Support
  function setLanguage(lang) {
    currentLang = lang;
    stopAllAudio();

    expSections.forEach((section, idx) => {
      const aimText = section.querySelector('.aim-text');
      const obsText = section.querySelector('.obs-text');
      const narBtn = section.querySelector('.audio-track-label');

      if (lang === 'kn') {
        const trans = TRANSLATIONS_KN[idx];
        if (aimText && trans) aimText.textContent = trans.aim;
        if (obsText && trans) obsText.textContent = trans.obs;
        if (narBtn) narBtn.textContent = 'ಧ್ವನಿ ವಿವರಣೆ ಕೇಳಿ (Kannada Voice)';
      } else {
        // Restore English from original data attributes
        if (aimText && aimText.dataset.en) aimText.textContent = aimText.dataset.en;
        if (obsText && obsText.dataset.en) obsText.textContent = obsText.dataset.en;
        if (narBtn) narBtn.textContent = 'Play Voice-Over Narration';
      }
    });

    updateTTSStatus();
  }

  if (langSelect) {
    langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  // Navigation & Experiment Switching
  function selectExperiment(idx) {
    if (idx < 0 || idx >= expSections.length) return;
    currentExp = idx;
    stopAllAudio();

    navItems.forEach((btn, i) => {
      const isActive = i === idx;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    expSections.forEach((sec, i) => {
      sec.style.display = i === idx ? 'block' : 'none';
      sec.hidden = i !== idx;
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateProgress();
  }

  navItems.forEach((btn, i) => {
    btn.addEventListener('click', () => selectExperiment(i));
  });

  // Sidebar Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      navItems.forEach(item => {
        const title = item.querySelector('.exp-title-text').textContent.toLowerCase();
        const index = item.querySelector('.exp-index').textContent.toLowerCase();
        const matches = title.includes(q) || index.includes(q);
        item.style.display = matches ? 'flex' : 'none';
      });
    });
  }

  // Audio Playback & Synchronized Subtitle System
  function stopAllAudio() {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    if (hasTTS) speechSynthesis.cancel();

    document.querySelectorAll('.audio-play-btn').forEach(btn => {
      btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      btn.title = "Play Narration";
    });
    document.querySelectorAll('.synced-captions span').forEach(s => s.classList.remove('highlight'));
  }

  function setupAudioPlayer(section, expIndex) {
    const playBtn = section.querySelector('.audio-play-btn');
    const audioEl = section.querySelector('.exp-audio-tag');
    const progressFill = section.querySelector('.audio-progress-fill');
    const progressBar = section.querySelector('.audio-progress-bar');
    const timeLabel = section.querySelector('.audio-time-label');
    const captionContainer = section.querySelector('.synced-captions');

    if (!playBtn || !audioEl || !captionContainer) return;

    // Populate captions split by sentences
    const sentences = NARRATIONS_EN[expIndex].match(/[^.!?]+[.!?]?\s*/g) || [];
    captionContainer.innerHTML = sentences.map(s => `<span>${s}</span>`).join('');
    const captionSpans = [...captionContainer.querySelectorAll('span')];

    const fmtTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Update progress and highlight active sentence
    audioEl.ontimeupdate = () => {
      const dur = audioEl.duration || 1;
      const cur = audioEl.currentTime;
      if (progressFill) progressFill.style.width = `${(cur / dur) * 100}%`;
      if (timeLabel) timeLabel.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;

      const fraction = cur / dur;
      const targetChar = fraction * NARRATIONS_EN[expIndex].length;
      let accum = 0;
      let activeIdx = 0;
      for (let k = 0; k < sentences.length; k++) {
        accum += sentences[k].length;
        if (targetChar <= accum) {
          activeIdx = k;
          break;
        }
      }

      captionSpans.forEach((span, k) => {
        span.classList.toggle('highlight', k === activeIdx && !audioEl.paused);
      });
    };

    audioEl.onended = () => {
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      captionSpans.forEach(s => s.classList.remove('highlight'));
      activeAudio = null;
    };

    // Seek on progress bar click
    if (progressBar) {
      progressBar.onclick = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (audioEl.duration) audioEl.currentTime = pos * audioEl.duration;
      };
    }

    playBtn.onclick = () => {
      if (currentLang === 'kn') {
        // Use Kannada SpeechSynthesis
        if (!hasTTS) {
          alert('Speech synthesis is not supported on this device.');
          return;
        }
        speechSynthesis.cancel();
        const trans = TRANSLATIONS_KN[expIndex];
        const text = `${trans.aim} ${trans.obs}`;
        const utter = new SpeechSynthesisUtterance(text);
        const voice = getVoiceForLang('kn');
        if (voice) utter.voice = voice;
        utter.lang = voice ? voice.lang : 'kn-IN';
        utter.rate = 0.9;
        speechSynthesis.speak(utter);
        return;
      }

      // English Pre-recorded Audio
      if (audioEl.paused) {
        stopAllAudio();
        audioEl.play().then(() => {
          activeAudio = audioEl;
          playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
          playBtn.title = "Pause Narration";
        }).catch(err => {
          console.warn('Audio play prevented:', err);
        });
      } else {
        audioEl.pause();
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        playBtn.title = "Play Narration";
      }
    };
  }

  // Interactive Checklist Steps
  function setupChecklist() {
    document.querySelectorAll('.procedure-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('done');
        const box = item.querySelector('.step-checkbox');
        if (box) box.textContent = item.classList.contains('done') ? '✓' : '';
        updateProgress();
      });
    });
  }

  function updateProgress() {
    let completedExps = 0;
    expSections.forEach((sec, idx) => {
      const items = sec.querySelectorAll('.procedure-item');
      const allDone = items.length > 0 && [...items].every(it => it.classList.contains('done'));
      const navItem = navItems[idx];
      if (navItem) {
        navItem.classList.toggle('completed', allDone);
      }
      if (allDone) completedExps++;
    });

    if (progressBadge) {
      progressBadge.textContent = `${completedExps} of 10 Experiments Completed`;
    }
  }

  // Introduction Modal Controls
  function initIntro() {
    const introBackdrop = document.getElementById('intro-modal-backdrop');
    const introAudio = document.getElementById('intro-audio-tag');
    const beginBtn = document.getElementById('btn-intro-begin');
    const skipBtn = document.getElementById('btn-intro-skip');
    const replayBtn = document.getElementById('btn-replay-intro');

    const closeIntro = () => {
      if (introAudio) {
        introAudio.pause();
        introAudio.currentTime = 0;
      }
      if (introBackdrop) introBackdrop.classList.add('hidden');
    };

    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        if (introAudio) {
          introAudio.play().catch(() => {});
        }
        setTimeout(closeIntro, 4000);
      });
    }

    if (skipBtn) skipBtn.addEventListener('click', closeIntro);

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        if (introBackdrop) {
          introBackdrop.classList.remove('hidden');
          if (introAudio) {
            introAudio.currentTime = 0;
            introAudio.play().catch(() => {});
          }
        }
      });
    }
  }

  // Voice-Over Script Modal
  function initScriptModal() {
    const modal = document.getElementById('modal-script');
    const openBtn = document.getElementById('btn-open-script-modal');
    const closeBtn = document.getElementById('btn-close-script-modal');
    const scriptPre = document.getElementById('pre-voiceover-script');
    const copyBtn = document.getElementById('btn-copy-script');
    const downloadBtn = document.getElementById('btn-download-script');

    const generateScriptText = () => {
      const titles = [
        "1: Qubit and the Bloch Sphere",
        "2: Superposition and Measurement",
        "3: Bell State Laboratory",
        "4: CNOT Truth Table",
        "5: Interference with Phase Shift",
        "6: Quantum Teleportation",
        "7: CHSH Bell Inequality Test",
        "8: Noise and Decoherence",
        "9: Grover Search on Two Qubits",
        "10: Entangled vs Independent Pairs"
      ];

      return titles.map((t, i) => {
        if (currentLang === 'kn') {
          const trans = TRANSLATIONS_KN[i];
          return `ಪ್ರಯೋಗ ${t}\n${trans.aim}\n${trans.obs}`;
        }
        return `Experiment ${t}\n${NARRATIONS_EN[i]}`;
      }).join('\n\n========================================\n\n');
    };

    if (openBtn && modal) {
      openBtn.onclick = () => {
        if (scriptPre) scriptPre.textContent = generateScriptText();
        modal.classList.add('open');
      };
    }

    if (closeBtn && modal) {
      closeBtn.onclick = () => modal.classList.remove('open');
    }

    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(generateScriptText());
          copyBtn.textContent = 'Copied to Clipboard!';
          setTimeout(() => { copyBtn.textContent = 'Copy Script'; }, 2000);
        } catch (e) {
          alert('Could not copy automatically. Please select text and copy manually.');
        }
      };
    }

    if (downloadBtn) {
      downloadBtn.onclick = () => {
        const text = generateScriptText();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quantum-lab-narration-${currentLang}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    }
  }

  // Academic Laboratory Report Generator
  function initReportGenerator() {
    const reportBtn = document.getElementById('btn-generate-report');
    if (!reportBtn) return;

    reportBtn.onclick = () => {
      const studentName = studentNameInput ? studentNameInput.value.trim() || 'Anonymous Student' : 'Anonymous Student';
      const studentRoll = studentRollInput ? studentRollInput.value.trim() || 'N/A' : 'N/A';
      const now = new Date().toLocaleString();

      const expRows = [
        { num: 1, title: 'Qubit and the Bloch Sphere', res: document.getElementById('out-exp1')?.innerText.replace(/\n/g, ' ') || 'Completed' },
        { num: 2, title: 'Superposition & Measurement', res: document.getElementById('select-state2')?.selectedOptions[0].text + ' evaluated under ' + document.getElementById('select-shots2')?.value + ' shots' },
        { num: 3, title: 'Bell State Lab', res: document.getElementById('out-exp3')?.innerText.replace(/\n/g, ' ') || 'Completed' },
        { num: 4, title: 'CNOT Truth Table', res: document.getElementById('cnot-status-text')?.textContent || 'Unitary evaluated' },
        { num: 5, title: 'Interference with Phase Slider', res: document.getElementById('out-exp5')?.innerText.replace(/\n/g, ' ') || 'Completed' },
        { num: 6, title: 'Quantum Teleportation Protocol', res: document.getElementById('out-exp6')?.innerText.replace(/\n/g, ' ') || 'Fidelity 100%' },
        { num: 7, title: 'CHSH Bell Inequality Test', res: document.getElementById('out-exp7')?.innerText.replace(/\n/g, ' ') || 'S calculated' },
        { num: 8, title: 'Noise & Decoherence', res: document.getElementById('out-exp8')?.innerText.replace(/\n/g, ' ') || 'Completed' },
        { num: 9, title: 'Grover Search on 2 Qubits', res: document.getElementById('out-exp9')?.innerText.replace(/\n/g, ' ') || 'Target identified' },
        { num: 10, title: 'Entangled vs Independent Qubits', res: document.getElementById('out-exp10')?.innerText.replace(/\n/g, ' ') || 'Correlations verified' }
      ];

      const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Quantum Computing Virtual Lab Report - ${studentName}</title>
  <style>
    body { font-family: 'Georgia', serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 40px auto; padding: 0 20px; }
    .header-box { border-bottom: 3px double #0f172a; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
    h1 { margin: 0 0 6px; font-size: 26px; color: #0f172a; }
    .affiliation { font-size: 14px; color: #475569; font-style: italic; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 15px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 14px; }
    th, td { border: 1px solid #94a3b8; padding: 10px 12px; text-align: left; vertical-align: top; }
    th { background: #0f172a; color: #ffffff; }
    tr:nth-child(even) { background: #f8fafc; }
    h2 { font-size: 18px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 24px; color: #0f172a; }
    .sign-box { margin-top: 48px; display: flex; justify-content: space-between; padding-top: 32px; border-top: 1px solid #94a3b8; font-size: 14px; }
    @media print { body { margin: 20px; } button { display: none; } }
  </style>
</head>
<body>
  <div class="header-box">
    <h1>Quantum Technologies Virtual Laboratory</h1>
    <div class="affiliation">Ada Lovelace Software Pvt. Ltd. & STPI Bengaluru</div>
    <div style="font-size:13px;color:#64748b;margin-top:4px">Academic Advisor: Dr. Rakesh L, Chief AI & Quantum Scientist</div>
  </div>

  <div class="meta-grid">
    <div><b>Student Name:</b> ${studentName}</div>
    <div><b>Roll Number / UID:</b> ${studentRoll}</div>
    <div><b>Generated Timestamp:</b> ${now}</div>
    <div><b>Curriculum Module:</b> 10 Guided Quantum Computing Experiments</div>
  </div>

  <h2>1. Experimental Execution & Simulation Results</h2>
  <table>
    <thead>
      <tr>
        <th style="width:40px">#</th>
        <th style="width:240px">Experiment Name</th>
        <th>Simulation & Measurement Output</th>
      </tr>
    </thead>
    <tbody>
      ${expRows.map(r => `
        <tr>
          <td><b>${r.num}</b></td>
          <td><b>${r.title}</b></td>
          <td>${r.res}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>2. Key Theoretical Observations</h2>
  <ol style="padding-left:20px;font-size:14px;line-height:1.7">
    <li><b>Hadamard gate:</b> Transitions states between basis eigenstates |0⟩, |1⟩ and equatorial superposition states |+⟩, |-⟩.</li>
    <li><b>Decoherence:</b> Environmental interactions introduce bit-flip errors, degrading entanglement fidelity.</li>
    <li><b>Quantum Non-Locality:</b> CHSH correlation parameter exceeds the Bell local-realism bound of S ≤ 2.0 up to Tsirelson's bound 2√2 ≈ 2.828.</li>
    <li><b>Quantum Search:</b> Grover amplitude amplification achieves deterministic identification of marked items in O(√N) iterations.</li>
  </ol>

  <div class="sign-box">
    <div>Student Signature: _______________________</div>
    <div>Faculty Evaluator: _______________________</div>
  </div>

  <div style="margin-top:30px;text-align:center">
    <button onclick="window.print()" style="padding:10px 20px;background:#0f172a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Print or Save as PDF</button>
  </div>
</body>
</html>`;

      // Download file natively via Blob
      const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantum-lab-report-${studentName.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
  }

  // Initialize Whole Application
  function initApp() {
    initPreferences();
    updateTTSStatus();

    // Cache English original aims & observations
    expSections.forEach(sec => {
      const aim = sec.querySelector('.aim-text');
      const obs = sec.querySelector('.obs-text');
      if (aim) aim.dataset.en = aim.textContent.trim();
      if (obs) obs.dataset.en = obs.textContent.trim();
    });

    // Wire up audio players for all 10 experiments
    expSections.forEach((sec, idx) => {
      setupAudioPlayer(sec, idx);
    });

    setupChecklist();
    initIntro();
    initScriptModal();
    initReportGenerator();

    // Initialize Simulation Engines
    if (window.ExpEngine) {
      window.ExpEngine.initAll();
    }

    selectExperiment(0);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
