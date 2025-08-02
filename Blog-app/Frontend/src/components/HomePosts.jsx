import { IF } from '../url';
import { FiCalendar, FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

const HomePosts = ({ post }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getReadingTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
  };

  return (
    <article className="group w-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Container */}
        <div className="md:w-[40%] w-full h-64 md:h-80 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse" 
               style={{ display: imageLoaded && !imageError ? 'none' : 'block' }}>
            <div className="flex items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          {post.photo && (
            <img 
              src={`${IF}${post.photo}`}
              alt={post.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="md:w-[60%] w-full p-6 md:p-8 flex flex-col justify-between">
          {/* Header */}
          <div className="flex-grow">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.slice(0, 2).map((category, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                  >
                    {category}
                  </span>
                ))}
                {post.categories.length > 2 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{post.categories.length - 2} more
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
              {post.desc.length > 150 ? `${post.desc.slice(0, 150)}...` : post.desc}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Author and Date Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {post.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-700">@{post.username}</span>
              </div>
              
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <FiCalendar className="w-3 h-3" />
                  <span>{formatDate(post.updatedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiClock className="w-3 h-3" />
                  <span>{getReadingTime(post.desc)} min read</span>
                </div>
              </div>
            </div>

            {/* Read More Button */}
            <div className="flex items-center space-x-2 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200">
              <span>Read more</span>
              <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>

          {/* Mobile Date/Time Info */}
          <div className="sm:hidden flex items-center space-x-3 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <FiCalendar className="w-3 h-3" />
              <span>{formatDate(post.updatedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiClock className="w-3 h-3" />
              <span>{getReadingTime(post.desc)} min read</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HomePosts;
