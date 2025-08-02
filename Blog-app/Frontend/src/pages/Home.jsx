import axios from "axios";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import { URL } from "../url";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from '../components/Loader';
import { UserContext } from "../context/UserContext";
import { FiTrendingUp, FiBookOpen, FiEdit3, FiUsers, FiStar } from 'react-icons/fi';

const Home = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + search);
      setPosts(res.data);
      if (res.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  // Hero Section Component
  const HeroSection = () => {
    const stats = [
      { icon: FiBookOpen, label: "Posts", value: "1,000+" },
      { icon: FiUsers, label: "Writers", value: "500+" },
      { icon: FiStar, label: "Reviews", value: "5,000+" },
    ];

    return (
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-[200px]">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Share Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Stories
              </span>
              <br />
              Inspire the World
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our community of writers and readers. Discover amazing stories, 
              share your thoughts, and connect with like-minded individuals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <Link
                  to="/write"
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <FiEdit3 />
                  <span>Start Writing</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <FiEdit3 />
                    <span>Start Writing</span>
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 md:space-x-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Search Results Header
  const SearchHeader = () => {
    const searchQuery = new URLSearchParams(search).get('search');
    
    if (!searchQuery) return null;
    
    return (
      <div className="bg-white py-8 px-6 md:px-[200px] border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <FiTrendingUp className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Search results for "{searchQuery}"
          </h2>
        </div>
        <p className="text-gray-600 mt-2">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
        </p>
      </div>
    );
  };

  // Empty State Component
  const EmptyState = () => {
    const searchQuery = new URLSearchParams(search).get('search');
    
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiBookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {searchQuery ? `No posts found for "${searchQuery}"` : 'No posts available'}
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {searchQuery 
            ? "Try adjusting your search terms or browse all posts below."
            : "Be the first to share your story with the community!"
          }
        </p>
        {user && (
          <Link
            to="/write"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <FiEdit3 />
            <span>Write First Post</span>
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section - Only show when not searching and user is not logged in */}
      {!search && !user && <HeroSection />}
      
      {/* Search Results Header */}
      <SearchHeader />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 md:px-[200px] py-8">
          {loader ? (
            <div className="flex justify-center items-center py-24">
              <div className="text-center">
                <Loader />
                <p className="mt-4 text-gray-600">Loading amazing posts...</p>
              </div>
            </div>
          ) : !noResults ? (
            <div className="space-y-8">
              {/* Posts Grid */}
              {posts.map((post) => (
                <Link 
                  key={post._id} 
                  to={user ? `/posts/post/${post._id}` : "/login"}
                  className="block transform hover:scale-[1.02] transition-transform duration-200"
                >
                  <HomePosts post={post} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;