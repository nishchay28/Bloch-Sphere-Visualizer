# Bloch Sphere Visualizer

An interactive 3D visualization tool for representing a single-qubit quantum state on the Bloch sphere.  
This project allows users to explore quantum gates, state transformations, and coordinate-based control in real time.

---

## 🚀 Features

- 🔷 Interactive 3D Bloch Sphere (React + Three.js)
- 🔷 Apply quantum gates: X, Y, Z, H
- 🔷 Manual vector control (X, Y, Z inputs)
- 🔷 Real-time state vector display
- 🔷 Probability visualization for |0⟩ and |1⟩
- 🔷 Gate history tracking
- 🔷 Coordinate normalization (valid quantum state enforcement)

---

## 🧠 Concept

A single qubit can be represented as: |ψ⟩ = α|0⟩ + β|1⟩


This state maps to a point on the Bloch Sphere:

- X = 2Re(αβ*)
- Y = 2Im(αβ*)
- Z = |α|² − |β|²

The application visualizes this mapping and allows direct manipulation.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **3D Rendering:** Three.js + React Three Fiber
- **Math Handling:** Custom complex number logic

---