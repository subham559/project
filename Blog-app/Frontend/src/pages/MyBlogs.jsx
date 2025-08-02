import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL, IF } from "../url";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiCalendar, FiTag, FiSearch, FiFilter, FiGrid, FiList } from "react-icons/fi";

const MyBlogs = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useContext(UserContext);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id);
      setPosts(res.data);
      setFilteredPosts(res.data);
      setNoResults(res.data.length === 0);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPosts();
    }
  }, [user]);

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post =>
        post.categories?.includes(selectedCategory)
      );
    }

    // Sort posts
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, sortBy, selectedCategory]);

  // Get unique categories
  const categories = [...new Set(posts.flatMap(post => post.categories || []))];

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={IF + post.photo}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Link
            to={`/edit/${post._id}`}
            className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white hover:scale-110 transition-all duration-200"
            title="Edit post"
          >
            <FiEdit size={16} />
          </Link>
          <button
            className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white hover:scale-110 transition-all duration-200"
            title="Delete post"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiCalendar size={14} />
            <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <FiEye size={14} />
            <span>0</span>
          </div>
        </div>

        <Link to={`/posts/post/${post._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.desc.substring(0, 150)}...
        </p>

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
              >
                <FiTag size={10} className="mr-1" />
                {category}
              </span>
            ))}
            {post.categories.length > 3 && (
              <span className="text-xs text-gray-500">+{post.categories.length - 3} more</span>
            )}
          </div>
        )}

        <Link
          to={`/posts/post/${post._id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-200"
        >
          Read more
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );

  const PostListItem = ({ post }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="flex">
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={IF + post.photo}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FiCalendar size={14} />
                <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiEye size={14} />
                <span>0 views</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/edit/${post._id}`}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <FiEdit size={16} />
              </Link>
              <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>

          <Link to={`/posts/post/${post._id}`}>
            <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-3 line-clamp-2">
            {post.desc.substring(0, 200)}...
          </p>

          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.slice(0, 4).map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  <FiTag size={10} className="mr-1" />
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Blog Posts</h1>
              <p className="text-gray-600">
                Manage and organize your published articles ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'})
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/write"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="mr-2" size={20} />
                Create New Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Posts Content */}
        {loader ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : !noResults ? (
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-6"
          }`}>
            {filteredPosts.map((post) => (
              viewMode === "grid" ? (
                <PostCard key={post._id} post={post} />
              ) : (
                <PostListItem key={post._id} post={post} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiEdit className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedCategory !== "all" ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start sharing your ideas with the world by creating your first blog post"
                }
              </p>
              {(!searchTerm && selectedCategory === "all") && (
                <Link
                  to="/write"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  <FiPlus className="mr-2" size={20} />
                  Write Your First Post
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!loader && !noResults && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {filteredPosts.length} of {posts.length} posts
              {searchTerm && (
                <span className="ml-2">
                  for "<span className="font-medium text-gray-900">{searchTerm}</span>"
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="ml-2">
                  in <span className="font-medium text-gray-900">{selectedCategory}</span>
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBlogs;