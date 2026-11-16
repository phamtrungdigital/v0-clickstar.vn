'use client'

/**
 * Nhân vật bằng ảnh thật (PNG/WebP nền trong suốt) dựng đứng như tấm bìa trong cảnh 3D (hướng B, anh chốt 16/11/2026).
 * Cha ghi vị trí, độ đục và độ nhún vào `state` mỗi khung hình (ref, không qua state của React); tấm bìa tự xoay nhẹ
 * về phía máy quay để nhìn nghiêng vẫn đọc được. Có bóng chạm đất mềm dưới chân cho khỏi "dán" lên nền.
 * Vật liệu không bị chiếu sáng (ảnh đã có ánh sáng riêng), chỉ nhân với màu `tint` để hoà vào bối cảnh tối.
 */
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { CanvasTexture, DoubleSide, Group, MeshBasicMaterial, SRGBColorSpace, TextureLoader } from 'three'

export type CutoutState = {
  /** Vị trí chân (giữa, chạm đất) trong hệ của cha. */
  x: number
  y: number
  z: number
  opacity: number
  /** Độ nhún dọc (đơn vị thế giới), để dáng đi sống động dù chỉ có một ảnh. */
  bob: number
  /** Nghiêng nhẹ (radian). */
  tilt: number
}

export const newCutoutState = (): CutoutState => ({ x: 0, y: 0, z: 0, opacity: 1, bob: 0, tilt: 0 })

let shadowTex: CanvasTexture | null = null
function getShadowTexture() {
  if (shadowTex) return shadowTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(0,0,0,0.55)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  shadowTex = new CanvasTexture(c)
  return shadowTex
}

function CutoutInner({
  url,
  height,
  aspect,
  groundOffset = 0,
  anchorX = 0,
  tint = '#ffffff',
  state,
  shadow = 0.8,
  follow = 0.5,
}: {
  url: string
  /** Chiều cao cả tấm ảnh trong thế giới. */
  height: number
  /** Rộng / cao của ảnh. */
  aspect: number
  /** Phần ảnh nằm DƯỚI mặt đất (đơn vị thế giới), ví dụ ảnh có chừa lề dưới chân. */
  groundOffset?: number
  /** Lệch ngang của tâm ảnh so với điểm đặt (đơn vị thế giới). */
  anchorX?: number
  tint?: string
  state: MutableRefObject<CutoutState>
  shadow?: number
  follow?: number
}) {
  const tex = useLoader(TextureLoader, url)
  useMemo(() => {
    tex.colorSpace = SRGBColorSpace
    tex.anisotropy = 4
    tex.needsUpdate = true
  }, [tex])

  const group = useRef<Group>(null)
  const mat = useRef<MeshBasicMaterial>(null)
  const shadowMat = useRef<MeshBasicMaterial>(null)
  const shadowTexture = useMemo(() => (typeof document === 'undefined' ? null : getShadowTexture()), [])
  const w = height * aspect

  useEffect(() => () => void tex.dispose(), [tex])

  useFrame(({ camera }) => {
    const g = group.current
    if (!g) return
    const s = state.current
    g.visible = s.opacity > 0.002
    g.position.set(s.x, s.y + s.bob, s.z)
    // Xoay quanh trục đứng về phía máy quay một phần, để nhìn lệch vẫn thấy rõ người.
    const yaw = Math.atan2(camera.position.x - (g.parent ? g.parent.position.x : 0) - s.x, camera.position.z - s.z)
    g.rotation.set(0, Math.max(-0.55, Math.min(0.55, yaw * follow)), s.tilt)
    if (mat.current) mat.current.opacity = s.opacity
    if (shadowMat.current) shadowMat.current.opacity = s.opacity * shadow
  })

  return (
    <group ref={group}>
      <mesh position={[anchorX, height / 2 - groundOffset, 0]}>
        <planeGeometry args={[w, height]} />
        <meshBasicMaterial ref={mat} map={tex} color={tint} transparent alphaTest={0.02} side={DoubleSide} toneMapped={false} />
      </mesh>
      {shadowTexture && (
        <mesh position={[anchorX, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w * 0.9, w * 0.34]} />
          <meshBasicMaterial ref={shadowMat} map={shadowTexture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

/** Tải ảnh riêng từng nhân vật: ảnh chưa về thì chỉ riêng nhân vật đó chưa hiện, phần còn lại của cảnh vẫn dựng. */
export function Cutout(props: React.ComponentProps<typeof CutoutInner>) {
  return (
    <Suspense fallback={null}>
      <CutoutInner {...props} />
    </Suspense>
  )
}
