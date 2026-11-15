'use client'

/**
 * Cảnh 3D của trang /kham-pha: một hòn đảo công nghệ nổi, 5 khu sản phẩm quanh "trái tim" Click Star ở giữa,
 * dữ liệu chảy từ các khu về giữa. Dựng hoàn toàn bằng hình khối low-poly (không tệp mô hình, không ảnh) nên nhẹ.
 * Chỉ import thành phần cần dùng của three để bundler loại phần còn lại. Không đổ bóng (đỡ GPU trên điện thoại).
 *
 * Quy ước: khu thứ i đặt ở góc i * 72 độ trên vòng bán kính RING, mặt trước của khu (z cục bộ) quay ra ngoài.
 * Nút điểm chạm là phần tử HTML thật nằm ngoài canvas (bàn phím và đọc màn hình dùng được); ở đây chỉ chiếu vị trí
 * 3D xuống màn hình mỗi khung hình rồi ghi vào style của chúng.
 */
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  Mesh,
  Object3D,
  Points,
  QuadraticBezierCurve3,
  Vector3,
} from 'three'
import { ZONES, type ZoneId } from './zones'

const RING = 6.4
const TAU = Math.PI * 2
const STEP = TAU / ZONES.length
const DARK = '#10244d'
const LIGHT = '#eaf1ff'

const angleOf = (i: number) => i * STEP

export type SceneProps = {
  focus: ZoneId | null
  reduced: boolean
  active: boolean
  /** Nút điểm chạm HTML theo mã khu; cảnh ghi vị trí màn hình vào đây. */
  hotspotRefs: MutableRefObject<Partial<Record<ZoneId, HTMLElement | null>>>
  /** Phần kéo xoay (radian) cộng dồn từ thao tác kéo; cảnh đọc rồi về 0. */
  dragRef: MutableRefObject<number>
  onSelect: (id: ZoneId) => void
  onReady: () => void
}

export default function ExploreScene({ focus, reduced, active, hotspotRefs, dragRef, onSelect, onReady }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 42, near: 0.1, far: 120, position: [0, 9, 17] }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
      aria-hidden="true"
    >
      <fog attach="fog" args={['#07122b', 24, 52]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 12, 8]} intensity={1.7} />
      <pointLight position={[0, 3, 0]} intensity={36} distance={14} color="#7ab3ff" />

      <Island />
      <Stars reduced={reduced} />
      <Core reduced={reduced} />
      <Flow reduced={reduced} />
      {ZONES.map((z, i) => (
        <ZoneBuilding key={z.id} index={i} id={z.id} color={z.color} reduced={reduced} focused={focus === z.id} onSelect={onSelect} />
      ))}
      <CameraRig focus={focus} reduced={reduced} dragRef={dragRef} />
      <Hotspots refs={hotspotRefs} />
    </Canvas>
  )
}

/* ---------- Môi trường ---------- */

function Island() {
  return (
    <group>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[9.8, 9.8, 0.7, 64]} />
        <meshStandardMaterial color={DARK} flatShading />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[10.6, 9.2, 0.5, 64]} />
        <meshStandardMaterial color="#08132b" flatShading />
      </mesh>
      {[3.2, RING, 9.3].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[r - 0.025, r + 0.025, 96]} />
          <meshBasicMaterial color="#4c9aff" transparent opacity={r === RING ? 0.5 : 0.22} />
        </mesh>
      ))}
    </group>
  )
}

function Stars({ reduced }: { reduced: boolean }) {
  const ref = useRef<Points>(null)
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    const n = 140
    const arr = new Float32Array(n * 3)
    // Số giả ngẫu nhiên cố định: cảnh giống nhau mỗi lần tải, không phụ thuộc Math.random.
    let s = 7
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    for (let i = 0; i < n; i++) {
      const r = 22 + rnd() * 22
      const a = rnd() * TAU
      const y = (rnd() - 0.2) * 26
      arr[i * 3] = Math.sin(a) * r
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = Math.cos(a) * r
    }
    g.setAttribute('position', new BufferAttribute(arr, 3))
    return g
  }, [])
  useFrame((_, dt) => {
    if (!reduced && ref.current) ref.current.rotation.y += dt * 0.012
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#9cc4ff" size={0.16} sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

/* ---------- Trái tim Click Star ở giữa ---------- */

function Core({ reduced }: { reduced: boolean }) {
  const gem = useRef<Mesh>(null)
  const halo = useRef<Group>(null)
  useFrame((s, dt) => {
    if (reduced) return
    if (gem.current) {
      gem.current.rotation.y += dt * 0.6
      gem.current.position.y = 2.7 + Math.sin(s.clock.elapsedTime * 1.2) * 0.12
    }
    if (halo.current) halo.current.rotation.z += dt * 0.35
  })
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.5, 8]} />
        <meshStandardMaterial color="#17326a" flatShading />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 8]} />
        <meshBasicMaterial color="#7ab3ff" transparent opacity={0.5} />
      </mesh>
      <mesh ref={gem} position={[0, 2.7, 0]}>
        <octahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color="#cfe3ff" emissive="#4c9aff" emissiveIntensity={1.1} flatShading />
      </mesh>
      <group ref={halo} position={[0, 2.7, 0]} rotation={[1.1, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.65, 0.025, 8, 72]} />
          <meshBasicMaterial color="#9cc4ff" />
        </mesh>
      </group>
    </group>
  )
}

/** Đường và hạt dữ liệu chảy từ mỗi khu về trái tim. */
function Flow({ reduced }: { reduced: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const PER = 5
  const { curves, lines } = useMemo(() => {
    const curves = ZONES.map((_, i) => {
      const a = angleOf(i)
      const from = new Vector3(Math.sin(a) * RING, 1.2, Math.cos(a) * RING)
      const mid = new Vector3(Math.sin(a) * RING * 0.5, 4.8, Math.cos(a) * RING * 0.5)
      return new QuadraticBezierCurve3(from, mid, new Vector3(0, 2.6, 0))
    })
    const lines = curves.map(
      (c, i) =>
        new Line(
          new BufferGeometry().setFromPoints(c.getPoints(48)),
          new LineBasicMaterial({ color: ZONES[i].color, transparent: true, opacity: 0.38 })
        )
    )
    return { curves, lines }
  }, [])
  const dummy = useMemo(() => new Object3D(), [])

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    const c = new Color()
    ZONES.forEach((z, zi) => {
      for (let k = 0; k < PER; k++) m.setColorAt(zi * PER + k, c.set(z.color))
    })
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [])

  useFrame((s) => {
    const m = mesh.current
    if (!m) return
    const t0 = reduced ? 3 : s.clock.elapsedTime
    curves.forEach((curve, zi) => {
      for (let k = 0; k < PER; k++) {
        const u = (t0 * 0.11 + k / PER + zi * 0.17) % 1
        dummy.position.copy(curve.getPoint(u))
        dummy.scale.setScalar(0.75 + Math.sin(u * Math.PI) * 0.6)
        dummy.updateMatrix()
        m.setMatrixAt(zi * PER + k, dummy.matrix)
      }
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      <instancedMesh ref={mesh} args={[undefined, undefined, ZONES.length * PER]}>
        <sphereGeometry args={[0.085, 8, 8]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  )
}

/* ---------- Camera và điểm chạm ---------- */

function CameraRig({ focus, reduced, dragRef }: { focus: ZoneId | null; reduced: boolean; dragRef: MutableRefObject<number> }) {
  const look = useRef(new Vector3(0, 1.4, 0))
  const tPos = useMemo(() => new Vector3(), [])
  const tLook = useMemo(() => new Vector3(), [])
  useFrame((state, dt) => {
    const { camera, size } = state
    const k = 1 - Math.exp(-dt * (reduced ? 30 : 2.8))
    // Màn dọc (điện thoại): lùi camera ra để thấy đủ cảnh.
    const far = size.width / size.height < 1 ? 1 + (1 - size.width / size.height) * 0.85 : 1
    if (focus) {
      const a = angleOf(ZONES.findIndex((z) => z.id === focus))
      // Màn ngang: dời điểm nhìn sang phải để khu hiện lệch trái, nhường chỗ cho khung thông tin bên phải.
      const aside = size.width / size.height > 1.25 ? 2.3 : 0
      tPos.set(Math.sin(a) * (RING + 8.2 * far) + Math.cos(a) * aside, 4.6 + 0.8 * far, Math.cos(a) * (RING + 8.2 * far) - Math.sin(a) * aside)
      tLook.set(Math.sin(a) * RING + Math.cos(a) * aside, 1.7, Math.cos(a) * RING - Math.sin(a) * aside)
    } else {
      // Quay quanh đảo từ đúng góc camera đang đứng (không giật khi thoát khỏi một khu).
      const a = Math.atan2(camera.position.x, camera.position.z) + (reduced ? 0 : dt * 0.06) + dragRef.current
      dragRef.current = 0
      tPos.set(Math.sin(a) * 19.5 * far, 9.8 * (0.9 + 0.1 * far), Math.cos(a) * 19.5 * far)
      tLook.set(0, 1.4, 0)
    }
    camera.position.lerp(tPos, k)
    look.current.lerp(tLook, k)
    camera.lookAt(look.current)
  })
  return null
}

function Hotspots({ refs }: { refs: SceneProps['hotspotRefs'] }) {
  const v = useMemo(() => new Vector3(), [])
  useFrame(({ camera, size }) => {
    ZONES.forEach((z, i) => {
      const el = refs.current[z.id]
      if (!el) return
      const a = angleOf(i)
      v.set(Math.sin(a) * RING, 3.9, Math.cos(a) * RING).project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const y = (-v.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`
      el.style.zIndex = String(Math.round((1 - v.z) * 1000))
      el.style.visibility = v.z > 1 ? 'hidden' : 'visible'
    })
  })
  return null
}

/* ---------- Các khu ---------- */

function ZoneBuilding({
  index,
  id,
  color,
  reduced,
  focused,
  onSelect,
}: {
  index: number
  id: ZoneId
  color: string
  reduced: boolean
  focused: boolean
  onSelect: (id: ZoneId) => void
}) {
  const group = useRef<Group>(null)
  const hover = useRef(false)
  const a = angleOf(index)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const goal = focused ? 1.06 : hover.current ? 1.04 : 1
    g.scale.setScalar(g.scale.x + (goal - g.scale.x) * Math.min(1, dt * 8))
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return // vừa kéo xoay, không phải bấm
    e.stopPropagation()
    onSelect(id)
  }

  return (
    <group
      ref={group}
      position={[Math.sin(a) * RING, 0, Math.cos(a) * RING]}
      rotation={[0, a, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        hover.current = true
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        hover.current = false
        document.body.style.cursor = ''
      }}
    >
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[2.3, 2.5, 0.24, 6]} />
        <meshStandardMaterial color="#17326a" flatShading />
      </mesh>
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.12, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {id === 'website' && <WebsiteZone color={color} reduced={reduced} />}
      {id === 'crm' && <CrmZone color={color} reduced={reduced} />}
      {id === 'speech' && <SpeechZone color={color} reduced={reduced} />}
      {id === 'dashboard' && <DashboardZone color={color} reduced={reduced} />}
      {id === 'ads' && <AdsZone color={color} reduced={reduced} />}
    </group>
  )
}

type ZoneProps = { color: string; reduced: boolean }
const still = 1.4

function WebsiteZone({ color, reduced }: ZoneProps) {
  const panel = useRef<Group>(null)
  const cursor = useRef<Mesh>(null)
  useFrame((s) => {
    const t = reduced ? still : s.clock.elapsedTime
    if (panel.current) panel.current.position.y = 1.9 + Math.sin(t * 1.1) * 0.07
    if (cursor.current) {
      cursor.current.position.x = 0.5 + Math.sin(t * 0.9) * 0.55
      cursor.current.position.y = -0.1 + Math.cos(t * 0.7) * 0.3
    }
  })
  return (
    <group ref={panel} position={[0, 1.9, 0]}>
      <mesh>
        <boxGeometry args={[3.1, 2.1, 0.16]} />
        <meshStandardMaterial color={LIGHT} flatShading />
      </mesh>
      <mesh position={[0, 0.9, 0.1]}>
        <boxGeometry args={[3.1, 0.32, 0.12]} />
        <meshStandardMaterial color={DARK} flatShading />
      </mesh>
      {[-1.32, -1.15, -0.98].map((x, i) => (
        <mesh key={x} position={[x, 0.9, 0.18]}>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshBasicMaterial color={['#ff6b6b', '#ffd166', '#6be3a0'][i]} />
        </mesh>
      ))}
      <mesh position={[-0.55, 0.25, 0.12]}>
        <boxGeometry args={[1.5, 0.75, 0.1]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0.9, 0.35, 0.12]}>
        <boxGeometry args={[0.8, 0.55, 0.1]} />
        <meshStandardMaterial color="#c4d6f5" flatShading />
      </mesh>
      {[-0.55, -0.85].map((y, i) => (
        <mesh key={y} position={[i ? -0.15 : -0.35, y, 0.12]}>
          <boxGeometry args={[i ? 1.8 : 2.2, 0.14, 0.08]} />
          <meshStandardMaterial color="#c4d6f5" flatShading />
        </mesh>
      ))}
      <mesh ref={cursor} position={[0.5, -0.1, 0.35]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.13, 0.32, 3]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.6} flatShading />
      </mesh>
    </group>
  )
}

function CrmZone({ color, reduced }: ZoneProps) {
  const orbit = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  useFrame((s, dt) => {
    if (reduced) return
    if (orbit.current) orbit.current.rotation.y += dt * 0.55
    if (core.current) core.current.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 1.6) * 0.05)
  })
  return (
    <group position={[0, 1.7, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} flatShading />
      </mesh>
      <group ref={orbit} rotation={[0.35, 0, 0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.55, 0.02, 8, 72]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * TAU
          return (
            <mesh key={i} position={[Math.cos(a) * 1.55, 0, Math.sin(a) * 1.55]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color={i % 2 ? LIGHT : '#9cc4ff'} flatShading />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

function SpeechZone({ color, reduced }: ZoneProps) {
  const bars = useRef<(Mesh | null)[]>([])
  const N = 9
  useFrame((s) => {
    const t = reduced ? still : s.clock.elapsedTime
    bars.current.forEach((m, i) => {
      if (!m) return
      const h = 0.45 + Math.abs(Math.sin(t * 1.7 + i * 0.75)) * 1.5
      m.scale.y = h
      m.position.y = 0.3 + h / 2
    })
  })
  return (
    <group>
      <mesh position={[0, 1.45, -0.55]}>
        <boxGeometry args={[3.0, 2.2, 0.1]} />
        <meshStandardMaterial color="#17326a" transparent opacity={0.85} flatShading />
      </mesh>
      {Array.from({ length: N }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            bars.current[i] = m
          }}
          position={[(i - (N - 1) / 2) * 0.3, 1, 0]}
        >
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function DashboardZone({ color, reduced }: ZoneProps) {
  const donut = useRef<Mesh>(null)
  const live = useRef<Mesh>(null)
  useFrame((s, dt) => {
    if (reduced) return
    if (donut.current) donut.current.rotation.z -= dt * 0.8
    if (live.current) {
      const h = 0.5 + Math.abs(Math.sin(s.clock.elapsedTime * 1.2)) * 0.5
      live.current.scale.y = h
      live.current.position.y = -0.4 + h / 2
    }
  })
  const screen = (x: number, ry: number, w: number, h: number, bars: number[]) => (
    <group position={[x, 1.55, ry ? 0.15 : 0]} rotation={[0, ry, 0]}>
      <mesh>
        <boxGeometry args={[w, h, 0.1]} />
        <meshStandardMaterial color={DARK} flatShading />
      </mesh>
      {bars.map((b, i) => (
        <mesh key={i} position={[(i - (bars.length - 1) / 2) * (w / (bars.length + 1)), -h / 2 + 0.15 + (b * (h - 0.4)) / 2, 0.08]}>
          <boxGeometry args={[w / (bars.length * 2), b * (h - 0.4), 0.06]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} flatShading />
        </mesh>
      ))}
    </group>
  )
  return (
    <group>
      {screen(0, 0, 2.1, 1.5, [0.4, 0.7, 0.55, 0.95, 0.8])}
      {screen(-1.75, 0.55, 1.3, 1.0, [0.5, 0.8, 0.6])}
      {screen(1.75, -0.55, 1.3, 1.0, [0.7, 0.45, 0.85])}
      <mesh ref={live} position={[0, 0.1, 0.9]}>
        <boxGeometry args={[0.28, 1, 0.28]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.6} flatShading />
      </mesh>
      <mesh ref={donut} position={[-0.9, 0.85, 1.0]}>
        <torusGeometry args={[0.4, 0.12, 10, 36, 4.4]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}

function AdsZone({ color, reduced }: ZoneProps) {
  const bars = useRef<(Mesh | null)[]>([])
  const base = [0.7, 1.0, 1.4, 1.8, 2.3]
  useFrame((s) => {
    const t = reduced ? still : s.clock.elapsedTime
    bars.current.forEach((m, i) => {
      if (!m) return
      const h = base[i] * (0.9 + Math.sin(t * 0.9 + i * 0.6) * 0.1)
      m.scale.y = h
      m.position.y = 0.26 + h / 2
    })
  })
  return (
    <group>
      {base.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            bars.current[i] = m
          }}
          position={[(i - 2) * 0.52, 1, -0.1]}
        >
          <boxGeometry args={[0.36, 1, 0.36]} />
          <meshStandardMaterial color={i === 4 ? '#ffffff' : color} emissive={color} emissiveIntensity={i === 4 ? 0.7 : 0.25} flatShading />
        </mesh>
      ))}
      <mesh position={[0.95, 3.0, 0.5]} rotation={[0, 0, -Math.PI / 2.6]}>
        <coneGeometry args={[0.3, 0.85, 12]} />
        <meshStandardMaterial color={LIGHT} flatShading />
      </mesh>
      <mesh position={[0.45, 3.2, 0.5]}>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 12]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}
