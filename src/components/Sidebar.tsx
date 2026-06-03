import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  AlertTriangle,
  PlusCircle,
  Brain,
  Activity,
  Zap,
  X,
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/incidents', icon: AlertTriangle, label: 'Incidents', exact: false },
  { to: '/incidents/create', icon: PlusCircle, label: 'Create Incident', exact: true },
  { to: '/analysis', icon: Brain, label: 'AI Analysis', exact: true },
  { to: '/monitoring', icon: Activity, label: 'Monitoring', exact: true },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to)
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-navy-800/95 backdrop-blur-md border-r border-white/8
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="text-base font-bold text-gradient">IncidentHub</span>
              <p className="text-xs text-slate-500 -mt-0.5">SRE Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${active
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/25 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/6'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon
                  className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                    active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                  size={18}
                />
                {item.label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/8 shrink-0">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="text-xs text-slate-400">API Connected</span>
          </div>
          <p className="mt-1 px-2 text-[10px] text-slate-600 font-mono truncate">
            {import.meta.env.VITE_API_URL ?? 'localhost:8080'}
          </p>
        </div>
      </aside>
    </>
  )
}
