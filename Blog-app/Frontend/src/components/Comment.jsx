import { FiEdit, FiUser, FiClock, FiTrash2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { URL } from "../url";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Comment = ({ c, post, deleteCommentFromState }) => {
  const { user } = useContext(UserContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteComment = async (id) => {
    setIsDeleting(true);
    try {
      await axios.delete(URL + "/api/comments/" + id, { withCredentials: true });
      deleteCommentFromState(id);
    } catch (err) {
      console.log(err);
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteComment(c._id);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl p-4 mb-3 hover:shadow-md hover:border-gray-200 transition-all duration-200 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            <FiUser size={14} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">@{c.author}</h4>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <FiClock size={10} />
              <span>{formatDate(c.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {user?._id === c?.userId && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!showConfirm ? (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Delete comment"
              >
                <FiTrash2 size={14} />
              </button>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-2 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors duration-200"
                >
                  {isDeleting ? "..." : "Delete"}
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Content */}
      <div className="pl-11">
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {c.comment}
        </p>
      </div>

      {/* Interaction Bar */}
      <div className="pl-11 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <button className="hover:text-blue-500 transition-colors duration-200">
            Reply
          </button>
          <button className="hover:text-red-500 transition-colors duration-200">
            Report
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default Comment;