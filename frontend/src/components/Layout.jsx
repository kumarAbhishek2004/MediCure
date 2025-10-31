import { Link, useLocation } from 'react-router-dom'
import { Activity, Home, Pill, Leaf, MessageCircle } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/medicine', icon: Pill, label: 'Medicine' },
    { path: '/remedies', icon: Leaf, label: 'Remedies' },
    { path: '/chatbot', icon: MessageCircle, label: 'AI Doctor' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-800">MediCure</span>
            </div>
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
