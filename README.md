# Quantum Computing Virtual Laboratory

**Academic & Technical Partners:** Ada Lovelace Software Pvt. Ltd. & STPI Bengaluru  
**Scientific Director:** Dr. Rakesh L, Chief AI & Quantum Scientist  

A production-grade, responsive, scientific quantum computing laboratory platform featuring interactive quantum state simulations, real-time circuit composition, Monte Carlo shot statistics, bilingual voice narration (English & Kannada), and automated academic laboratory reports.

---

## 🔬 Curriculum: 10 Interactive Guided Experiments

| # | Experiment Title | Quantum Concept & Gates | Interactive Visualization |
|---|---|---|---|
| **01** | **Qubit and the Bloch Sphere** | Single-qubit statevector, $H$, $X$, $Z$, measurement projection | 3D interactive rotatable Bloch sphere with Rodrigues geodesic animation |
| **02** | **Superposition & Measurement Statistics** | Statistical convergence, Born probability rule, $H^2 = I$ destructive interference | Real-time Monte Carlo detector with comparative theory/empirical histograms and photon bead register |
| **03** | **Bell State Laboratory** | Quantum entanglement, EPR pair $\|\Phi^+\rangle = \frac{\|00\rangle + \|11\rangle}{\sqrt{2}}$, $CNOT$ | Interactive circuit composer with IBM Quantum style wire diagram and 3D coin flips |
| **04** | **CNOT Truth Table** | Reversible quantum logic, conditional parity inversion | Basis evaluation matrix with animated control-target register |
| **05** | **Interference with Phase Tuning** | Mach-Zehnder analogue ($H \to R_z(\phi) \to H$), $P(1) = \sin^2(\phi/2)$ | Real-time sinusoidal interference fringe wave with dynamic state tracker |
| **06** | **Quantum Teleportation Protocol** | No-cloning compliant state transfer, EPR channel, classical corrections ($X^{m_1} Z^{m_0}$) | 5-stage interactive state-machine with 100% fidelity calculation |
| **07** | **CHSH Bell Inequality Test** | Quantum non-locality, Tsirelson bound ($2\sqrt{2} \approx 2.828$) vs classical bound ($S \le 2.0$) | Precision Bell correlation gauge with live angle slider |
| **08** | **Noise and Decoherence Simulation** | Open quantum systems, depolarizing bit-flip error channel, thermal relaxation | Tunable error parameter ($0\% - 40\%$) showing degradation of Bell fidelity |
| **09** | **Grover Search on Two Qubits** | Unstructured database search, phase oracle, inversion-about-the-mean diffusion | Real-time signed amplitude spectrum chart with animated reflection about average |
| **10** | **Entangled vs Independent Qubits** | Joint non-separable states vs product states | Dual detector coins with correlation comparison ($100\%$ vs $50\%$ random coincidence) |

---

## 🎨 UI/UX Design System
- **Theme:** High-end scientific dashboard aesthetic (Deep Navy, Electric Cyan `#38bdf8`, Neon Violet `#a78bfa`, Amber `#fbbf24`).
- **Modes:** Persistent Dark & Light theme with automatic system detection.
- **Typography:** Inter, Outfit, and JetBrains Mono for mathematical notation and kets ($|0\rangle, |1\rangle$).
- **Audio & Accessibility:**
  - High-fidelity studio voice-over audio for all 10 experiments + skippable orbital atom intro.
  - Sentence-synchronized live caption highlighting.
  - Native Kannada (`ಕನ್ನಡ`) translations and Web Speech API integration.
- **Reporting:** Direct in-browser generation of printable academic lab reports (with student name, roll number, results table, and viva answers) via standard Web Blobs.

---

## 📁 Project Structure

```
quantum-lab/
├── index.html                   # Main semantic laboratory web page
├── css/
│   └── main.css                 # Complete design system & responsive styling
├── js/
│   ├── experiments.js           # Quantum mathematics & canvas simulation engines
│   └── app.js                   # UI state, audio controller, multilingual & report export
├── audio/                       # 11 studio voice-over MP3 audio assets
│   ├── intro.mp3
│   ├── exp1.mp3 ... exp10.mp3
├── dist/                        # Production distributions
│   ├── index.html               # Optimized modular build
│   └── Quantum_Computing_Lab_Standalone_Pro.html # Single-file all-in-one with embedded base64 audio
├── build_standalone.py          # Distribution builder script
└── README.md                    # Project documentation
```

---

## 🚀 Running Locally & Future Deployment

### Running Locally
You can run the web server using Python:
```bash
python -m http.server 4173
```
Then navigate to `http://localhost:4173` in your browser.

Alternatively, double-click:
`C:\Users\Santhosh MR\Downloads\Quantum Computing Lab -Pro.html` or `dist/Quantum_Computing_Lab_Standalone_Pro.html` to run completely offline!

### Claiming & Redeploying on Netlify
The project has been prepared and deployed via Netlify CLI:
- **Site ID:** `18e33c51-d6af-4067-947d-c0924557bdb7`
- **Claim URL:** Open the generated claim URL in your browser to permanently link the site to your Netlify account:
  ```
  https://app.netlify.com/drop/idyllic-chebakia-aea4e7#drop_token=...
  ```
- To redeploy updates at any time:
  ```bash
  netlify deploy --prod --dir . --no-build
  ```
