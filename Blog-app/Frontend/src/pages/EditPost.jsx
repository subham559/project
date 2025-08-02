
import { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ImCross } from "react-icons/im";
import { FiUpload, FiEdit3, FiSave, FiPlus, FiRefreshCw } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { URL, IF } from "../url";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const EditPost = () => {
  const postId = useParams().id;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!desc.trim()) newErrors.desc = "Description is required";
    if (title.length > 100) newErrors.title = "Title must be less than 100 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPost = async () => {
    setIsLoadingPost(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setExistingPhoto(res.data.photo);
      setCats(res.data.categories || []);
      
      if (res.data.photo) {
        setPreviewUrl(IF + res.data.photo);
      }
    } catch (err) {
      console.log(err);
      setErrors({ fetch: "Failed to load post data" });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, file: "File size must be less than 5MB" }));
        return;
      }
      
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: "" }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setExistingPhoto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const post = {
      title: title.trim(),
      desc: desc.trim(),
      username: user.username,
      userId: user._id,
      categories: cats,
    };

    try {
      if (file) {
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("img", filename);
        data.append("file", file);
        post.photo = filename;

        await axios.post(URL + "/api/upload", data);
      } else if (existingPhoto) {
        post.photo = existingPhoto;
      }

      const res = await axios.put(URL + "/api/posts/" + postId, post, {
        withCredentials: true,
      });
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.log(err);
      setErrors({ submit: "Failed to update post. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const addCategory = () => {
    if (cat.trim() && !cats.includes(cat.trim()) && cats.length < 5) {
      setCats(prev => [...prev, cat.trim()]);
      setCat("");
    }
  };

  const deleteCategory = (index) => {
    setCats(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
          <div className="text-center">
            <Loader />
            <p className="mt-4 text-gray-600">Loading post data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <FiEdit3 className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
          <p className="text-gray-600">Update and refine your content</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Title Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Post Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter an engaging title for your post..."
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                maxLength={100}
              />
              <div className="flex justify-between items-center">
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                <p className="text-gray-400 text-sm ml-auto">{title.length}/100</p>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Featured Image
              </label>
              
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all duration-200"
                >
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload a new image</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-lg"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      <ImCross className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                className="hidden"
              />
              {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
            </div>

            {/* Categories Section */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Categories
              </label>
              
              <div className="flex gap-3">
                <input
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Add a category..."
                  type="text"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  disabled={!cat.trim() || cats.length >= 5}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Category Tags */}
              {cats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cats.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-2 rounded-full text-sm border border-amber-200"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => deleteCategory(i)}
                        className="text-amber-600 hover:text-red-500 transition-colors duration-200"
                      >
                        <ImCross className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-gray-400 text-sm">Add up to 5 categories ({cats.length}/5)</p>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Post Content *
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={12}
                className={`w-full px-4 py-3 rounded-lg border-2 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.desc ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Write your post content here..."
              />
              {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              {errors.submit && (
                <p className="text-red-500 text-sm mb-4 text-center">{errors.submit}</p>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    Update Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditPost;

