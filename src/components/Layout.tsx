import { NavLink, Link } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/universities', label: 'Universities' },
  { to: '/comparison', label: 'Comparison' },
  { to: '/admin', label: 'Admin' },
]

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Squares2X2Icon className="h-6 w-6 text-primary-600" />
            <span>KZ University DataHub</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition hover:text-primary-600 ${
                    isActive ? 'text-primary-600' : 'text-slate-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Kazakhstan University DataHub. Built with
        React, Firebase, and Tailwind.
      </footer>
    </div>
  )
}

export default Layout

