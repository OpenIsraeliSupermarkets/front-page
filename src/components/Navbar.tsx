import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay - lowest z-index */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation - middle z-index */}
      <nav
        className={`bg-white shadow-lg fixed right-0 top-0 h-full w-48 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* User Info Section */}
        <div className="py-4 px-6 border-b">
          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>

        {/* Navigation Links */}
        <div className="py-4">
          <div className="flex flex-col">
            <Link
              to="/"
              className={`px-6 py-3 text-sm font-medium border-r-4 ${
                isActive("/")
                  ? "text-blue-600 border-blue-600 bg-blue-50"
                  : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/documentation"
              className={`px-6 py-3 text-sm font-medium border-r-4 ${
                isActive("/documentation")
                  ? "text-blue-600 border-blue-600 bg-blue-50"
                  : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
              }`}
            >
              Documentation
            </Link>
          </div>
        </div>

        {/* API Token Section */}
        <div className="border-t py-4 px-6">
          <div className="text-xs font-medium text-gray-500 mb-2">
            API Access
          </div>
          <Link
            to="/api-tokens"
            className={`block px-6 py-3 -mx-6 text-sm font-medium border-r-4 ${
              isActive("/api-tokens")
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
            }`}
          >
            API Tokens
          </Link>
        </div>
      </nav>

      {/* Button - highest z-index */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-[60] p-2 rounded-md bg-white hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </>
  );
};

export default Navbar;
