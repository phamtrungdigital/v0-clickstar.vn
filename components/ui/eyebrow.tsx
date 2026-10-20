import type { ReactNode } from 'react'

/**
 * Nhãn nhỏ đứng trên tiêu đề mỗi khối (trang dịch vụ, bài blog), kiểu hai nửa: số mục ở nửa trái, tên mục ở nửa phải.
 *
 * Số mục tự đánh bằng bộ đếm CSS: phần tử cha (thẻ <main> của trang) phải có `[counter-reset:eyebrow]`, mỗi nhãn
 * có số tăng thêm một theo đúng thứ tự khối trên trang, nên đổi thứ tự khối thì số tự đúng.
 * `numbered={false}` cho nhãn đầu trang (hero) và nhãn ngoài trang dịch vụ: khi đó chỉ còn nửa tên mục.
 * `dark` dành cho khối nền tối. Biểu tượng lucide (h-4 w-4) đặt làm phần tử đầu của children.
 */
export function Eyebrow({
  children,
  dark = false,
  numbered = true,
  className = '',
}: {
  children: ReactNode
  dark?: boolean
  numbered?: boolean
  dot?: boolean
  className?: string
}) {
  const num = dark ? 'bg-[#7db8ff] text-[#0b1b33]' : 'bg-[#1e6dda] text-white'
  const body = dark
    ? 'border-white/20 bg-white/10 text-[#d2d2d7] [&>svg]:text-[#7db8ff]'
    : 'border-[#b9d4f8] bg-[#eaf2fd] text-[#144c97] [&>svg]:text-[#1e6dda]'
  return (
    <span className={`inline-flex items-stretch overflow-hidden rounded-full text-[12px] font-bold uppercase leading-none tracking-[0.06em] ${className}`}>
      {numbered && (
        <b
          aria-hidden="true"
          className={`flex items-center px-3 font-bold tabular-nums [counter-increment:eyebrow] after:content-[counter(eyebrow,decimal-leading-zero)] ${num}`}
        />
      )}
      <span
        className={`inline-flex items-center gap-2 border py-2 pr-4 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0 ${body} ${
          numbered ? 'rounded-r-full border-l-0 pl-3' : 'rounded-full pl-4'
        }`}
      >
        {children}
      </span>
    </span>
  )
}
