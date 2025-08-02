import { FiMail, FiGithub, FiTwitter, FiLinkedin, FiFacebook, FiInstagram, FiArrowUp } from "react-icons/fi";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    blog: [
      { name: "Featured Blogs", href: "#" },
      { name: "Most Viewed", href: "#" },
      { name: "Readers Choice", href: "#" },
      { name: "Editor's Pick", href: "#" },
      { name: "Trending Topics", href: "#" }
    ],
    community: [
      { name: "Forum", href: "#" },
      { name: "Support", href: "#" },
      { name: "Recent Posts", href: "#" },
      { name: "Join Community", href: "#" },
      { name: "Guidelines", href: "#" }
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms & Conditions", href: "#" },
      { name: "Terms Of Service", href: "#" },
      { name: "Contact", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: FiTwitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: FiGithub, href: "#", label: "GitHub", color: "hover:text-gray-300" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: FiFacebook, href: "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: FiInstagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
    { icon: FiMail, href: "#", label: "Email", color: "hover:text-green-500" }
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={20} />
        </button>
      )}

    
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
       
        {/* Links Section */}
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Blog MITS
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Empowering minds through knowledge sharing. Join our community of writers and readers passionate about technology, innovation, and learning.
                </p>
                
                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transform hover:scale-110 transition-all duration-200`}
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Blog Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-blue-400">Blog</h4>
                <ul className="space-y-3">
                  {footerLinks.blog.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-purple-400">Community</h4>
                <ul className="space-y-3">
                  {footerLinks.community.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-green-400">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-8 px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2024 Blog MITS. All Rights Reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4 text-xs text-gray-500">
                <span>Made with ❤️ for the community</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Status
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                API
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Docs
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </footer>
    </>
  );
};

export default Footer;