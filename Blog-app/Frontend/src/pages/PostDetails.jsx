import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiEdit, FiHeart, FiMessageCircle, FiShare2, FiClock, FiUser } from "react-icons/fi";
import { MdDelete, MdBookmark, MdBookmarkBorder } from "react-icons/md";
import Comment from "../components/Comment";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { URL, IF } from "../url";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setPost(res.data);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(URL + "/api/posts/" + postId, {
        withCredentials: true,
      });
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPostComments = async () => {
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const deleteCommentFromState = (id) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== id)
    );
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      const res = await axios.post(
        URL + "/api/comments/create",
        {
          comment: comment,
          author: user.username,
          postId: postId,
          userId: user._id,
        },
        { withCredentials: true }
      );
      setComments((prevComments) => [...prevComments, res.data]);
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.desc?.slice(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareMenu(false);
      // You could add a toast notification here
    }
  };

  const readingTime = Math.ceil((post.desc?.length || 0) / 200); // Rough estimate: 200 chars per minute

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={IF + post.photo}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                alt={post.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              {/* Action Buttons Overlay */}
              {user?._id === post?.userId && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => navigate("/edit/" + postId)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                  >
                    <FiEdit className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                  >
                    <MdDelete className="text-red-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Content Header */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FiUser className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">@{post.username}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiClock />
                        <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-all ${
                      liked
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <FiHeart className={liked ? "fill-current" : ""} />
                    <span className="text-sm">24</span>
                  </button>
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-full transition-all ${
                      bookmarked
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500"
                    }`}
                  >
                    {bookmarked ? <MdBookmark /> : <MdBookmarkBorder />}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-500 rounded-full transition-all"
                    >
                      <FiShare2 />
                    </button>
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border p-2 z-10">
                        <button
                          onClick={handleShare}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-50 rounded text-sm"
                        >
                          Share Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.desc}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center space-x-2 mb-6">
              <FiMessageCircle className="text-gray-600" />
              <h3 className="text-xl font-bold text-gray-800">
                Comments ({comments.length})
              </h3>
            </div>

            {/* Add Comment */}
            <div className="mb-8">
              <form onSubmit={postComment} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-all"
                    rows="4"
                    placeholder="Share your thoughts..."
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {comment.length}/500
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="transform hover:scale-102 transition-all duration-200"
                  >
                    <Comment
                      c={c}
                      post={post}
                      deleteCommentFromState={deleteCommentFromState}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FiMessageCircle className="text-gray-300 text-6xl mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    No comments yet
                  </h4>
                  <p className="text-gray-500">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PostDetails;