
import { useContext, useState, useRef, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import { Link, useNavigate } from "react-router-dom"
import { FiUser, FiEdit3, FiBookOpen, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi"

const Menu = ({ onClose }) => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLogout = async () => {
    try {
      setIsAnimating(true)
      const res = await axios.get(URL + "/api/auth/logout", { withCredentials: true })
      setUser(null)
      onClose()
      navigate("/login")
    } catch (err) {
      console.log(err)
    } finally {
      setIsAnimating(false)
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const menuItems = user ? [
    {
      icon: <FiUser className="w-4 h-4" />,
      label: "Profile",
      path: `/profile/${user._id}`,
      color: "text-blue-600"
    },
    {
      icon: <FiEdit3 className="w-4 h-4" />,
      label: "Write",
      path: "/write",
      color: "text-green-600"
    },
    {
      icon: <FiBookOpen className="w-4 h-4" />,
      label: "My Blogs",
      path: `/myblogs/${user._id}`,
      color: "text-purple-600"
    },
    {
      icon: <FiLogOut className="w-4 h-4" />,
      label: "Logout",
      action: handleLogout,
      color: "text-red-600"
    }
  ] : [
    {
      icon: <FiLogIn className="w-4 h-4" />,
      label: "Login",
      path: "/login",
      color: "text-blue-600"
    },
    {
      icon: <FiUserPlus className="w-4 h-4" />,
      label: "Register",
      path: "/register",
      color: "text-green-600"
    }
  ]

  const handleItemClick = (item) => {
    if (item.action) {
      item.action()
    } else {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div 
        ref={menuRef}
        className="absolute top-14 right-6 md:right-32 z-50 animate-slideDown"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[220px]">
          {/* Header */}
          {user && (
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Welcome back!</p>
                  <p className="text-gray-600 text-xs">@{user.username}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.path ? (
                  <Link 
                    to={item.path}
                    onClick={() => handleItemClick(item)}
                    className="group flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:text-gray-900"
                  >
                    <span className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleItemClick(item)}
                    disabled={isAnimating}
                    className="group w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:text-gray-900 disabled:opacity-50"
                  >
                    <span className={`${item.color} group-hover:scale-110 transition-transform duration-200 ${isAnimating ? 'animate-spin' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">
                      {isAnimating && item.label === 'Logout' ? 'Logging out...' : item.label}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Blog MITS © 2024
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Menu
