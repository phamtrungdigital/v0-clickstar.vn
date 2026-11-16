'use client'

/**
 * Nhân vật người cách điệu cho câu chuyện /kham-pha: dựng bằng hình khối (capsule, cầu), có khớp vai, khuỷu, hông, gối,
 * nên làm được dáng ngồi, đi, đứng, đẩy cửa mà không cần tệp mô hình hay tải thêm gì. Mặt trước của nhân vật là +z cục bộ.
 *
 * Quy ước góc (trục x): âm = đưa về phía trước (tay, đùi), dương = về phía sau; thân và đầu dương = cúi về trước;
 * cẳng chân (gối) dương = gập ra sau. Mỗi khung hình tính dáng đích rồi làm mượt, nên đổi dáng không bị giật.
 */
import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

export type Pose = 'sit-stress' | 'walk' | 'stand' | 'push'

export type PersonLook = {
  skin: string
  shirt: string
  pants: string
  hair: string
  hairStyle: 'short' | 'long' | 'bun'
  /** Chiều cao tương đối (1 = khoảng 1,75 đơn vị). */
  height?: number
}

type Joints = {
  pelvisY: number
  torsoX: number
  headX: number
  headY: number
  lArmX: number
  lArmZ: number
  lForeX: number
  rArmX: number
  rArmZ: number
  rForeX: number
  lLegX: number
  lShinX: number
  rLegX: number
  rShinX: number
}

const KEYS = Object.keys({
  pelvisY: 0, torsoX: 0, headX: 0, headY: 0, lArmX: 0, lArmZ: 0, lForeX: 0, rArmX: 0, rArmZ: 0, rForeX: 0, lLegX: 0, lShinX: 0, rLegX: 0, rShinX: 0,
} satisfies Joints) as (keyof Joints)[]

const STAND_Y = 0.92
const SIT_Y = 0.5

/** Dáng đích của từng tư thế. `phase` là pha bước chân (radian), `t` là thời gian giây, `still` tắt chuyển động nhỏ khi giảm chuyển động. */
function target(pose: Pose, phase: number, t: number, still: boolean): Joints {
  const s = (x: number) => (still ? 0 : x)
  const base: Joints = {
    pelvisY: STAND_Y, torsoX: 0, headX: 0, headY: 0,
    lArmX: 0, lArmZ: 0.08, lForeX: -0.1, rArmX: 0, rArmZ: -0.08, rForeX: -0.1,
    lLegX: 0, lShinX: 0, rLegX: 0, rShinX: 0,
  }
  switch (pose) {
    case 'sit-stress': {
      // Ngồi gục về phía bàn, một tay ôm trán, tay kia gõ bàn phím lộn xộn; thỉnh thoảng lắc đầu.
      return {
        ...base,
        pelvisY: SIT_Y,
        torsoX: 0.22 + s(Math.sin(t * 0.8) * 0.03),
        headX: 0.28 + s(Math.sin(t * 0.7) * 0.06),
        headY: s(Math.sin(t * 0.9) * 0.25),
        lArmX: -1.05 + s(Math.sin(t * 5.3) * 0.04), lArmZ: 0.1, lForeX: -0.55 + s(Math.sin(t * 6.1) * 0.05),
        rArmX: -2.35, rArmZ: -0.2, rForeX: -2.05,
        lLegX: -1.5, lShinX: 1.5, rLegX: -1.5, rShinX: 1.5,
      }
    }
    case 'walk': {
      const sw = Math.sin(phase)
      const knee = (ph: number) => Math.max(0, Math.sin(ph + 1.25)) * 0.85
      return {
        ...base,
        pelvisY: STAND_Y + Math.abs(Math.cos(phase)) * 0.035,
        torsoX: 0.05,
        headX: 0.02,
        lArmX: sw * 0.5, lForeX: -0.25 - Math.max(0, -sw) * 0.35,
        rArmX: -sw * 0.5, rForeX: -0.25 - Math.max(0, sw) * 0.35,
        lLegX: -sw * 0.55, lShinX: knee(phase + Math.PI),
        rLegX: sw * 0.55, rShinX: knee(phase),
      }
    }
    case 'push': {
      return { ...base, torsoX: 0.1, headX: -0.05, rArmX: -1.35, rArmZ: -0.1, rForeX: -0.15, lArmX: 0.12, lLegX: -0.18, rLegX: 0.1, rShinX: 0.2 }
    }
    case 'stand':
    default:
      return { ...base, torsoX: s(Math.sin(t * 1.1) * 0.015), headY: s(Math.sin(t * 0.5) * 0.12), lArmX: s(Math.sin(t * 1.1) * 0.03), rArmX: s(-Math.sin(t * 1.1) * 0.03) }
  }
}

/** Điều khiển nhân vật mỗi khung hình (ref, không qua state): tư thế và pha bước chân. */
export type PersonControl = { pose: Pose; phase: number }

export function Person({
  look,
  control,
  still = false,
  speed = 7,
}: {
  look: PersonLook
  /** Cha ghi tư thế và pha bước chân vào đây (pha tính theo quãng đường đã đi để chân khớp với bước). */
  control: MutableRefObject<PersonControl>
  still?: boolean
  /** Độ nhanh đổi dáng (lớn = đổi nhanh). */
  speed?: number
}) {
  const root = useRef<Group>(null)
  const pelvis = useRef<Group>(null)
  const torso = useRef<Group>(null)
  const head = useRef<Group>(null)
  const lArm = useRef<Group>(null)
  const lFore = useRef<Group>(null)
  const rArm = useRef<Group>(null)
  const rFore = useRef<Group>(null)
  const lLeg = useRef<Group>(null)
  const lShin = useRef<Group>(null)
  const rLeg = useRef<Group>(null)
  const rShin = useRef<Group>(null)
  const cur = useMemo<Joints>(() => target('stand', 0, 0, true), [])
  const h = look.height ?? 1

  useFrame((s, dt) => {
    const { pose, phase } = control.current
    const goal = target(pose, phase, s.clock.elapsedTime, still)
    // Bước chân phải bám sát pha (làm mượt nhẹ); các dáng còn lại làm mượt hơn để chuyển tư thế không giật.
    const k = pose === 'walk' ? 1 - Math.exp(-dt * 30) : 1 - Math.exp(-dt * speed)
    for (const key of KEYS) cur[key] += (goal[key] - cur[key]) * k
    const set = (g: Group | null, x: number, y = 0, z = 0) => g && g.rotation.set(x, y, z)
    if (pelvis.current) pelvis.current.position.y = cur.pelvisY
    set(torso.current, cur.torsoX)
    set(head.current, cur.headX, cur.headY)
    set(lArm.current, cur.lArmX, 0, cur.lArmZ)
    set(lFore.current, cur.lForeX)
    set(rArm.current, cur.rArmX, 0, cur.rArmZ)
    set(rFore.current, cur.rForeX)
    set(lLeg.current, cur.lLegX)
    set(lShin.current, cur.lShinX)
    set(rLeg.current, cur.rLegX)
    set(rShin.current, cur.rShinX)
  })

  const skin = look.skin
  const mat = (c: string) => <meshStandardMaterial color={c} flatShading roughness={0.85} />

  const arm = (side: 1 | -1, armRef: React.RefObject<Group | null>, foreRef: React.RefObject<Group | null>) => (
    <group ref={armRef} position={[side * 0.23, 0.5, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.058, 0.2, 4, 10]} />
        {mat(look.shirt)}
      </mesh>
      <group ref={foreRef} position={[0, -0.32, 0]}>
        <mesh position={[0, -0.14, 0]}>
          <capsuleGeometry args={[0.048, 0.2, 4, 10]} />
          {mat(skin)}
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.058, 10, 10]} />
          {mat(skin)}
        </mesh>
      </group>
    </group>
  )

  const leg = (side: 1 | -1, legRef: React.RefObject<Group | null>, shinRef: React.RefObject<Group | null>) => (
    <group ref={legRef} position={[side * 0.1, -0.06, 0]}>
      <mesh position={[0, -0.21, 0]}>
        <capsuleGeometry args={[0.082, 0.28, 4, 10]} />
        {mat(look.pants)}
      </mesh>
      <group ref={shinRef} position={[0, -0.43, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.066, 0.28, 4, 10]} />
          {mat(look.pants)}
        </mesh>
        <mesh position={[0, -0.43, 0.055]}>
          <boxGeometry args={[0.11, 0.07, 0.24]} />
          {mat('#1b2438')}
        </mesh>
      </group>
    </group>
  )

  return (
    <group ref={root} scale={h}>
      <group ref={pelvis} position={[0, STAND_Y, 0]}>
        <mesh>
          <boxGeometry args={[0.34, 0.18, 0.2]} />
          {mat(look.pants)}
        </mesh>
        <group ref={torso} position={[0, 0.08, 0]}>
          <mesh position={[0, 0.27, 0]}>
            <capsuleGeometry args={[0.165, 0.3, 4, 12]} />
            {mat(look.shirt)}
          </mesh>
          {arm(1, rArm, rFore)}
          {arm(-1, lArm, lFore)}
          <group ref={head} position={[0, 0.6, 0]}>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.05, 0.06, 0.1, 10]} />
              {mat(skin)}
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.15, 16, 14]} />
              {mat(skin)}
            </mesh>
            {/* Tóc */}
            {look.hairStyle === 'short' && (
              <mesh position={[0, 0.25, -0.015]} scale={[1, 0.82, 1.02]}>
                <sphereGeometry args={[0.158, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                {mat(look.hair)}
              </mesh>
            )}
            {look.hairStyle === 'long' && (
              <>
                <mesh position={[0, 0.25, -0.02]} scale={[1, 0.85, 1.03]}>
                  <sphereGeometry args={[0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
                  {mat(look.hair)}
                </mesh>
                <mesh position={[0, 0.07, -0.1]}>
                  <capsuleGeometry args={[0.11, 0.2, 4, 10]} />
                  {mat(look.hair)}
                </mesh>
              </>
            )}
            {look.hairStyle === 'bun' && (
              <>
                <mesh position={[0, 0.25, -0.015]} scale={[1, 0.82, 1.02]}>
                  <sphereGeometry args={[0.158, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                  {mat(look.hair)}
                </mesh>
                <mesh position={[0, 0.36, -0.08]}>
                  <sphereGeometry args={[0.07, 10, 10]} />
                  {mat(look.hair)}
                </mesh>
              </>
            )}
            {/* Mắt: hai chấm nhỏ cho có hướng nhìn */}
            {[-1, 1].map((sx) => (
              <mesh key={sx} position={[sx * 0.055, 0.21, 0.138]}>
                <sphereGeometry args={[0.016, 8, 8]} />
                <meshBasicMaterial color="#16203a" />
              </mesh>
            ))}
          </group>
        </group>
        {leg(1, rLeg, rShin)}
        {leg(-1, lLeg, lShin)}
      </group>
    </group>
  )
}
