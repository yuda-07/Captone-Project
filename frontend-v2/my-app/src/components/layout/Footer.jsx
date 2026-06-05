export default function Footer({ className = '' }) {
  return (
    <footer className={`w-full border-t border-outline-variant bg-surface-container-highest ${className}`}>
      <div className="w-full px-10 py-12 flex justify-center items-center max-w-container-max mx-auto">
        <div className="text-center">
          <div className="text-headline-md font-hanken font-bold text-primary mb-2">MicroCred AI</div>
          <p className="font-inter text-body-md text-on-surface-variant">
            © 2026 Capstone Team CC26-PSU354
          </p>
        </div>
      </div>
    </footer>
  )
}
