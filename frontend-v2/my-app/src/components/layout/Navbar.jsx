import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 bg-surface-container-lowest shadow-sm z-50">
      <div className="flex justify-between items-center px-5 md:px-10 w-full max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-on-surface-variant hover:text-primary focus:outline-none flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          <Link to="/" className="text-headline-md font-hanken font-extrabold text-primary">
            MicroCred AI
          </Link>
        </div>

        <div className="hidden md:flex gap-6 items-center">
          <a
            href="#"
            className={`font-inter text-body-md transition-colors duration-200 ${
              isHome
                ? 'text-secondary font-bold border-b-2 border-secondary pb-1'
                : 'text-on-surface-variant font-medium hover:text-secondary'
            }`}
          >
            Home
          </a>
          <a
            href="#features"
            className="text-on-surface-variant font-medium font-inter text-body-md hover:text-secondary transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-on-surface-variant font-medium font-inter text-body-md hover:text-secondary transition-colors duration-200"
          >
            About
          </a>
        </div>

        <div className="flex gap-2 items-center">
          <Link
            to="/login"
            className="hidden sm:inline-block px-4 md:px-6 py-2 rounded-lg font-inter text-label-md text-on-surface-variant font-medium hover:text-secondary transition-all"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 md:px-6 py-2 rounded-lg bg-primary text-on-primary font-inter text-label-md font-bold hover:scale-95 transition-transform"
          >
            Mulai
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/30 px-5 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-16">
          <a
            href="#"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-inter text-body-md block ${
              isHome ? 'text-secondary font-bold' : 'text-on-surface-variant'
            }`}
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-on-surface-variant font-inter text-body-md block"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-on-surface-variant font-inter text-body-md block"
          >
            About
          </a>
          <div className="border-t border-outline-variant/20 my-1 sm:hidden"></div>
          <Link
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-inter text-body-md text-on-surface-variant sm:hidden flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">login</span> Login
          </Link>
        </div>
      )}
    </nav>
  )
}
