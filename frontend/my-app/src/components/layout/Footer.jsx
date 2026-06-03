import { Link } from 'react-router-dom'

export default function Footer({ className = '' }) {
  return (
    <footer className={`w-full border-t border-outline-variant bg-surface-container-highest ${className}`}>
      <div className="w-full px-10 py-12 flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto gap-6">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="text-headline-md font-hanken font-bold text-primary mb-2">MicroCred AI</div>
          <p className="font-inter text-body-md text-on-surface-variant">
            © 2024 MicroCred AI. Inovasi Finansial Indonesia.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/" className="font-inter text-body-md text-on-surface-variant hover:text-secondary transition-all">
            Home
          </Link>
          <a href="#features" className="font-inter text-body-md text-on-surface-variant hover:text-secondary transition-all">
            Features
          </a>
          <a href="#" className="font-inter text-body-md text-on-surface-variant hover:text-secondary transition-all">
            Privacy
          </a>
          <a href="#" className="font-inter text-body-md text-on-surface-variant hover:text-secondary transition-all">
            Contact
          </a>
        </div>
        <div className="mt-8 md:mt-0 flex gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary cursor-pointer transition-colors">
            <span className="material-symbols-outlined">share</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary cursor-pointer transition-colors">
            <span className="material-symbols-outlined">mail</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
