import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className="sticky top-0 bg-surface-container-lowest shadow-sm z-50">
      <div className="flex justify-between items-center px-10 w-full max-w-container-max mx-auto h-16">
        <Link to="/" className="text-headline-md font-hanken font-extrabold text-primary">
          MicroCred AI
        </Link>

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
            className="px-6 py-2 rounded-lg font-inter text-label-md text-on-surface-variant font-medium hover:text-secondary transition-all"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-lg bg-primary text-on-primary font-inter text-label-md font-bold hover:scale-95 transition-transform"
          >
            Mulai
          </Link>
        </div>
      </div>
    </nav>
  )
}
