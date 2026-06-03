import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Overview' },
  { path: '/analysis', icon: 'analytics', label: 'New Analysis' },
  { path: '/history', icon: 'history', label: 'History' },
  { path: '/profile', icon: 'person', label: 'Profile' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-primary-container shadow-lg flex-col py-6 hidden md:flex z-50">
      {/* Logo */}
      <div className="px-6 mb-10">
        <Link to="/dashboard" className="text-headline-md font-hanken text-on-primary font-bold">
          MicroCred AI
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 p-3 transition-all duration-200 ${
                isActive
                  ? 'bg-secondary text-on-secondary rounded-l-full border-l-4 border-secondary-fixed translate-x-1'
                  : 'text-primary-fixed-dim opacity-80 hover:bg-primary/20 hover:opacity-100 rounded-lg'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="font-inter text-label-md">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="mt-auto px-4">
        <div className="bg-primary/30 p-3 rounded-xl mb-6 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-on-primary font-bold truncate text-sm">
              {user?.name || 'MSME Owner'}
            </p>
            <p className="text-on-primary-container text-label-sm">Verified Account</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-primary-fixed-dim flex items-center gap-2 p-3 opacity-80 hover:bg-primary/20 hover:opacity-100 transition-all w-full rounded-lg"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-inter text-label-md">Logout</span>
        </button>
      </div>
    </aside>
  )
}
