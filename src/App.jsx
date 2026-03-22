import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    padding: '20px',
    gap: '20px',
  },
  panel: {
    background: '#16213e',
    borderRadius: '8px',
    padding: '20px',
  },
  leftPanel: {
    width: '120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  centerPanel: {
    flex: 1,
    height: '80vh',   // IMPORTANT
    display: 'block', // remove flex centering
  },
  rightPanel: {
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  button: {
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
    color: '#ffffff',
  },
  canvasPlaceholder: {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    border: '2px dashed #4a4a6a',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6a6a8a',
    fontSize: '14px',
  },
  section: {
    marginBottom: '16px',
  },
  label: {
    fontSize: '12px',
    color: '#808080',
    marginBottom: '4px',
  },
  value: {
    fontSize: '16px',
    fontFamily: 'monospace',
    color: '#ffffff',
  },
  stateVector: {
    fontSize: '18px',
    fontFamily: 'monospace',
    padding: '12px',
    background: '#0f0f23',
    borderRadius: '4px',
    textAlign: 'center',
  },
  coordRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #2a2a4a',
  },
  probBar: {
    height: '8px',
    background: '#0f0f23',
    borderRadius: '4px',
    marginTop: '4px',
    overflow: 'hidden',
  },
  probFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },
}

const gateColors = {
  X: '#e74c3c',
  Y: '#2ecc71',
  Z: '#3498db',
  H: '#9b59b6',
}

function BlochSphere({ coords }) {

  const scale = 0.98

  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(
      coords.x * scale,
      coords.y * scale,
      coords.z * scale
    ),
  ]

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const axisLength = 1.25

  const axisX = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(axisLength, 0, 0),
  ]

  const axisY = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, axisLength, 0),
  ]

  const axisZ = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, axisLength),
  ]

    return (
    <>
      {/* Main transparent sphere */}
      <mesh>
        <sphereGeometry args={[1.001, 40, 40]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* SECOND SPHERE → grid lines */}
      <mesh>
        <sphereGeometry args={[1.001, 40, 40]} />
        <meshBasicMaterial wireframe color="#aaa" transparent opacity={0.2} />
      </mesh>

      {/* Vector */}
      <arrowHelper
        args={[
          new THREE.Vector3(
            coords.x,
            coords.z,   // swap
            coords.y    // swap
          ).normalize(),
          new THREE.Vector3(0, 0, 0),
          1.00,
          0xff4d88,
          0.1,
          0.05
        ]}
      />
      

      {/* Equator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.99, 1.01, 64]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.99, 1.01, 64]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 2]}>
        <ringGeometry args={[0.99, 1.01, 64]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* X Axis */}
      <line geometry={new THREE.BufferGeometry().setFromPoints(axisX)}>
        <lineBasicMaterial color="red" />
      </line>

      {/* Y Axis */}
      <line geometry={new THREE.BufferGeometry().setFromPoints(axisY)}>
        <lineBasicMaterial color="green" />
      </line>

      {/* Z Axis */}
      <line geometry={new THREE.BufferGeometry().setFromPoints(axisZ)}>
        <lineBasicMaterial color="blue" />
      </line>
    </>
  )
}

function App() {

    const normalize = (v) => {
    const x = Number(v.x) || 0
    const y = Number(v.y) || 0
    const z = Number(v.z) || 0

    const len = Math.sqrt(x*x + y*y + z*z)
    if (!isFinite(len) || len === 0) return { x: 0, y: 0, z: 1 }

    return { x: x/len, y: y/len, z: z/len }
  }

  const [state, setState] = useState({
    alpha: { re: 1, im: 0 },
    beta: { re: 0, im: 0 },
  })

  const [coords, setCoords] = useState({ x: 0, y: 0, z: 1 })
  const normalizedCoords = normalize(coords)

  const [history, setHistory] = useState([])

  const calculateProbabilities = () => {
    const prob0 = state.alpha.re ** 2 + state.alpha.im ** 2
    const prob1 = state.beta.re ** 2 + state.beta.im ** 2
    return { prob0, prob1 }
  }

  const applyGate = (gate) => {
    let newAlpha, newBeta

    switch (gate) {
      case 'X':
        newAlpha = { ...state.beta }
        newBeta = { ...state.alpha }
        break
      case 'Y':
        newAlpha = { re: state.beta.im, im: -state.beta.re }
        newBeta = { re: -state.alpha.im, im: state.alpha.re }
        break
      case 'Z':
        newAlpha = { ...state.alpha }
        newBeta = { re: -state.beta.re, im: -state.beta.im }
        break
      case 'H':
        const sqrt2 = Math.SQRT1_2
        newAlpha = {
          re: sqrt2 * (state.alpha.re + state.beta.re),
          im: sqrt2 * (state.alpha.im + state.beta.im),
        }
        newBeta = {
          re: sqrt2 * (state.alpha.re - state.beta.re),
          im: sqrt2 * (state.alpha.im - state.beta.im),
        }
        break
      default:
        return
    }

    setState({ alpha: newAlpha, beta: newBeta })

    const newX = 2 * (newAlpha.re * newBeta.re + newAlpha.im * newBeta.im)
    const newY = 2 * (newAlpha.im * newBeta.re - newAlpha.re * newBeta.im)
    const newZ = newAlpha.re ** 2 + newAlpha.im ** 2 - newBeta.re ** 2 - newBeta.im ** 2
    setCoords({ x: newX, y: newY, z: newZ })

    setHistory((prev) => [...prev, gate])
  }

  const reset = () => {
    setState({ alpha: { re: 1, im: 0 }, beta: { re: 0, im: 0 } })
    setCoords({ x: 0, y: 0, z: 1 })
    setHistory([])
  }

  const formatComplex = (c) => {
    const re = c.re.toFixed(3)
    const im = c.im.toFixed(3)
    if (c.im === 0) return re
    if (c.re === 0) return `${im}i`
    return `${re}${c.im >= 0 ? '+' : ''}${im}i`
  }

  const { prob0, prob1 } = calculateProbabilities()

  const dir = new THREE.Vector3(coords.x, coords.y, coords.z).normalize()
  const axis = new THREE.Vector3(0, 1, 0)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir)

  return (
    <div style={styles.container}>
      {/* Left Panel - Gate Buttons */}
      <div style={{ ...styles.panel, ...styles.leftPanel }}>
      <div style={styles.title}>Gates</div>

      {['X', 'Y', 'Z', 'H'].map((gate) => (
        <button
          key={gate}
          style={{
            ...styles.button,
            background: gateColors[gate],
          }}
          onClick={() => applyGate(gate)}
          onMouseOver={(e) => (e.target.style.opacity = '0.8')}
          onMouseOut={(e) => (e.target.style.opacity = '1')}
        >
          {gate}
        </button>
      ))}

      {/* RESET BUTTON */}
      <button
        style={{
          ...styles.button,
          background: '#555',
          marginTop: '20px',
        }}
        onClick={reset}
      >
        Reset
      </button>

      {/* MANUAL INPUT */}
      <div style={{ marginTop: '20px' }}>
        <div style={styles.title}>Manual Input</div>

        {['x', 'y', 'z'].map((axis) => (
          <div key={axis} style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px' }}>{axis.toUpperCase()}</label>
            <input
              type="number"
              step="0.1"
              value={coords[axis]}
              onChange={(e) => {
                const val = e.target.value
                setCoords((prev) => ({
                  ...prev,
                  [axis]: val === '' ? 0 : parseFloat(val),
                }))
              }}
              style={{
                width: '100%',
                padding: '6px',
                marginTop: '2px',
                borderRadius: '4px',
                border: 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>

      {/* Center Panel - 3D Canvas Placeholder */}
      <div style={{ ...styles.panel, ...styles.centerPanel }}>
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas
              camera={{ position: [3, 3, 3], fov: 50 }}
              style={{ width: '100%', height: '100%' }}
            >
            <color attach="background" args={['#16213e']} />
            <ambientLight />
            <pointLight position={[5, 5, 5]} />
            <BlochSphere coords={normalizedCoords} />
            <OrbitControls
              minDistance={2}
              maxDistance={6}
              enableZoom={true}
              zoomSpeed={0.6}
              rotateSpeed={0.5}
              panSpeed={0.5}
            />
          </Canvas>
        </div>
      </div>

      {/* Right Panel - State Information */}
      <div style={{ ...styles.panel, ...styles.rightPanel }}>
        <div>
          <div style={styles.title}>Quantum State</div>
          <div style={styles.stateVector}>
            |ψ⟩ = {formatComplex(state.alpha)}|0⟩ + {formatComplex(state.beta)}|1⟩
          </div>
        </div>

        <div>
          <div style={styles.title}>Probabilities</div>
          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={styles.label}>|0⟩</span>
              <span style={styles.value}>{(prob0 * 100).toFixed(1)}%</span>
            </div>
            <div style={styles.probBar}>
              <div
                style={{
                  ...styles.probFill,
                  width: `${prob0 * 100}%`,
                  background: '#3498db',
                }}
              />
            </div>
          </div>
          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={styles.label}>|1⟩</span>
              <span style={styles.value}>{(prob1 * 100).toFixed(1)}%</span>
            </div>
            <div style={styles.probBar}>
              <div
                style={{
                  ...styles.probFill,
                  width: `${prob1 * 100}%`,
                  background: '#e74c3c',
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <div style={styles.title}>Bloch Coordinates</div>
          <div style={styles.coordRow}>
            <span style={styles.label}>X</span>
            <span style={styles.value}>{normalizedCoords.x.toFixed(4)}</span>
          </div>
          <div style={styles.coordRow}>
            <span style={styles.label}>Y</span>
            <span style={styles.value}>{normalizedCoords.y.toFixed(4)}</span>
          </div>
          <div style={styles.coordRow}>
            <span style={styles.label}>Z</span>
            <span style={styles.value}>{normalizedCoords.z.toFixed(4)}</span>
          </div>
        </div>

        <div>
          <div style={styles.title}>Gate History</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {history.length === 0 ? (
              <span style={{ color: '#555', fontSize: '12px' }}>No gates applied</span>
            ) : (
              history.map((gate, i) => (
                <span
                  key={i}
                  style={{
                    padding: '4px 8px',
                    background: gateColors[gate],
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {gate}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App