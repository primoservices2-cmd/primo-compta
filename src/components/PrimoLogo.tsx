'use client'

export function PrimoLogo({ size = 'md', showSub = true }: { size?: 'sm' | 'md' | 'lg', showSub?: boolean }) {
  const sizes = {
    sm: { icon: 'w-7 h-7', title: 'text-sm', sub: 'text-' },
    md: { icon: 'w-9 h-9', title: 'text-base', sub: 'text-' },
    lg: { icon: 'w-14 h-14', title: 'text-2xl', sub: 'text-xs' },
  }
  const s = sizes[size]
  return (
    <div className="flex items-center gap-3">
      <img src="/logo.png" alt="PRIMO COMPTA" className={`${s.icon} object-contain rounded-lg bg-white`} />
      <div className="leading-none">
        <div className={`font-black tracking-widest ${s.title}`}>PRIMO COMPTA</div>
        {showSub && <div className={`${s.sub} text-gray-400 tracking-widest font-medium mt-0.5`}>ACCOUNTING MANAGEMENT</div>}
      </div>
    </div>
  )
}