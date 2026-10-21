'use client'

export function PrimoLogo({ size = 'md', showSub = true }: { size?: 'sm' | 'md' | 'lg', showSub?: boolean }) {
  const sizes = {
    sm: { icon: 'w-7 h-7 text-sm', title: 'text-sm', sub: 'text-[8px]' },
    md: { icon: 'w-9 h-9 text-base', title: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14 text-xl', title: 'text-2xl', sub: 'text-xs' },
  }
  const s = sizes[size]
  return (
    <div className="flex items-center gap-3">
      <div className={`${s.icon} bg-black text-white flex items-center justify-center font-black rounded-lg`}>P</div>
      <div className="leading-none">
        <div className={`font-black tracking-widest ${s.title}`}>PRIMO COMPTA</div>
        {showSub && <div className={`${s.sub} text-gray-400 tracking-widest font-medium mt-0.5`}>ACCOUNTING MANAGEMENT</div>}
      </div>
    </div>
  )
}
