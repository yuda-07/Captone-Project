import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Overview' },
  { path: '/analysis', icon: 'analytics', label: 'New Analysis' },
  { path: '/history', icon: 'history', label: 'History' },
  { path: '/profile', icon: 'person', label: 'Profile' },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-primary-container shadow-lg flex-col py-6 z-50 transition-transform duration-300 md:translate-x-0 flex ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-6 mb-10 flex justify-between items-center">
          <Link to="/dashboard" onClick={onClose} className="text-headline-md font-hanken text-on-primary font-bold">
            MicroCred AI
          </Link>
          <button onClick={onClose} className="md:hidden text-on-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
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
    </>
  )
}
