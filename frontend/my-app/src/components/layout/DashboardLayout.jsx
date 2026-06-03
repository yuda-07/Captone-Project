import Sidebar from './Sidebar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardLayout({ children, title, subtitle, headerRight }) {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 md:ml-72 transition-all duration-300">
        {/* Header */}
        <header className="h-20 px-10 flex items-center justify-between bg-surface-container-lowest shadow-sm sticky top-0 z-40">
          <div>
            <h1 className="text-headline-md font-hanken text-primary">
              {title || `Halo, ${user?.name || 'User'}!`}
            </h1>
            {subtitle && (
              <p className="text-on-surface-variant font-inter text-label-md">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerRight}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 max-w-container-max mx-auto">
          {children}
        </div>

        {/* Dashboard Footer */}
        <footer className="w-full border-t border-outline-variant bg-surface-container-highest mt-12">
          <div className="w-full px-10 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-headline-md font-hanken text-primary">MicroCred AI</div>
            <div className="flex gap-6">
              <a href="#" className="text-on-surface-variant font-inter text-body-md hover:text-secondary underline transition-all">Privacy Policy</a>
              <a href="#" className="text-on-surface-variant font-inter text-body-md hover:text-secondary underline transition-all">Terms of Service</a>
              <a href="#" className="text-on-surface-variant font-inter text-body-md hover:text-secondary underline transition-all">Contact Us</a>
            </div>
            <p className="text-on-surface-variant font-inter text-body-md">© 2024 MicroCred AI. Institutional Reliability.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
