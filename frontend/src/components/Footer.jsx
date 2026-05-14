import { NavLink } from 'react-router-dom'
import { BookOpen, Github, Linkedin, Twitter, Heart } from 'lucide-react'

const quickLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/progress', label: 'Progress' },
  { to: '/profile', label: 'Profile' },
]

const socialLinks = [
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
]

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <NavLink to="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[hsl(263,70%,58%)] shadow-md shadow-[var(--primary)]/25">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Smart</span>
                <span className="text-[var(--foreground)]">StudyHub</span>
              </span>
            </NavLink>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              Your curated learning platform for mastering programming and technology skills. Learn smart, not hard.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
              Connect With Us
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--secondary)] text-[var(--muted-foreground)] transition-all duration-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] hover:shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} SmartStudyHub. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
            Made with <Heart className="h-3.5 w-3.5 text-red-500" fill="currentColor" /> for learners
          </p>
        </div>
      </div>
    </footer>
  )
}
