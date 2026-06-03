import { Menu, Bell, RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

interface NavbarProps {
  onMenuClick: () => void
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/incidents': 'Incidents',
  '/incidents/create': 'Create Incident',
  '/analysis': 'AI Analysis',
  '/monitoring': 'Monitoring',
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/incidents/') && pathname !== '/incidents/create')
    return 'Incident Details'
  return 'IncidentHub'
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const queryClient = useQueryClient()
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  const handleRefresh = () => {
    queryClient.invalidateQueries()
    toast.success('Data refreshed', { duration: 1500 })
  }

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/8 bg-navy-800/50 backdrop-blur-sm shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-100">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Status badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Operational
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          title="Refresh all data"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:rotate-180"
          style={{ transition: 'color 150ms, background 150ms, transform 400ms' }}
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications (future) */}
        <button
          title="Notifications (coming soon)"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
          SRE
        </div>
      </div>
    </header>
  )
}
