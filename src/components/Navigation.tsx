// src/components/Navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/sightings', label: 'Sightings' },
    { href: '/about', label: 'About' }
  ]

  return (
    <nav className="absolute left-4 top-8">
      <ul className="flex space-x-6">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`text-sm transition-colors duration-200 ${
                pathname === href
                  ? 'text-amber-400'
                  : 'text-amber-200/70 hover:text-amber-200'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
