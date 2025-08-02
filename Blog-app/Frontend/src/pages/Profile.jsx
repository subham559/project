import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfilePosts from "../components/ProfilePosts";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiUser, FiMail, FiEdit3, FiTrash2, FiSettings, FiBookOpen } from "react-icons/fi";
import { MdVerified, MdTrendingUp } from "react-icons/md";

const Profile = () => {
  const param = useParams().id;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(URL + "/api/users/" + user._id);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserUpdate = async () => {
    setLoading(true);
    setUpdated(false);
    try {
      const res = await axios.put(
        URL + "/api/users/" + user._id,
        { username, email, password },
        { withCredentials: true }
      );
      setUpdated(true);
      setIsEditing(false);
      setTimeout(() => setUpdated(false), 3000);
    } catch (err) {
      console.log(err);
      setUpdated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(URL + "/api/users/" + user._id, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [param]);

  useEffect(() => {
    fetchUserPosts();
  }, [param]);

  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-8 md:px-[200px] py-16">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
              <FiUser className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                {username} <MdVerified className="text-blue-300" />
              </h1>
              <p className="text-blue-100 text-lg">{email}</p>
              <div className="flex items-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FiBookOpen className="text-blue-200" />
                  <span>{posts.length} Posts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MdTrendingUp className="text-blue-200" />
                  <span>{totalViews} Total Views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 md:px-[200px] mt-8 flex md:flex-row flex-col-reverse md:items-start items-start gap-8">
        {/* Posts Section */}
        <div className="flex flex-col md:w-[70%] w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FiBookOpen className="text-blue-600" />
                Your Posts
              </h2>
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
              </div>
            </div>
            
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts?.map((p) => (
                  <div key={p._id} className="transform hover:scale-105 transition-all duration-300">
                    <ProfilePosts p={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiBookOpen className="text-gray-300 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h3>
                <p className="text-gray-500">Start writing your first blog post!</p>
                <button 
                  onClick={() => navigate("/write")}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Settings */}
        <div className="md:sticky md:top-8 md:w-[30%] w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiSettings className="text-gray-600" />
                Profile Settings
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FiEdit3 />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                    isEditing
                      ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      : "border-gray-200 bg-gray-50"
                  } outline-none`}
                  type="text"
                  placeholder="Your username"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                    isEditing
                      ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      : "border-gray-200 bg-gray-50"
                  } outline-none`}
                  type="email"
                  placeholder="Your email"
                />
              </div>

              {isEditing && (
                <div className="flex flex-col space-y-3 pt-4 border-t">
                  <button
                    onClick={handleUserUpdate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {!isEditing && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiTrash2 />
                    Delete Account
                  </button>
                </div>
              )}

              {updated && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Profile updated successfully!
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totalViews}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUserDelete}
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

export default Profile;