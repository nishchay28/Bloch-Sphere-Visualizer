# Bloch Sphere Visualizer

An interactive 3D visualization tool for representing and manipulating a single-qubit quantum state on the Bloch sphere.

This project enables real-time exploration of quantum states through **gates, Cartesian coordinates, and spherical (θ, φ) controls**, with full synchronization between representations.

---

## 🚀 Features

- 🔷 Interactive 3D Bloch Sphere (React + Three.js)
- 🔷 Quantum gate operations: **X, Y, Z, H**
- 🔷 **Spherical control (θ, φ sliders)** for intuitive state manipulation
- 🔷 **Manual Cartesian input (X, Y, Z)** with normalization
- 🔷 **Bidirectional state synchronization**
  - Angles ↔ Coordinates ↔ Quantum State
- 🔷 Real-time quantum state display (α, β)
- 🔷 Probability visualization for |0⟩ and |1⟩
- 🔷 Gate history tracking
- 🔷 Axis visualization with labeled X, Y, Z directions

---

## 🧠 Quantum Model

A single qubit is represented as:

|ψ⟩ = α|0⟩ + β|1⟩

where α and β are complex amplitudes such that:

|α|² + |β|² = 1

---

## 🌐 Bloch Sphere Representation

The state maps to a point on the Bloch sphere:

- X = 2 Re(αβ*)
- Y = 2 Im(αβ*)
- Z = |α|² − |β|²

---

## 🔄 Spherical Coordinates

The same state can be expressed using angles:

- θ (polar angle)
- φ (azimuthal angle)

Conversion:

- α = cos(θ/2)
- β = e^{iφ} sin(θ/2)

---

## ⚙️ Interactions

| Input Method | Effect |
|--------------|--------|
| Gate Buttons | Apply quantum operations (rotations on sphere) |
| θ / φ Sliders | Direct spherical manipulation |
| X, Y, Z Input | Cartesian control with normalization |

All inputs are fully synchronized in real time.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **3D Rendering:** Three.js + React Three Fiber
- **UI Helpers:** @react-three/drei
- **Math Logic:** Custom complex number implementation

---

## 📌 Notes

- The visualization represents **state direction**, not global phase
- Some quantum differences (e.g., X vs Y phase) are not visually distinguishable without phase encoding
- All states are normalized to remain valid quantum states

---

## 🎯 Future Improvements

- Smooth gate animations (true rotational interpolation)
- Phase visualization (color / rotation indicators)
- Preset quantum states (|+⟩, |−⟩, |i⟩, etc.)
- Multi-qubit extensions (advanced)

---

## 📷 Preview

![Bloch Sphere Preview](PreView.png)

---

## 🧩 Use Case

- Learning quantum computing concepts
- Visualizing qubit transformations
- Understanding Bloch sphere geometry
- Hackathon/demo projects

---

## 📄 License

Open-source and free to use.