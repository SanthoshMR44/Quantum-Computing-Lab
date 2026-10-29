/**
 * Quantum Computing Lab - Simulation Engines & Mathematics
 * Affiliation: Ada Lovelace Software Pvt. Ltd. & STPI Bengaluru
 * Dr. Rakesh L, Chief AI & Quantum Scientist
 */

(function (window) {
  'use strict';

  const hs = Math.SQRT1_2; // 1 / sqrt(2)
  const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const fmt = (x) => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(3).replace(/\.?0+$/, '');
  const getCss = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // Quantum Linear Algebra Engine
  const Quantum = {
    // Single Qubit Hadamard
    h(s, n, q) {
      const m = 1 << (n - 1 - q);
      for (let i = 0; i < s.length; i++) {
        if (!(i & m)) {
          const j = i | m, a = s[i], b = s[j];
          s[i] = (a + b) * hs;
          s[j] = (a - b) * hs;
        }
      }
    },
    // Pauli-X (NOT)
    x(s, n, q) {
      const m = 1 << (n - 1 - q);
      for (let i = 0; i < s.length; i++) {
        if (!(i & m)) {
          const j = i | m;
          [s[i], s[j]] = [s[j], s[i]];
        }
      }
    },
    // Pauli-Z (Phase flip)
    z(s, n, q) {
      const m = 1 << (n - 1 - q);
      for (let i = 0; i < s.length; i++) {
        if (i & m) s[i] = -s[i];
      }
    },
    // Controlled-NOT
    cx(s, n, c, t) {
      const mc = 1 << (n - 1 - c), mt = 1 << (n - 1 - t);
      for (let i = 0; i < s.length; i++) {
        if ((i & mc) && !(i & mt)) {
          const j = i | mt;
          [s[i], s[j]] = [s[j], s[i]];
        }
      }
    },
    // Computational Basis Measurement
    meas(s, n, q) {
      const m = 1 << (n - 1 - q);
      let p = 0;
      s.forEach((a, i) => { if (i & m) p += a * a; });
      const r = Math.random() < p ? 1 : 0;
      const nr = Math.sqrt(r ? p : (1 - p));
      s.forEach((a, i) => {
        s[i] = (((i & m) ? 1 : 0) === r) ? a / nr : 0;
      });
      return r;
    }
  };

  // Experiment Simulation Controller Objects
  const ExpEngine = {
    timers: {},

    // Reusable Probability Bar Generator
    createBars(container, labels) {
      container.innerHTML = labels.map(l => `
        <div class="prob-row">
          <span class="prob-label">|${l}⟩</span>
          <div class="prob-track">
            <div class="prob-bar theory" style="width: 0%"></div>
            <div class="prob-bar measured" style="width: 0%"></div>
          </div>
          <div class="prob-meta">theory 0%</div>
        </div>
      `).join('');

      const rows = [...container.querySelectorAll('.prob-row')];
      return (ideal, meas, tot) => {
        rows.forEach((row, i) => {
          const barTheory = row.querySelector('.prob-bar.theory');
          const barMeas = row.querySelector('.prob-bar.measured');
          const meta = row.querySelector('.prob-meta');

          barTheory.style.width = (ideal[i] * 100) + '%';
          barMeas.style.width = tot ? ((meas[i] / tot) * 100) + '%' : '0%';
          meta.textContent = tot
            ? `${((meas[i] / tot) * 100).toFixed(1)}% (${meas[i]})`
            : `theory ${(ideal[i] * 100).toFixed(0)}%`;
        });
      };
    },

    // Reusable Monte Carlo Shots Runner
    runShots(key, n, probs, onUpdate, onShot) {
      clearInterval(this.timers[key]);
      const counts = probs.map(() => 0);
      let t = 0;
      const batch = Math.max(1, Math.ceil(n / 25));

      this.timers[key] = setInterval(() => {
        for (let k = 0; k < batch && t < n; k++, t++) {
          let r = Math.random(), i = 0;
          while (i < probs.length - 1 && r > probs[i]) {
            r -= probs[i];
            i++;
          }
          counts[i]++;
          if (onShot) onShot(i);
        }
        onUpdate(counts, t);
        if (t >= n) clearInterval(this.timers[key]);
      }, 35);
    },

    // ==========================================
    // EXPERIMENT 1: Qubit & Bloch Sphere
    // ==========================================
    initExp1() {
      const canvas = document.getElementById('canvas-bloch');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let state = [1, 0]; // [alpha, beta]
      let vec = [0, 0, 1]; // [x, y, z] on sphere
      let anim = null;

      // Mouse drag rotation controls for 3D Bloch sphere
      let rotX = -0.55;
      let rotY = 0.3;
      let isDragging = false;
      let lastMouse = { x: 0, y: 0 };

      canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouse = { x: e.clientX, y: e.clientY };
      });
      window.addEventListener('mouseup', () => { isDragging = false; });
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        rotX += dx * 0.01;
        rotY = Math.max(-1.4, Math.min(1.4, rotY + dy * 0.01));
        lastMouse = { x: e.clientX, y: e.clientY };
        draw();
      });

      const getBlochCoords = () => [
        2 * state[0] * state[1],
        0,
        state[0] * state[0] - state[1] * state[1]
      ];

      const updateReadout = () => {
        const [a, b] = state;
        const p0 = (a * a * 100).toFixed(1);
        const p1 = (b * b * 100).toFixed(1);
        const out = document.getElementById('out-exp1');
        if (out) {
          out.innerHTML = `
            <div>Quantum State: <span class="ket">|ψ⟩</span> = <span class="amp">${fmt(a)}</span><span class="ket">|0⟩</span> + <span class="amp">${fmt(b)}</span><span class="ket">|1⟩</span></div>
            <div class="prob-line">P(|0⟩) = <b>${p0}%</b> &nbsp;|&nbsp; P(|1⟩) = <b>${p1}%</b></div>
          `;
        }
      };

      // Rodrigues Rotation Formula
      const rotateVector = (v, k, angle) => {
        const c = Math.cos(angle), s = Math.sin(angle);
        const dot = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
        const cross = [
          k[1] * v[2] - k[2] * v[1],
          k[2] * v[0] - k[0] * v[2],
          k[0] * v[1] - k[1] * v[0]
        ];
        return v.map((q, i) => q * c + cross[i] * s + k[i] * dot * (1 - c));
      };

      const step = (now) => {
        if (!anim) return;
        const progress = Math.min(1, (now - anim.t0) / 750);
        if (anim.k) {
          vec = rotateVector(anim.v0, anim.k, Math.PI * easeInOut(progress));
        } else {
          const target = anim.m ? [0, 0, -1] : [0, 0, 1];
          const interpolated = anim.v0.map((x, i) => x + (target[i] - x) * easeInOut(progress));
          const len = Math.hypot(...interpolated) || 1;
          vec = interpolated.map(x => x / len);
        }

        if (progress >= 1) {
          if (anim.gate === 'H') {
            state = [(state[0] + state[1]) * hs, (state[0] - state[1]) * hs];
          } else if (anim.gate === 'X') {
            state = [state[1], state[0]];
          } else if (anim.gate === 'Z') {
            state = [state[0], -state[1]];
          } else {
            state = anim.m ? [0, 1] : [1, 0];
          }
          anim = null;
          vec = getBlochCoords();
          updateReadout();
        }
      };

      const project = (x, y, z, cx, cy, R) => {
        const x1 = x * Math.cos(rotX) - y * Math.sin(rotX);
        const y1 = x * Math.sin(rotX) + y * Math.cos(rotX);
        return [
          cx + R * x1,
          cy - R * (z * Math.cos(rotY) + y1 * Math.sin(rotY))
        ];
      };

      const draw = () => {
        const dpr = window.devicePixelRatio || 1;
        const width = 420, height = 360;
        if (canvas.width !== width * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const R = 125;
        const ink = getCss('--text-primary');
        const mute = getCss('--text-muted');
        const cyan = getCss('--accent-cyan');
        const violet = getCss('--accent-violet');
        const amber = getCss('--accent-amber');

        // Main Sphere Outline
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = mute;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        // Equator and Meridian circles
        [0, 1].forEach((isMeridian) => {
          ctx.beginPath();
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            const p = isMeridian
              ? project(Math.cos(angle), 0, Math.sin(angle), cx, cy, R)
              : project(Math.cos(angle), Math.sin(angle), 0, cx, cy, R);
            if (i === 0) ctx.moveTo(...p);
            else ctx.lineTo(...p);
          }
          ctx.stroke();
        });

        // Axes: X, Y, Z
        ctx.setLineDash([3, 4]);
        [[0, 0, 1.25], [1.25, 0, 0], [0, 1.25, 0]].forEach(axis => {
          ctx.beginPath();
          ctx.moveTo(...project(-axis[0], -axis[1], -axis[2], cx, cy, R));
          ctx.lineTo(...project(axis[0], axis[1], axis[2], cx, cy, R));
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Axis Labels
        ctx.fillStyle = ink;
        ctx.font = '600 15px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        const p0 = project(0, 0, 1.25, cx, cy, R);
        const p1 = project(0, 0, -1.25, cx, cy, R);
        const px = project(1.25, 0, 0, cx, cy, R);
        ctx.fillText('|0⟩', p0[0], p0[1] - 8);
        ctx.fillText('|1⟩', p1[0], p1[1] + 18);
        ctx.fillText('|+⟩', px[0] + 18, px[1] + 5);

        // State Vector Arrow
        const tip = project(...vec, cx, cy, R);
        ctx.strokeStyle = amber;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(...tip);
        ctx.stroke();

        // Glowing State Point
        ctx.shadowColor = amber;
        ctx.shadowBlur = 12;
        ctx.fillStyle = amber;
        ctx.beginPath();
        ctx.arc(...tip, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      };

      // Button Handlers
      document.querySelectorAll('#e0 [data-gate]').forEach(btn => {
        btn.onclick = () => {
          if (anim) return;
          const gate = btn.dataset.gate;
          let axis = [1, 0, 0]; // X gate
          if (gate === 'H') axis = [hs, 0, hs];
          if (gate === 'Z') axis = [0, 0, 1];
          anim = { k: axis, v0: vec.slice(), t0: performance.now(), gate };
        };
      });

      const btnMeas = document.getElementById('btn-meas1');
      if (btnMeas) {
        btnMeas.onclick = () => {
          if (anim) return;
          const res = Math.random() < (state[0] * state[0]) ? 0 : 1;
          anim = { m: res, v0: vec.slice(), t0: performance.now() };
        };
      }

      const btnReset = document.getElementById('btn-reset1');
      if (btnReset) {
        btnReset.onclick = () => {
          state = [1, 0];
          vec = [0, 0, 1];
          anim = null;
          updateReadout();
          draw();
        };
      }

      updateReadout();
      function loop(now) {
        step(now);
        draw();
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    },

    // ==========================================
    // EXPERIMENT 2: Superposition & Measurement
    // ==========================================
    initExp2() {
      const container = document.getElementById('bars-exp2');
      if (!container) return;
      const updateBars = this.createBars(container, ['0', '1']);
      const stateSelect = document.getElementById('select-state2');
      const shotsSelect = document.getElementById('select-shots2');
      const beadStrip = document.getElementById('strip-exp2');
      const runBtn = document.getElementById('btn-run2');

      const getP1 = () => parseFloat(stateSelect.value);
      const refreshTheory = () => {
        const p1 = getP1();
        updateBars([1 - p1, p1], [0, 0], 0);
        if (beadStrip) beadStrip.innerHTML = '';
      };

      stateSelect.onchange = refreshTheory;
      refreshTheory();

      runBtn.onclick = () => {
        if (beadStrip) beadStrip.innerHTML = '';
        const p1 = getP1();
        const shots = parseInt(shotsSelect.value, 10);
        this.runShots('exp2', shots, [1 - p1, p1], (c, t) => {
          updateBars([1 - p1, p1], c, t);
        }, (res) => {
          if (!beadStrip) return;
          const bead = document.createElement('div');
          bead.className = `bead b${res}`;
          beadStrip.appendChild(bead);
          if (beadStrip.children.length > 50) beadStrip.firstChild.remove();
        });
      };
    },

    // ==========================================
    // EXPERIMENT 3: Bell State Lab
    // ==========================================
    initExp3() {
      const container = document.getElementById('bars-exp3');
      if (!container) return;
      const updateBars = this.createBars(container, ['00', '01', '10', '11']);
      let state = [1, 0, 0, 0]; // |00>, |01>, |10>, |11>
      let history = [];

      const getProbs = () => state.map(x => x * x);

      const applyGate = (gate) => {
        if (history.length >= 8) return;
        history.push(gate);

        if (gate === 'CX') {
          [state[2], state[3]] = [state[3], state[2]];
        } else {
          const isQ1 = gate[1] === '1';
          const mask = isQ1 ? 1 : 2;
          for (let i = 0; i < 4; i++) {
            if (!(i & mask)) {
              const j = i | mask;
              const a = state[i], b = state[j];
              if (gate[0] === 'H') {
                state[i] = (a + b) * hs;
                state[j] = (a - b) * hs;
              } else { // X gate
                state[i] = b;
                state[j] = a;
              }
            }
          }
        }
        render();
      };

      const render = () => {
        clearInterval(ExpEngine.timers.exp3);
        const labels = ['00', '01', '10', '11'];
        const terms = state.map((a, i) => Math.abs(a) > 1e-6 ? `${fmt(a)}|${labels[i]}⟩` : '')
          .filter(Boolean).join(' + ').replace(/\+ -/g, '− ');

        const isBell = Math.abs(state[0] - hs) < 1e-5 && Math.abs(state[3] - hs) < 1e-5;
        const out = document.getElementById('out-exp3');
        if (out) {
          out.innerHTML = `
            <div>Quantum State: <span class="ket">${terms || '|00⟩'}</span></div>
            ${isBell ? '<div style="margin-top:0.4rem"><span class="brand-badge" style="background:var(--accent-cyan);color:#fff">Bell State |Φ⁺⟩ Generated</span></div>' : ''}
          `;
        }
        updateBars(getProbs(), [0, 0, 0, 0], 0);

        // Render Circuit SVG
        const svg = document.getElementById('svg-circuit3');
        if (svg) {
          const ink = getCss('--text-primary');
          const cyan = getCss('--accent-cyan');
          const amber = getCss('--accent-amber');
          let markup = `
            <g stroke="${ink}" stroke-width="2" opacity="0.4">
              <line x1="60" y1="35" x2="600" y2="35"/>
              <line x1="60" y1="95" x2="600" y2="95"/>
            </g>
            <g fill="${ink}" font-family="JetBrains Mono, monospace" font-size="14" font-weight="600">
              <text x="12" y="40">q0: |0⟩</text>
              <text x="12" y="100">q1: |0⟩</text>
            </g>
          `;

          history.forEach((g, idx) => {
            const x = 95 + idx * 62;
            if (g === 'CX') {
              markup += `
                <g stroke="${amber}" stroke-width="2.5">
                  <line x1="${x}" y1="35" x2="${x}" y2="95"/>
                  <circle cx="${x}" cy="35" r="6" fill="${amber}"/>
                  <circle cx="${x}" cy="95" r="13" fill="none"/>
                  <line x1="${x - 13}" y1="95" x2="${x + 13}" y2="95"/>
                  <line x1="${x}" y1="82" x2="${x}" y2="108"/>
                </g>
              `;
            } else {
              const y = g[1] === '1' ? 68 : 8;
              const fill = g[0] === 'H' ? cyan : amber;
              markup += `
                <rect x="${x - 18}" y="${y}" width="36" height="54" rx="6" fill="${fill}"/>
                <text x="${x}" y="${y + 34}" text-anchor="middle" fill="#fff" font-family="JetBrains Mono, monospace" font-size="20" font-weight="700">${g[0]}</text>
              `;
            }
          });
          svg.innerHTML = markup;
        }
      };

      document.querySelectorAll('#e2 [data-gate]').forEach(btn => {
        btn.onclick = () => applyGate(btn.dataset.gate);
      });

      const resetBtn = document.getElementById('btn-reset3');
      if (resetBtn) {
        resetBtn.onclick = () => {
          state = [1, 0, 0, 0];
          history = [];
          const c0 = document.getElementById('coin-q0');
          const c1 = document.getElementById('coin-q1');
          if (c0) { c0.textContent = '?'; c0.className = 'quantum-coin'; }
          if (c1) { c1.textContent = '?'; c1.className = 'quantum-coin'; }
          render();
        };
      }

      const runShotsBtn = document.getElementById('btn-run3');
      if (runShotsBtn) {
        runShotsBtn.onclick = () => {
          this.runShots('exp3', 1000, getProbs(), (c, t) => updateBars(getProbs(), c, t));
        };
      }

      const measOnceBtn = document.getElementById('btn-meas3');
      if (measOnceBtn) {
        measOnceBtn.onclick = () => {
          const probs = getProbs();
          let r = Math.random(), outcome = 0;
          while (outcome < 3 && r > probs[outcome]) {
            r -= probs[outcome];
            outcome++;
          }
          const bit0 = (outcome >> 1);
          const bit1 = (outcome & 1);
          const c0 = document.getElementById('coin-q0');
          const c1 = document.getElementById('coin-q1');

          if (c0 && c1) {
            c0.classList.add('flip');
            c1.classList.add('flip');
            setTimeout(() => {
              c0.textContent = bit0;
              c0.classList.toggle('b1', !!bit0);
              c0.classList.remove('flip');

              c1.textContent = bit1;
              c1.classList.toggle('b1', !!bit1);
              c1.classList.remove('flip');
            }, 300);
          }
        };
      }

      render();
    },

    // ==========================================
    // EXPERIMENT 4: CNOT Truth Table
    // ==========================================
    initExp4() {
      const tableBody = document.getElementById('tbody-cnot');
      if (!tableBody) return;
      const tt = [['00', '00'], ['01', '01'], ['10', '11'], ['11', '10']];

      tableBody.innerHTML = tt.map((r, i) => `
        <tr data-index="${i}">
          <td style="font-family:JetBrains Mono, monospace;font-weight:600">|${r[0]}⟩</td>
          <td style="font-family:JetBrains Mono, monospace;font-weight:600">|${r[1]}⟩</td>
          <td><button class="gate-btn primary" data-row="${i}" style="padding:0.35rem 0.75rem;font-size:0.8rem">Evaluate</button></td>
        </tr>
      `).join('');

      const cCoin = document.getElementById('coin-cnot-c');
      const tCoin = document.getElementById('coin-cnot-t');
      const statusText = document.getElementById('cnot-status-text');

      const setCoin = (el, val) => {
        if (!el) return;
        el.textContent = val;
        el.classList.toggle('b1', val === '1');
      };

      tableBody.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.row, 10);
          const [inp, out] = tt[idx];

          tableBody.querySelectorAll('tr').forEach((tr, j) => {
            tr.style.background = (j === idx) ? 'var(--bg-secondary)' : 'transparent';
          });

          setCoin(cCoin, inp[0]);
          setCoin(tCoin, inp[1]);
          if (statusText) statusText.textContent = `Input basis state: |${inp}⟩`;

          setTimeout(() => {
            if (inp[0] === '1') {
              if (tCoin) tCoin.classList.add('flip');
              setTimeout(() => {
                setCoin(tCoin, out[1]);
                if (tCoin) tCoin.classList.remove('flip');
                if (statusText) statusText.textContent = `Control qubit is 1 → Target flips: Output |${out}⟩`;
              }, 300);
            } else {
              if (statusText) statusText.textContent = `Control qubit is 0 → Target unchanged: Output |${out}⟩`;
            }
          }, 500);
        };
      });
    },

    // ==========================================
    // EXPERIMENT 5: Interference with Phase Slider
    // ==========================================
    initExp5() {
      const container = document.getElementById('bars-exp5');
      const canvas = document.getElementById('canvas-interference');
      const slider = document.getElementById('slider-phase5');
      const out = document.getElementById('out-exp5');
      const runBtn = document.getElementById('btn-run5');
      if (!container || !canvas || !slider) return;

      const updateBars = this.createBars(container, ['0', '1']);
      const ctx = canvas.getContext('2d');

      const getP1 = () => Math.pow(Math.sin(parseFloat(slider.value) * Math.PI / 360), 2);

      const render = () => {
        const phi = parseFloat(slider.value);
        const p1 = getP1();
        const p0 = 1 - p1;

        updateBars([p0, p1], [0, 0], 0);
        if (out) {
          out.innerHTML = `
            <div>Phase Angle ϕ = <span class="ket">${phi}°</span></div>
            <div class="prob-line">P(|0⟩) = cos²(ϕ/2) = <b>${(p0 * 100).toFixed(1)}%</b> &nbsp;|&nbsp; P(|1⟩) = sin²(ϕ/2) = <b>${(p1 * 100).toFixed(1)}%</b></div>
          `;
        }

        // Draw Sine Interference Pattern
        const dpr = window.devicePixelRatio || 1;
        const W = 360, H = 140;
        if (canvas.width !== W * dpr) {
          canvas.width = W * dpr;
          canvas.height = H * dpr;
          canvas.style.width = W + 'px';
          canvas.style.height = H + 'px';
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const mute = getCss('--text-muted');
        const cyan = getCss('--accent-cyan');
        const rose = getCss('--accent-rose');

        // Axis
        ctx.strokeStyle = mute;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(15, H - 20);
        ctx.lineTo(W - 15, H - 20);
        ctx.stroke();

        // Sinusoidal Curve
        ctx.globalAlpha = 1;
        ctx.strokeStyle = cyan;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x <= 360; x += 4) {
          const px = 15 + (x / 360) * (W - 30);
          const py = (H - 20) - Math.pow(Math.sin(x * Math.PI / 360), 2) * (H - 45);
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Interactive Moving Marker Dot
        const mx = 15 + (phi / 360) * (W - 30);
        const my = (H - 20) - p1 * (H - 45);
        ctx.shadowColor = rose;
        ctx.shadowBlur = 10;
        ctx.fillStyle = rose;
        ctx.beginPath();
        ctx.arc(mx, my, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Labels
        ctx.fillStyle = mute;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('0°', 15, H - 5);
        ctx.fillText('180°', W / 2 - 10, H - 5);
        ctx.fillText('360°', W - 35, H - 5);

        ctx.restore();
      };

      slider.oninput = () => {
        clearInterval(ExpEngine.timers.exp5);
        render();
      };

      if (runBtn) {
        runBtn.onclick = () => {
          const p1 = getP1();
          this.runShots('exp5', 1000, [1 - p1, p1], (c, t) => updateBars([1 - p1, p1], c, t));
        };
      }

      render();
    },

    // ==========================================
    // EXPERIMENT 6: Quantum Teleportation
    // ==========================================
    initExp6() {
      const slider = document.getElementById('slider-angle6');
      const stageList = document.getElementById('list-stages6');
      const out = document.getElementById('out-exp6');
      const nextBtn = document.getElementById('btn-next6');
      const resetBtn = document.getElementById('btn-reset6');
      if (!stageList || !slider) return;

      const stages = [
        'Prepare unknown state |ψ⟩ on Alice\'s qubit q0',
        'Distribute entangled Bell pair |Φ⁺⟩ on q1 (Alice) & q2 (Bob)',
        'Alice performs Bell basis measurement: CNOT (q0→q1) and H (q0)',
        'Alice measures q0 and q1, broadcasting 2 classical bits to Bob',
        'Bob applies conditional unitary corrections: X^(m1) Z^(m0) on q2'
      ];

      let stepIdx = 0;
      let state = null;
      let meas = [];
      let initialAmp = [1, 0];

      const render = () => {
        stageList.innerHTML = stages.map((desc, i) => `
          <li class="procedure-item ${i < stepIdx ? 'done' : ''} ${i === stepIdx - 1 ? 'current' : ''}">
            <div class="step-checkbox">${i < stepIdx ? '✓' : ''}</div>
            <div class="step-text" style="${i === stepIdx - 1 ? 'font-weight:600;color:var(--accent-cyan)' : ''}">${desc}</div>
          </li>
        `).join('');

        if (nextBtn) {
          nextBtn.textContent = stepIdx >= 5 ? 'Replay Teleportation' : 'Advance Next Step';
        }
      };

      const advance = () => {
        if (stepIdx >= 5) stepIdx = 0;
        const theta = parseFloat(slider.value) * Math.PI / 180;
        const a0 = Math.cos(theta / 2);
        const b0 = Math.sin(theta / 2);

        if (stepIdx === 0) {
          state = new Array(8).fill(0);
          state[0] = a0;
          state[4] = b0; // |ψ⟩ on q0, |00⟩ on q1, q2
          meas = [];
          initialAmp = [a0, b0];
          if (out) out.innerHTML = `<div>Prepared State to Teleport: <span class="ket">|ψ⟩</span> = <span class="amp">${fmt(a0)}</span><span class="ket">|0⟩</span> + <span class="amp">${fmt(b0)}</span><span class="ket">|1⟩</span></div>`;
        } else if (stepIdx === 1) {
          Quantum.h(state, 3, 1);
          Quantum.cx(state, 3, 1, 2);
          if (out) out.innerHTML = `<div>Entangled pair distributed: qubits q1 & q2 are now in shared Bell state <span class="ket">|Φ⁺⟩</span>.</div>`;
        } else if (stepIdx === 2) {
          Quantum.cx(state, 3, 0, 1);
          Quantum.h(state, 3, 0);
          if (out) out.innerHTML = `<div>Alice has coupled her unknown qubit to her half of the Bell pair.</div>`;
        } else if (stepIdx === 3) {
          meas = [Quantum.meas(state, 3, 0), Quantum.meas(state, 3, 1)];
          if (out) out.innerHTML = `<div>Alice measured q0 = <b>${meas[0]}</b> and q1 = <b>${meas[1]}</b>. Alice transmits these 2 classical bits to Bob.</div>`;
        } else if (stepIdx === 4) {
          if (meas[1]) Quantum.x(state, 3, 2);
          if (meas[0]) Quantum.z(state, 3, 2);

          const offset = (meas[0] << 2) | (meas[1] << 1);
          const finalA = state[offset];
          const finalB = state[offset + 1];
          const fidelity = Math.pow(finalA * initialAmp[0] + finalB * initialAmp[1], 2);

          if (out) {
            out.innerHTML = `
              <div>Bob applied Pauli correction: <b>${meas[1] ? 'X' : 'I'}</b> and <b>${meas[0] ? 'Z' : 'I'}</b>.</div>
              <div style="margin-top:0.35rem">Reconstructed State on q2: <span class="ket">|ψ_Bob⟩</span> = <span class="amp">${fmt(Math.abs(finalA))}</span><span class="ket">|0⟩</span> + <span class="amp">${fmt(Math.abs(finalB))}</span><span class="ket">|1⟩</span></div>
              <div style="margin-top:0.35rem"><span class="brand-badge" style="background:var(--accent-emerald);color:#fff">Quantum State Fidelity: ${(fidelity * 100).toFixed(1)}% (Exact Match)</span></div>
            `;
          }
        }

        stepIdx++;
        render();
      };

      if (nextBtn) nextBtn.onclick = advance;
      if (resetBtn) {
        resetBtn.onclick = () => {
          stepIdx = 0;
          if (out) out.textContent = 'Select target state angle and press Advance Next Step.';
          render();
        };
      }
      slider.oninput = () => {
        stepIdx = 0;
        render();
      };
      render();
    },

    // ==========================================
    // EXPERIMENT 7: CHSH Bell Test
    // ==========================================
    initExp7() {
      const slider = document.getElementById('slider-bob-angle7');
      const barFill = document.getElementById('chsh-fill-bar');
      const statusLabel = document.getElementById('chsh-status-label');
      const out = document.getElementById('out-exp7');
      const runBtn = document.getElementById('btn-run7');
      if (!slider || !barFill) return;

      const calcTheoryS = () => {
        const rad = parseFloat(slider.value) * Math.PI / 180;
        return 2 * Math.cos(rad) + 2 * Math.sin(rad);
      };

      const render = () => {
        const angle = slider.value;
        const S = calcTheoryS();
        if (statusLabel) {
          statusLabel.innerHTML = `Bob's Angle θ_B = <b>${angle}°</b> &nbsp;|&nbsp; Theoretical CHSH Score S = <b style="color:var(--accent-cyan)">${S.toFixed(3)}</b>`;
        }
      };

      slider.oninput = render;
      render();

      if (runBtn) {
        runBtn.onclick = () => {
          const d = parseFloat(slider.value) * Math.PI / 180;
          const A = [0, Math.PI / 2];
          const B = [d, -d];
          const n = 1000;

          // Quantum correlation expectation Monte Carlo
          const E = (a, b) => {
            const pSame = (1 + Math.cos(a - b)) / 2;
            let sum = 0;
            for (let i = 0; i < n; i++) {
              sum += Math.random() < pSame ? 1 : -1;
            }
            return sum / n;
          };

          const e00 = E(A[0], B[0]);
          const e01 = E(A[0], B[1]);
          const e10 = E(A[1], B[0]);
          const e11 = E(A[1], B[1]);
          const S_meas = e00 + e01 + e10 - e11;

          barFill.style.width = Math.min(100, Math.max(0, (S_meas / 3.0) * 100)) + '%';

          if (out) {
            const isQuantum = S_meas > 2.0;
            out.innerHTML = `
              <div>Correlations: E(a,b)=${e00.toFixed(2)}, E(a,b')=${e01.toFixed(2)}, E(a',b)=${e10.toFixed(2)}, E(a',b')=${e11.toFixed(2)}</div>
              <div style="margin-top:0.4rem;font-size:1.05rem">Measured CHSH Parameter: S = <b style="color:${isQuantum ? 'var(--accent-cyan)' : 'var(--accent-amber)'}">${S_meas.toFixed(3)}</b></div>
              <div style="margin-top:0.35rem">
                ${isQuantum
                  ? '<span class="brand-badge" style="background:var(--accent-cyan);color:#fff">Violates Classical Limit S ≤ 2.0 (Quantum Non-locality Verified)</span>'
                  : '<span class="brand-badge" style="background:var(--bg-tertiary);color:var(--text-muted)">Within Classical Bound S ≤ 2.0</span>'}
              </div>
            `;
          }
        };
      }
    },

    // ==========================================
    // EXPERIMENT 8: Noise and Decoherence
    // ==========================================
    initExp8() {
      const container = document.getElementById('bars-exp8');
      const slider = document.getElementById('slider-noise8');
      const out = document.getElementById('out-exp8');
      const runBtn = document.getElementById('btn-run8');
      if (!container || !slider) return;

      const updateBars = this.createBars(container, ['00', '01', '10', '11']);

      const render = () => {
        updateBars([0.5, 0, 0, 0.5], [0, 0, 0, 0], 0);
        if (out) {
          out.innerHTML = `<div>Per-qubit depolarizing error rate: <b>${slider.value}%</b></div>`;
        }
      };

      slider.oninput = () => {
        clearInterval(ExpEngine.timers.exp8);
        render();
      };
      render();

      if (runBtn) {
        runBtn.onclick = () => {
          const p = parseFloat(slider.value) / 100;
          // Probability model under independent bit-flip channel
          const pGood = 0.5 * ((1 - p) * (1 - p) + p * p);
          const pErr = p * (1 - p);
          const probs = [pGood, pErr, pErr, pGood];

          this.runShots('exp8', 1000, probs, (c, t) => {
            updateBars([0.5, 0, 0, 0.5], c, t);
            if (out) {
              const fidelity = ((c[0] + c[3]) / t * 100).toFixed(1);
              out.innerHTML = `
                <div>Simulated 1000 shots under noise rate: <b>${slider.value}%</b></div>
                <div style="margin-top:0.35rem">Valid Bell Pairs (|00⟩ & |11⟩): <b style="color:var(--accent-emerald)">${fidelity}%</b> &nbsp;|&nbsp; Erroneous (|01⟩ & |10⟩): <b style="color:var(--accent-rose)">${(100 - fidelity).toFixed(1)}%</b></div>
              `;
            }
          });
        };
      }
    },

    // ==========================================
    // EXPERIMENT 9: Grover Search on Two Qubits
    // ==========================================
    initExp9() {
      const canvas = document.getElementById('canvas-grover');
      const selectMarked = document.getElementById('select-grover-item');
      const nextBtn = document.getElementById('btn-next9');
      const resetBtn = document.getElementById('btn-reset9');
      const out = document.getElementById('out-exp9');
      if (!canvas || !selectMarked) return;

      const ctx = canvas.getContext('2d');
      const labels = ['00', '01', '10', '11'];
      const stageDescs = [
        'Initial state: |00⟩',
        'Step 1: Equal superposition via Hadamard transform H^⊗2',
        'Step 2: Quantum Oracle flips phase of marked item |ω⟩',
        'Step 3: Grover Diffusion Operator reflects amplitudes about average',
        'Step 4: Computational basis measurement'
      ];

      let stateMachine = {
        step: 0,
        current: [1, 0, 0, 0],
        target: [1, 0, 0, 0],
        amplitudes: [1, 0, 0, 0],
        measuredIndex: null
      };

      const reset = () => {
        stateMachine = {
          step: 0,
          current: stateMachine.current,
          target: [1, 0, 0, 0],
          amplitudes: [1, 0, 0, 0],
          measuredIndex: null
        };
        if (out) out.textContent = stageDescs[0];
        if (nextBtn) nextBtn.textContent = 'Next Algorithm Step';
      };

      const advance = () => {
        if (stateMachine.step === 4) {
          reset();
          return;
        }
        const marked = parseInt(selectMarked.value, 10);
        const amps = stateMachine.amplitudes;
        stateMachine.step++;

        if (stateMachine.step === 1) {
          Quantum.h(amps, 2, 0);
          Quantum.h(amps, 2, 1);
        } else if (stateMachine.step === 2) {
          amps[marked] = -amps[marked];
        } else if (stateMachine.step === 3) {
          const mean = amps.reduce((a, b) => a + b, 0) / 4;
          for (let i = 0; i < 4; i++) {
            amps[i] = 2 * mean - amps[i];
          }
        } else if (stateMachine.step === 4) {
          const r = Math.random();
          let acc = 0, found = 0;
          for (let i = 0; i < 4; i++) {
            acc += amps[i] * amps[i];
            if (r <= acc) { found = i; break; }
          }
          for (let j = 0; j < 4; j++) amps[j] = (j === found) ? 1 : 0;
          stateMachine.measuredIndex = found;
        }

        stateMachine.target = amps.slice();
        if (out) {
          out.innerHTML = `
            <div>${stageDescs[stateMachine.step]}</div>
            ${stateMachine.step === 4 ? `<div style="margin-top:0.35rem"><span class="brand-badge" style="background:var(--accent-emerald);color:#fff">Target |${labels[marked]}⟩ identified with 100% certainty in 1 query!</span></div>` : ''}
          `;
        }
        if (nextBtn) {
          nextBtn.textContent = stateMachine.step === 4 ? 'Restart Grover Search' : 'Next Algorithm Step';
        }
      };

      if (nextBtn) nextBtn.onclick = advance;
      if (resetBtn) resetBtn.onclick = reset;
      selectMarked.onchange = reset;
      reset();

      const draw = () => {
        const dpr = window.devicePixelRatio || 1;
        const W = 420, H = 250;
        if (canvas.width !== W * dpr) {
          canvas.width = W * dpr;
          canvas.height = H * dpr;
          canvas.style.width = W + 'px';
          canvas.style.height = H + 'px';
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const marked = parseInt(selectMarked.value, 10);
        const ink = getCss('--text-primary');
        const mute = getCss('--text-muted');
        const cyan = getCss('--accent-cyan');
        const amber = getCss('--accent-amber');
        const rose = getCss('--accent-rose');

        // Smooth interpolation
        stateMachine.current = stateMachine.current.map((v, i) => v + (stateMachine.target[i] - v) * 0.18);

        // Zero Axis
        const midY = 130;
        ctx.strokeStyle = mute;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, midY);
        ctx.lineTo(W - 20, midY);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Average Line
        const mean = stateMachine.current.reduce((a, b) => a + b, 0) / 4;
        const meanY = midY - mean * 100;
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = amber;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, meanY);
        ctx.lineTo(W - 20, meanY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = amber;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`mean = ${mean.toFixed(2)}`, 24, meanY - 6);

        // Amplitude Bars
        stateMachine.current.forEach((val, i) => {
          const barX = 45 + i * 88;
          const barH = val * 100;
          const isTarget = i === marked;

          ctx.fillStyle = val >= 0 ? cyan : rose;
          ctx.beginPath();
          ctx.roundRect(barX, val >= 0 ? midY - barH : midY, 52, Math.abs(barH), 4);
          ctx.fill();

          // Labels
          ctx.fillStyle = ink;
          ctx.textAlign = 'center';
          ctx.font = '600 13px "JetBrains Mono", monospace';
          ctx.fillText(`|${labels[i]}⟩${isTarget ? ' ★' : ''}`, barX + 26, H - 15);

          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = mute;
          const textY = val >= 0 ? midY - barH - 6 : midY + Math.abs(barH) + 14;
          ctx.fillText(val.toFixed(2), barX + 26, textY);
        });

        ctx.restore();
      };

      function loop() {
        draw();
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    },

    // ==========================================
    // EXPERIMENT 10: Entangled vs Independent Qubits
    // ==========================================
    initExp10() {
      const container = document.getElementById('bars-exp10');
      const pairSelect = document.getElementById('select-pair-mode10');
      const countSelect = document.getElementById('select-pairs-count10');
      const runBtn = document.getElementById('btn-run10');
      const beadStrip = document.getElementById('strip-exp10');
      const out = document.getElementById('out-exp10');
      const coin0 = document.getElementById('coin-exp10-a');
      const coin1 = document.getElementById('coin-exp10-b');
      if (!container || !pairSelect) return;

      const updateBars = this.createBars(container, ['Matching (00 or 11)', 'Differing (01 or 10)']);

      const isEntangled = () => pairSelect.value === 'e';
      const getProbs = () => isEntangled() ? [0.5, 0, 0, 0.5] : [0.25, 0.25, 0.25, 0.25];

      const render = () => {
        clearInterval(ExpEngine.timers.exp10);
        const expMatch = isEntangled() ? 1.0 : 0.5;
        updateBars([expMatch, 1 - expMatch], [0, 0], 0);
        if (beadStrip) beadStrip.innerHTML = '';
        if (out) {
          out.innerHTML = `<div>Mode: <b>${isEntangled() ? 'Bell Entangled Pair (|Φ⁺⟩)' : 'Independent Qubits (H⊗H)'}</b> — Expected Correlation: <b>${(expMatch * 100).toFixed(0)}%</b></div>`;
        }
      };

      pairSelect.onchange = render;
      render();

      if (runBtn) {
        runBtn.onclick = () => {
          if (beadStrip) beadStrip.innerHTML = '';
          const probs = getProbs();
          const n = parseInt(countSelect.value, 10);
          const expMatch = isEntangled() ? 1.0 : 0.5;

          this.runShots('exp10', n, probs, (c, t) => {
            const matches = c[0] + c[3];
            const diffs = c[1] + c[2];
            updateBars([expMatch, 1 - expMatch], [matches, diffs], t);
            if (out) {
              const rate = (matches / t * 100).toFixed(1);
              out.innerHTML = `
                <div>Sampled ${t} pairs: Measured Match Rate = <b style="color:var(--accent-cyan)">${rate}%</b></div>
                <div style="margin-top:0.35rem">
                  ${isEntangled()
                    ? '<span class="brand-badge" style="background:var(--accent-cyan);color:#fff">100% Correlated Measurements (Quantum Entanglement)</span>'
                    : '<span class="brand-badge" style="background:var(--bg-tertiary);color:var(--text-muted)">~50% Random Statistical Coincidence (Independent Qubits)</span>'}
                </div>
              `;
            }
          }, (idx) => {
            const bitA = idx >> 1;
            const bitB = idx & 1;

            if (coin0 && coin1) {
              coin0.textContent = bitA;
              coin0.classList.toggle('b1', !!bitA);
              coin1.textContent = bitB;
              coin1.classList.toggle('b1', !!bitB);
            }

            if (beadStrip) {
              const pairEl = document.createElement('div');
              pairEl.style.display = 'inline-flex';
              pairEl.style.gap = '2px';
              pairEl.innerHTML = `<span class="bead b${bitA}"></span><span class="bead b${bitB}"></span>`;
              beadStrip.appendChild(pairEl);
              if (beadStrip.children.length > 40) beadStrip.firstChild.remove();
            }
          });
        };
      }
    },

    initAll() {
      this.initExp1();
      this.initExp2();
      this.initExp3();
      this.initExp4();
      this.initExp5();
      this.initExp6();
      this.initExp7();
      this.initExp8();
      this.initExp9();
      this.initExp10();
    }
  };

  window.ExpEngine = ExpEngine;
})(window);
