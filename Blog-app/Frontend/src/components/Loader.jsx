
import React from 'react'

const Loader = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-10 h-10", 
    large: "w-16 h-16"
  }

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {/* Modern Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-pulse`}></div>
        
        {/* Spinning ring */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin`}></div>
        
        {/* Inner dot */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'small' ? 'w-1 h-1' : size === 'large' ? 'w-3 h-3' : 'w-2 h-2'} bg-blue-500 rounded-full animate-bounce`}></div>
      </div>

      {/* Loading text with animation */}
      <div className={`${textSizeClasses[size]} font-medium text-gray-600 animate-pulse`}>
        {text}
        <span className="inline-flex ml-1">
          <span className="animate-bounce delay-0">.</span>
          <span className="animate-bounce delay-75">.</span>
          <span className="animate-bounce delay-150">.</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

// Alternative skeleton loader for content
export const SkeletonLoader = ({ lines = 3, showImage = false }) => {
  return (
    <div className="animate-pulse p-4 space-y-4">
      {showImage && (
        <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Full page loader overlay
export const PageLoader = ({ message = "Loading your content..." }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <Loader size="large" text={message} />
      </div>
    </div>
  )
}

export default Loader
