import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardLayout({ children, title, subtitle, headerRight }) {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 md:ml-72 transition-all duration-300 w-full max-w-full">
        {/* Header */}
        <header className="h-20 px-4 md:px-10 flex items-center justify-between bg-surface-container-lowest shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-on-surface-variant hover:text-primary focus:outline-none flex items-center justify-center"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <div className="flex flex-col justify-center">
              <h1 className="text-title-lg md:text-headline-md font-hanken text-primary leading-tight truncate max-w-[130px] sm:max-w-xs md:max-w-full">
                {title || `Halo, ${user?.name?.split(' ')[0] || 'User'}!`}
              </h1>
              {subtitle && (
                <p className="text-on-surface-variant font-inter text-label-sm md:text-label-md hidden sm:block">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerRight}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-10 max-w-container-max mx-auto">
          {children}
        </div>

        {/* Dashboard Footer */}
        <footer className="w-full border-t border-outline-variant bg-surface-container-highest mt-12">
          <div className="w-full px-4 md:px-10 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-headline-md font-hanken text-primary">MicroCred AI</div>
            <p className="text-on-surface-variant font-inter text-label-md md:text-body-md text-center">© 2026 Capstone Team CC26-PSU354</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
