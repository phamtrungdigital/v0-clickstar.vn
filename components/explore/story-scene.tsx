'use client'

/**
 * Cảnh 3D kể chuyện của trang /kham-pha, đợt 1 (chương 1-3): văn phòng nơi chủ doanh nghiệp đang rối, con phố tới trụ sở
 * Click Star, cánh cửa mở và sảnh bên trong. Mọi thứ là hàm của tiến độ cuộn p (story-timeline.ts), nên cuộn tới hay lui
 * đều đúng, không có "thời gian chạy" riêng. Dựng bằng hình khối, không tệp mô hình; nhân vật là ảnh thật dựng đứng (Cutout, cutout.tsx).
 *
 * Hai bối cảnh đặt cách nhau theo trục x (phố ở x = STREET_X) và chỉ hiện bối cảnh đang dùng; giữa chương 1 và 2 có một
 * lần cắt cảnh che bằng màn tối (ở lớp chữ). Đèn điểm giữ nguyên số lượng, chỉ đổi cường độ (đổi số đèn làm dựng lại shader).
 */
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Color, Fog, InstancedMesh, Matrix4, Mesh, Group, PointLight, Vector3, MeshStandardMaterial } from 'three'
import { Cutout, newCutoutState, type CutoutState } from './cutout'
import { CUT, DOOR_END, DOOR_START, STREET_START, clamp01, lerp, smooth } from './story-timeline'

const STREET_X = 60
const DOOR_X = 6 // hoành độ cửa Click Star, tính trong hệ toạ độ của phố
const WALL_Z = -2.4 // mặt tiền các toà nhà
const TAU = Math.PI * 2

export type AnchorId = 'leak' | 'scatter' | 'calls' | 'sign'

export type StorySceneProps = {
  progressRef: MutableRefObject<number>
  /** Cảnh ghi tiến độ đã làm mượt (đang hiển thị) vào đây để lớp chữ và màn che khớp với hình. */
  shownRef: MutableRefObject<number>
  anchorRefs: MutableRefObject<Partial<Record<AnchorId, HTMLElement | null>>>
  active: boolean
  reduced: boolean
  onReady: () => void
}


// Số giả ngẫu nhiên cố định (cảnh giống nhau mỗi lần tải).
function seeded(seed: number) {
  let s = seed
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
}

export default function StoryScene({ progressRef, shownRef, anchorRefs, active, reduced, onReady }: StorySceneProps) {
  const prog = useRef(0)
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 42, near: 0.1, far: 140, position: [3, 2, 4] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <fog attach="fog" args={['#1a2033', 14, 44]} />
      <Director progressRef={progressRef} shownRef={shownRef} prog={prog} reduced={reduced} />
      <ambientLight intensity={1.15} color="#b4c4ee" />
      <directionalLight position={[5, 9, 6]} intensity={1.9} color="#e4ecff" />
      <directionalLight position={[-6, 5, 4]} intensity={0.8} color="#9fb6ff" />
      <OfficeSet prog={prog} reduced={reduced} />
      <StreetSet prog={prog} reduced={reduced} />
      <Anchors refs={anchorRefs} prog={prog} />
    </Canvas>
  )
}

/* ---------- Đạo diễn: tiến độ mượt, camera, màu nền, nhân vật trên phố ---------- */

const BG_OFFICE = new Color('#1a2033')
const BG_STREET = new Color('#0f1d3f')
const BG_INSIDE = new Color('#cfe0ff')

function Director({
  progressRef,
  shownRef,
  prog,
  reduced,
}: {
  progressRef: StorySceneProps['progressRef']
  shownRef: StorySceneProps['shownRef']
  prog: MutableRefObject<number>
  reduced: boolean
}) {
  const pos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])
  const a = useMemo(() => new Vector3(), [])
  const b = useMemo(() => new Vector3(), [])
  const bg = useMemo(() => new Color(), [])

  useFrame((state, dt) => {
    const { camera, scene, clock } = state
    prog.current += (progressRef.current - prog.current) * (1 - Math.exp(-dt * (reduced ? 20 : 5)))
    const p = prog.current
    shownRef.current = p
    const t = reduced ? 0 : clock.elapsedTime
    const sway = reduced ? 0 : 1

    if (p < CUT) {
      // Chương 1: vòng từ sau lưng nhân vật sang phía trước để thấy nét mặt, kèm 3 rắc rối.
      const u = smooth(0, CUT, p)
      pos.set(lerp(3.6, -2.9, u) + Math.sin(t * 0.35) * 0.06 * sway, lerp(2.1, 1.95, u), lerp(5.4, 4.7, u))
      look.set(lerp(0.2, 0, u), lerp(1.5, 1.45, u), -0.5)
    } else {
      const u = clamp01((p - STREET_START) / (DOOR_START - STREET_START)) // tiến độ chương 2
      const v = clamp01((p - DOOR_START) / (DOOR_END - DOOR_START)) // tiến độ chương 3
      const px = STREET_X + streetX(u)
      if (p < DOOR_START) {
        // Máy quay đi theo nhân vật, rồi lùi ra thấy toàn mặt tiền Click Star.
        a.set(px + 2.7, 1.6, 5.8)
        b.set(STREET_X + DOOR_X, 2.0, 8.2)
        pos.lerpVectors(a, b, smooth(0.55, 1, u))
        a.set(px + 0.8, 1.25, 0.4)
        b.set(STREET_X + DOOR_X, 2.1, WALL_Z)
        look.lerpVectors(a, b, smooth(0.55, 1, u))
      } else {
        // Chương 3: tới sát cửa, rồi máy quay đẩy dần qua khung cửa vào sảnh (khách "bước vào").
        a.set(STREET_X + DOOR_X, 2.0, 8.2)
        b.set(STREET_X + DOOR_X, 1.55, 5.0)
        pos.lerpVectors(a, b, smooth(0, 0.25, v))
        a.set(STREET_X + DOOR_X, 1.45, -1.0)
        pos.lerp(a, smooth(0.25, 0.95, v))
        a.set(STREET_X + DOOR_X, 2.0, WALL_Z)
        b.set(STREET_X + DOOR_X, 1.1, -2.4)
        look.lerpVectors(a, b, smooth(0, 0.25, v))
        a.set(STREET_X + DOOR_X, 1.2, -6.5)
        look.lerp(a, smooth(0.25, 0.95, v))
      }
    }
    // Màn dọc (điện thoại): lùi máy quay ra theo hướng nhìn và hạ cảnh xuống nửa dưới để chừa chỗ cho chữ ở trên.
    const aspect = state.size.width / state.size.height
    if (aspect < 1) {
      const far = 1 + (1 - aspect) * 1.1
      pos.sub(look).multiplyScalar(far).add(look)
      look.y += 0.9 * (far - 1)
    }
    camera.position.copy(pos)
    camera.lookAt(look)

    // Màu nền và sương theo bối cảnh: văn phòng tối, phố chạng vạng xanh, sảnh sáng.
    if (p < CUT) bg.copy(BG_OFFICE)
    else bg.copy(BG_STREET).lerp(BG_INSIDE, smooth(DOOR_START + 0.06, DOOR_END - 0.02, p))
    if (!(scene.background instanceof Color)) scene.background = new Color()
    ;(scene.background as Color).copy(bg)
    if (scene.fog instanceof Fog) {
      scene.fog.color.copy(bg)
      scene.fog.near = p < CUT ? 14 : lerp(16, 30, smooth(DOOR_START, DOOR_END, p))
      scene.fog.far = p < CUT ? 44 : lerp(46, 80, smooth(DOOR_START, DOOR_END, p))
    }
  })
  return null
}

/** Hoành độ (hệ phố) của nhân vật theo tiến độ u của chương 2: đi đều dọc vỉa hè, dừng cạnh cửa ở 80% rồi đứng chờ. */
function streetX(u: number) {
  return lerp(-9, DOOR_X - 1.1, clamp01(u / 0.8))
}

/* ---------- Văn phòng (chương 1) ---------- */

const SIT = { url: '/images/story/ngoi-ban.webp', height: 1.8, aspect: 848 / 1000 }

function OfficeSet({ prog, reduced }: { prog: MutableRefObject<number>; reduced: boolean }) {
  const group = useRef<Group>(null)
  const lamp = useRef<PointLight>(null)
  const owner = useRef<CutoutState>(newCutoutState())
  useFrame((s) => {
    const p = prog.current
    if (group.current) group.current.visible = p < CUT + 0.002
    if (lamp.current) lamp.current.intensity = p < CUT ? 14 : 0
    const o = owner.current
    o.z = 0.1
    o.opacity = 1
    // Thở nhẹ: chỉ nhún rất ít cho có sự sống (tắt khi giảm chuyển động).
    o.bob = reduced ? 0 : Math.sin(s.clock.elapsedTime * 0.9) * 0.008
  })

  // Giấy tờ bừa dưới sàn quanh ghế
  const papers = useMemo(() => {
    const r = seeded(11)
    return Array.from({ length: 7 }, () => ({ x: (r() - 0.5) * 4, z: (r() - 0.1) * 2.6, ry: r() * TAU, tilt: (r() - 0.5) * 0.1 }))
  }, [])
  const cityLights = useMemo(() => {
    const r = seeded(5)
    return Array.from({ length: 36 }, () => ({ x: (r() - 0.5) * 4.2, y: 1.3 + r() * 1.8, w: 0.06 + r() * 0.1, c: r() > 0.6 ? '#ffd9a0' : '#7ab3ff' }))
  }, [])

  return (
    <group ref={group}>
      {/* Sàn, tường, cửa sổ nhìn ra thành phố */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[14, 0.1, 10]} />
        <meshStandardMaterial color="#222a3f" flatShading />
      </mesh>
      <mesh position={[0, 2.2, -3.3]}>
        <boxGeometry args={[14, 4.4, 0.1]} />
        <meshStandardMaterial color="#1b2236" flatShading />
      </mesh>
      <mesh position={[0, 2.1, -3.22]}>
        <boxGeometry args={[4.6, 2.3, 0.04]} />
        <meshStandardMaterial color="#0c1530" emissive="#16264f" emissiveIntensity={0.8} />
      </mesh>
      {cityLights.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, -3.17]}>
          <boxGeometry args={[c.w, c.w * 1.4, 0.02]} />
          <meshBasicMaterial color={c.c} />
        </mesh>
      ))}
      {papers.map((pp, i) => (
        <mesh key={i} position={[pp.x, 0.01, pp.z]} rotation={[pp.tilt, pp.ry, 0]}>
          <boxGeometry args={[0.3, 0.006, 0.21]} />
          <meshStandardMaterial color="#e6ecf8" flatShading />
        </mesh>
      ))}
      {/* Đèn cây ấm bên trái */}
      <mesh position={[-3.0, 0.9, -0.9]}>
        <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
        <meshStandardMaterial color="#222" flatShading />
      </mesh>
      <mesh position={[-3.0, 1.85, -0.9]}>
        <coneGeometry args={[0.22, 0.3, 14, 1, true]} />
        <meshStandardMaterial color="#ffb86b" emissive="#ffb86b" emissiveIntensity={0.9} side={2} />
      </mesh>
      <pointLight ref={lamp} position={[-2.9, 1.7, -0.5]} color="#ffb86b" distance={7} intensity={14} />

      {/* Chủ doanh nghiệp ngồi ôm trán trước laptop (ảnh có sẵn bàn và ghế) */}
      <Cutout url={SIT.url} height={SIT.height} aspect={SIT.aspect} state={owner} tint="#b4c0e2" follow={0.6} />

      {/* Ba rắc rối nổi lên quanh nhân vật */}
      <HoloLeak prog={prog} reduced={reduced} />
      <HoloScatter prog={prog} reduced={reduced} />
      <HoloCalls prog={prog} reduced={reduced} />
    </group>
  )
}

const ALERT = '#ff5a52'
const AMBER = '#ffb020'

function useReveal(prog: MutableRefObject<number>, a: number, b: number, ref: MutableRefObject<Group | null>) {
  useFrame(() => {
    const g = ref.current
    if (!g) return
    const k = smooth(a, b, prog.current) * (1 - smooth(CUT - 0.04, CUT - 0.005, prog.current))
    g.scale.setScalar(Math.max(0.0001, k))
    g.visible = k > 0.001
  })
}

/** Phễu thủng: khách rơi rớt trên đường tới. */
function HoloLeak({ prog, reduced }: { prog: MutableRefObject<number>; reduced: boolean }) {
  const g = useRef<Group>(null)
  const drops = useRef<(Mesh | null)[]>([])
  useReveal(prog, 0.06, 0.1, g)
  useFrame((s) => {
    const t = reduced ? 1 : s.clock.elapsedTime
    drops.current.forEach((m, i) => {
      if (!m) return
      const u = (t * 0.5 + i / 7) % 1
      m.position.set(0.18 + Math.sin(i * 2.3) * 0.3, -0.25 - u * 1.1, 0.1 * Math.cos(i))
      m.scale.setScalar(1 - u * 0.7)
    })
  })
  return (
    <group ref={g} position={[-1.8, 2.5, -0.6]}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.45, 0.7, 6]} />
        <meshStandardMaterial color={ALERT} emissive={ALERT} emissiveIntensity={0.5} flatShading />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} ref={(m) => void (drops.current[i] = m)}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={ALERT} />
        </mesh>
      ))}
    </group>
  )
}

/** Màn hình rải rác: số liệu mỗi nơi một nẻo. */
function HoloScatter({ prog, reduced }: { prog: MutableRefObject<number>; reduced: boolean }) {
  const g = useRef<Group>(null)
  const spin = useRef<Group>(null)
  useReveal(prog, 0.12, 0.16, g)
  useFrame((_, dt) => {
    if (!reduced && spin.current) spin.current.rotation.y += dt * 0.35
  })
  const panels = useMemo(() => {
    const r = seeded(23)
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * TAU
      return { x: Math.cos(a) * 0.85, y: (r() - 0.5) * 0.7, z: Math.sin(a) * 0.85, ry: -a + (r() - 0.5), rz: (r() - 0.5) * 0.7 }
    })
  }, [])
  return (
    <group ref={g} position={[0, 3.2, -1.2]}>
      <group ref={spin}>
        {panels.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0, p.ry, p.rz]}>
            <boxGeometry args={[0.38, 0.24, 0.03]} />
            <meshStandardMaterial color="#1c2440" emissive={AMBER} emissiveIntensity={0.55} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Điện thoại đổ chuông rồi im: cuộc gọi tư vấn xong là hết. */
function HoloCalls({ prog, reduced }: { prog: MutableRefObject<number>; reduced: boolean }) {
  const g = useRef<Group>(null)
  const rings = useRef<(Mesh | null)[]>([])
  useReveal(prog, 0.18, 0.22, g)
  useFrame((s) => {
    const t = reduced ? 0.4 : s.clock.elapsedTime
    rings.current.forEach((m, i) => {
      if (!m) return
      const u = (t * 0.6 + i / 3) % 1
      m.scale.setScalar(0.5 + u * 0.9)
      ;(m.material as MeshStandardMaterial).opacity = 0.7 * (1 - u)
    })
  })
  return (
    <group ref={g} position={[1.8, 2.5, -0.6]}>
      <mesh>
        <boxGeometry args={[0.3, 0.55, 0.05]} />
        <meshStandardMaterial color="#10162a" emissive={ALERT} emissiveIntensity={0.45} flatShading />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => void (rings.current[i] = m)} position={[0, 0.05, 0.05]}>
          <torusGeometry args={[0.55, 0.014, 6, 40]} />
          <meshStandardMaterial color={ALERT} emissive={ALERT} emissiveIntensity={1} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Dấu x: cuộc gọi không ai nghe lại */}
      {[0.6, -0.6].map((r) => (
        <mesh key={r} position={[0.38, 0.4, 0.04]} rotation={[0, 0, r]}>
          <boxGeometry args={[0.2, 0.035, 0.03]} />
          <meshBasicMaterial color={ALERT} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Phố và trụ sở Click Star (chương 2, 3) ---------- */

const WALK = { url: '/images/story/di-bo.webp', height: 1.8, aspect: 574 / 1000 }
// Ảnh đẩy cửa có sẵn khung cửa: đặt khung khớp lỗ cửa của trụ sở. Người cao 1,8 thì cả ảnh cao 2,03; chân khung cách đáy ảnh 0,17.
const DOOR_IMG = { url: '/images/story/day-cua.webp', height: 2.03, aspect: 577 / 1000, groundOffset: 0.17, anchorX: -0.094 }

function StreetSet({ prog, reduced }: { prog: MutableRefObject<number>; reduced: boolean }) {
  const group = useRef<Group>(null)
  const door = useRef<Group>(null)
  const gem = useRef<Mesh>(null)
  const inside = useRef<PointLight>(null)
  const lampLight = useRef<PointLight>(null)
  const interiorMat = useRef<MeshStandardMaterial>(null)
  const walker = useRef<CutoutState>(newCutoutState())
  const pusher = useRef<CutoutState>(newCutoutState())

  useFrame((s, dt) => {
    const p = prog.current
    if (group.current) group.current.visible = p >= CUT - 0.002
    const v = clamp01((p - DOOR_START) / (DOOR_END - DOOR_START))

    // Người đi bộ (ảnh nghiêng): đi dọc vỉa hè rồi dừng cạnh cửa; mờ đi khi ảnh đẩy cửa hiện lên.
    const u = clamp01((p - STREET_START) / (DOOR_START - STREET_START))
    const w = walker.current
    const x = streetX(u)
    const walking = p < DOOR_START && u < 0.8 && !reduced
    w.x = x
    w.z = 0.4
    w.bob = walking ? Math.abs(Math.sin(x * 4.2)) * 0.035 : 0
    w.tilt = walking ? Math.sin(x * 4.2) * 0.012 : 0
    w.opacity = 1 - smooth(0.1, 0.22, v)

    // Người đẩy cửa (ảnh nhìn từ sau lưng, kèm khung cửa mở): hiện đúng lỗ cửa.
    const d = pusher.current
    d.x = DOOR_X
    d.z = WALL_Z + 0.03
    d.opacity = smooth(0.1, 0.22, v)

    // Cánh cửa 3D đóng chỉ dùng trước khi ảnh đẩy cửa hiện lên.
    if (door.current) door.current.visible = v < 0.17
    const open = smooth(0.25, 0.7, v)
    if (inside.current) inside.current.intensity = 6 + open * 34
    if (lampLight.current) lampLight.current.intensity = 10
    if (interiorMat.current) interiorMat.current.emissiveIntensity = 0.45 + open * 0.55
    if (gem.current && !reduced) gem.current.rotation.y += dt * 0.8
    void s
  })

  const towers = useMemo(() => {
    const r = seeded(41)
    // Dãy nhà bên trái và bên phải trụ sở: x, rộng, cao
    const list: { x: number; w: number; h: number }[] = []
    let x = -22
    while (x < 2.8) {
      const w = 2.4 + r() * 2.2
      list.push({ x: x + w / 2, w, h: 4 + r() * 6 })
      x += w + 0.25
    }
    x = 9
    while (x < 30) {
      const w = 2.4 + r() * 2.2
      list.push({ x: x + w / 2, w, h: 4 + r() * 6 })
      x += w + 0.25
    }
    return list
  }, [])

  return (
    <group ref={group} position={[STREET_X, 0, 0]}>
      <pointLight ref={lampLight} position={[3.2, 3.4, 1.6]} color="#ffd9a0" distance={12} intensity={10} />
      <pointLight ref={inside} position={[DOOR_X, 2.5, -4.6]} color="#eaf2ff" distance={10} intensity={6} />

      {/* Mặt đất: vỉa hè sát nhà, lòng đường có vạch kẻ */}
      <mesh position={[0, -0.1, 2]}>
        <boxGeometry args={[70, 0.1, 14]} />
        <meshStandardMaterial color="#10172c" flatShading />
      </mesh>
      <mesh position={[0, -0.025, -0.1]}>
        <boxGeometry args={[70, 0.05, 5.0]} />
        <meshStandardMaterial color="#2b3452" flatShading />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[-22 + i * 3.4, -0.04, 5.6]}>
          <boxGeometry args={[1.5, 0.01, 0.12]} />
          <meshBasicMaterial color="#b9c8ee" />
        </mesh>
      ))}

      {/* Các toà nhà hai bên */}
      {towers.map((b, i) => (
        <group key={i}>
          <mesh position={[b.x, b.h / 2, WALL_Z - 1.2]}>
            <boxGeometry args={[b.w, b.h, 2.4]} />
            <meshStandardMaterial color={i % 2 ? '#18213c' : '#1b2644'} flatShading />
          </mesh>
          <Windows x={b.x} w={b.w} h={b.h} seed={i + 3} />
        </group>
      ))}

      {/* Đèn đường */}
      {[-7, 1.8, 13].map((x) => (
        <group key={x} position={[x, 0, 2.5]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.035, 0.05, 3.2, 8]} />
            <meshStandardMaterial color="#252c44" flatShading />
          </mesh>
          <mesh position={[0, 3.25, 0]}>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshBasicMaterial color="#ffe2b0" />
          </mesh>
        </group>
      ))}

      <ClickStarBuilding door={door} gem={gem} interiorMat={interiorMat} />

      {/* Chủ doanh nghiệp bằng ảnh thật: đi bộ trên phố, rồi đẩy cửa bước vào */}
      <Cutout url={WALK.url} height={WALK.height} aspect={WALK.aspect} state={walker} tint="#c4cef0" follow={0.4} />
      <Cutout url={DOOR_IMG.url} height={DOOR_IMG.height} aspect={DOOR_IMG.aspect} groundOffset={DOOR_IMG.groundOffset} anchorX={DOOR_IMG.anchorX} state={pusher} tint="#aebbe0" follow={0} shadow={0} />
    </group>
  )
}

/** Cửa sổ sáng đèn trên mặt tiền một toà nhà (một khối instanced cho cả toà). */
function Windows({ x, w, h, seed, minY = 0 }: { x: number; w: number; h: number; seed: number; minY?: number }) {
  const ref = useRef<InstancedMesh>(null)
  const cells = useMemo(() => {
    const r = seeded(seed * 97)
    const out: { x: number; y: number; warm: boolean }[] = []
    const cols = Math.max(1, Math.floor(w / 0.85))
    const rows = Math.max(1, Math.floor((h - 1) / 1.1))
    for (let c = 0; c < cols; c++)
      for (let rr = 0; rr < rows; rr++) if (r() > 0.42 && 1.3 + rr * 1.1 >= minY) out.push({ x: x - w / 2 + 0.5 + c * ((w - 1) / Math.max(1, cols - 1 || 1)), y: 1.3 + rr * 1.1, warm: r() > 0.35 })
    return out
  }, [x, w, h, seed])
  useEffect(() => {
    const m = ref.current
    if (!m) return
    const mat = new Matrix4()
    const c = new Color()
    cells.forEach((cell, i) => {
      mat.makeTranslation(cell.x, cell.y, WALL_Z + 0.02)
      m.setMatrixAt(i, mat)
      m.setColorAt(i, c.set(cell.warm ? '#cdb185' : '#5a86c8'))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [cells])
  if (!cells.length) return null
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cells.length]}>
      <planeGeometry args={[0.38, 0.5]} />
      <meshBasicMaterial />
    </instancedMesh>
  )
}

function ClickStarBuilding({
  door,
  gem,
  interiorMat,
}: {
  door: MutableRefObject<Group | null>
  gem: MutableRefObject<Mesh | null>
  interiorMat: MutableRefObject<MeshStandardMaterial | null>
}) {
  const X = DOOR_X
  const wall = '#12285a'
  return (
    <group>
      {/* Mặt tiền: hai trụ hai bên lỗ cửa (rộng 0,9, cao 1,85 khớp khung cửa trong ảnh), dầm trên có biển hiệu, các tầng trên */}
      {[X - 1.4, X + 1.4].map((x) => (
        <mesh key={x} position={[x, 0.925, WALL_Z - 0.15]}>
          <boxGeometry args={[1.9, 1.85, 0.3]} />
          <meshStandardMaterial color={wall} flatShading />
        </mesh>
      ))}
      <mesh position={[X, 2.65, WALL_Z - 0.15]}>
        <boxGeometry args={[4.7, 1.6, 0.3]} />
        <meshStandardMaterial color={wall} flatShading />
      </mesh>
      <mesh position={[X, 5.55, WALL_Z - 0.15]}>
        <boxGeometry args={[4.7, 4.2, 0.3]} />
        <meshStandardMaterial color="#0f2250" flatShading />
      </mesh>
      {/* Kính hai bên cửa, sáng nhẹ */}
      {[X - 1.4, X + 1.4].map((x) => (
        <mesh key={x} position={[x, 1.05, WALL_Z + 0.02]}>
          <boxGeometry args={[1.3, 1.4, 0.04]} />
          <meshStandardMaterial color="#1f4fa8" emissive="#3b86f0" emissiveIntensity={0.5} flatShading />
        </mesh>
      ))}
      {/* Biển hiệu: tấm sáng + viên ngọc 4 cánh giống logo; chữ là nhãn HTML gắn theo (xem Anchors) */}
      <mesh position={[X, 2.65, WALL_Z + 0.03]}>
        <boxGeometry args={[3.6, 0.7, 0.1]} />
        <meshStandardMaterial color="#0b1f4a" emissive="#1e6dda" emissiveIntensity={0.9} flatShading />
      </mesh>
      <mesh ref={gem} position={[X - 1.45, 2.65, WALL_Z + 0.2]}>
        <octahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#cfe3ff" emissiveIntensity={1.2} flatShading />
      </mesh>
      {/* Các tầng trên có cửa sổ sáng */}
      <Windows x={X} w={4.7} h={9} seed={99} minY={4.2} />

      {/* Cánh cửa 3D đóng (bản lề ở mép trái), chỉ hiện trước khi ảnh đẩy cửa thế chỗ */}
      <group ref={door} position={[X - 0.44, 0, WALL_Z - 0.02]}>
        <mesh position={[0.44, 0.9, 0]}>
          <boxGeometry args={[0.88, 1.8, 0.06]} />
          <meshStandardMaterial color="#2a4f9a" emissive="#4c9aff" emissiveIntensity={0.35} flatShading />
        </mesh>
        <mesh position={[0.78, 0.9, 0.06]}>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshStandardMaterial color="#e6eefc" flatShading />
        </mesh>
      </group>

      {/* Sảnh bên trong: sáng, có quầy lễ tân và biểu tượng Click Star trên tường cuối */}
      <mesh position={[X, -0.05, -5]}>
        <boxGeometry args={[5, 0.1, 5.4]} />
        <meshStandardMaterial ref={interiorMat} color="#dbe7fb" emissive="#9fb6e6" emissiveIntensity={0.45} flatShading />
      </mesh>
      <mesh position={[X, 2.1, -7.7]}>
        <boxGeometry args={[5, 4.4, 0.1]} />
        <meshStandardMaterial color="#e9f1ff" emissive="#b5c9f0" emissiveIntensity={0.5} flatShading />
      </mesh>
      {[X - 2.5, X + 2.5].map((x) => (
        <mesh key={x} position={[x, 2.1, -5]}>
          <boxGeometry args={[0.1, 4.4, 5.4]} />
          <meshStandardMaterial color="#d3e1fa" emissive="#9fb6e6" emissiveIntensity={0.35} flatShading />
        </mesh>
      ))}
      <mesh position={[X, 4.3, -5]}>
        <boxGeometry args={[5, 0.1, 5.4]} />
        <meshStandardMaterial color="#f4f8ff" emissive="#ffffff" emissiveIntensity={0.6} flatShading />
      </mesh>
      <mesh position={[X, 2.4, -7.6]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#1e6dda" emissive="#1e6dda" emissiveIntensity={0.6} flatShading />
      </mesh>
      <mesh position={[X + 1.3, 0.5, -6.6]}>
        <boxGeometry args={[1.8, 1.0, 0.7]} />
        <meshStandardMaterial color="#274f9e" flatShading />
      </mesh>
    </group>
  )
}

/* ---------- Nhãn chữ HTML gắn theo vị trí 3D ---------- */

const ANCHORS: { id: AnchorId; pos: [number, number, number]; show: [number, number, number, number]; space: 'office' | 'street' }[] = [
  { id: 'leak', pos: [-1.8, 3.3, -0.6], show: [0.08, 0.11, 0.29, 0.325], space: 'office' },
  { id: 'scatter', pos: [0, 4.05, -1.2], show: [0.14, 0.17, 0.29, 0.325], space: 'office' },
  { id: 'calls', pos: [1.8, 3.3, -0.6], show: [0.2, 0.23, 0.29, 0.325], space: 'office' },
  { id: 'sign', pos: [STREET_X + DOOR_X + 0.3, 2.75, WALL_Z + 0.1], show: [0.5, 0.56, 0.84, 0.88], space: 'street' },
]

function Anchors({ refs, prog }: { refs: StorySceneProps['anchorRefs']; prog: MutableRefObject<number> }) {
  const v = useMemo(() => new Vector3(), [])
  useFrame(({ camera, size }) => {
    const p = prog.current
    for (const an of ANCHORS) {
      const el = refs.current[an.id]
      if (!el) continue
      const [a, b, c, d] = an.show
      const o = smooth(a, b, p) * (1 - smooth(c, d, p))
      v.set(...an.pos).project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const y = (-v.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`
      el.style.opacity = v.z > 1 ? '0' : o.toFixed(3)
    }
  })
  return null
}
