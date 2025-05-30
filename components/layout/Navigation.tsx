'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Upload,
  History,
  Settings,
  User,
  Menu,
  X,
  Zap,
  Shield,
  BarChart3,
  Github,
  Star,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
    description: 'Overview and analytics',
  },
  {
    name: 'Submit Code',
    href: '/submit',
    icon: Upload,
    description: 'Upload code for review',
  },
  {
    name: 'Reviews',
    href: '/reviews',
    icon: Code,
    description: 'Browse all reviews',
  },
  {
    name: 'History',
    href: '/history',
    icon: History,
    description: 'Your submission history',
  },
]

const quickActions = [
  {
    name: 'Security Scan',
    href: '/submit?type=security',
    icon: Shield,
    color: 'text-red-400',
    badge: 'Pro',
  },
  {
    name: 'Performance Check',
    href: '/submit?type=performance',
    icon: Zap,
    color: 'text-yellow-400',
    badge: 'New',
  },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications] = useState(3) // Mock notification count
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <Code className="h-8 w-8 text-purple-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold text-white">
                CodeReview<span className="text-purple-500">.ai</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative',
                      isActive(item.href)
                        ? 'text-purple-300 bg-purple-900/20'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-purple-600/10 rounded-md border border-purple-500/20"
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Actions & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="group relative flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <Icon className={cn('h-4 w-4 mr-2', action.color)} />
                    {action.name}
                    {action.badge && (
                      <Badge
                        variant={action.badge === 'Pro' ? 'destructive' : 'default'}
                        className="ml-2 text-xs"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* GitHub Link */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Developer</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800 border-t border-gray-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-purple-300 bg-purple-900/20'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                  </Link>
                )
              })}

              {/* Mobile Quick Actions */}
              <div className="pt-4 border-t border-gray-700">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Actions
                </div>
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className={cn('h-5 w-5 mr-3', action.color)} />
                      <div className="flex-1">{action.name}</div>
                      {action.badge && (
                        <Badge
                          variant={action.badge === 'Pro' ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Mobile User Section */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center px-3 py-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">Developer</div>
                    <div className="text-sm text-gray-400">developer@example.com</div>
                  </div>
                  <div className="ml-auto">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0"
                        >
                          {notifications}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
} 