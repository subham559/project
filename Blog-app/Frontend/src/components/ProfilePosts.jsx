import { useState } from 'react';
import { IF } from '../url';
import { FiCalendar, FiClock, FiEye, FiHeart, FiShare2, FiBookmark } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProfilePosts = ({ p }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Calculate reading time (assuming average reading speed of 200 words per minute)
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text?.split(' ').length || 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: p.title,
        text: p.desc?.slice(0, 100) + '...',
        url: window.location.origin + `/posts/post/${p._id}`
      });
    }
  };

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
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Link to={`/posts/post/${p._id}`} className="block">
      <article
        className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 mb-8 ${
          isHovered ? 'ring-2 ring-blue-500/20' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-64 md:h-72">
          <img
            src={IF + p.photo}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 ${
                isBookmarked 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FiBookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
          </div>

          {/* Reading Time Badge */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white">
              <FiClock className="w-3 h-3 mr-1" />
              {calculateReadingTime(p.desc)} min read
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-8">
          {/* Categories */}
          {p.categories && p.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {p.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 hover:border-blue-300 transition-colors duration-200"
                >
                  {category}
                </span>
              ))}
              {p.categories.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{p.categories.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {p.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3 leading-relaxed">
            {p.desc?.slice(0, 150)}
            {p.desc?.length > 150 && (
              <span className="text-blue-600 font-medium ml-1 group-hover:text-blue-700">
                ...read more
              </span>
            )}
          </p>

          {/* Author and Meta Information */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {p.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">@{p.username}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {formatDate(p.updatedAt)}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="w-3 h-3 mr-1" />
                    {formatTime(p.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isLiked
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 hover:scale-110">
                <FiEye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-300 pointer-events-none" />
      </article>
    </Link>
  );
};

export default ProfilePosts;