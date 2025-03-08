import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { AuthDialog } from "@/components/AuthDialog";
import { Github, Linkedin, Mail } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  const { language, setLanguage, direction } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "he" : "en");
  };

  return (
    <>
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />

      {/* Overlay - lowest z-index */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Navigation - middle z-index */}
      <nav
        className={`bg-white shadow-lg fixed ${
          direction === "rtl" ? "right-0" : "left-0"
        } top-0 h-full transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen
            ? "translate-x-0"
            : direction === "rtl"
            ? "translate-x-full"
            : "-translate-x-full"
        } w-[85vw] sm:w-64 md:w-72 lg:w-80 max-w-sm`}
        dir={direction}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className={`absolute ${
            direction === "rtl" ? "left-4" : "right-4"
          } top-4 p-2 rounded-md hover:bg-gray-100`}
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className={`absolute ${
            direction === "rtl" ? "left-16" : "right-16"
          } top-4 p-2 rounded-md hover:bg-gray-100`}
        >
          {language === "en" ? "עב" : "EN"}
        </button>

        {/* User Info Section */}
        <div className="pt-16 px-6 border-b">
          {user ? (
            <>
              <div className="text-sm font-medium text-gray-900 break-words">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-500 break-words mb-2">
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer mb-4"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthDialog(true)}
              className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer mb-4"
            >
              {t("login")}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="py-4">
          <div className="flex flex-col">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-3 text-sm font-medium border-${
                direction === "rtl" ? "l" : "r"
              }-4 ${
                isActive("/")
                  ? "text-blue-600 border-blue-600 bg-blue-50"
                  : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
              }`}
            >
              {t("home")}
            </Link>
            <Link
              to="/documentation"
              onClick={() => setIsOpen(false)}
              className={`px-6 py-3 text-sm font-medium border-${
                direction === "rtl" ? "l" : "r"
              }-4 ${
                isActive("/documentation")
                  ? "text-blue-600 border-blue-600 bg-blue-50"
                  : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
              }`}
            >
              {t("documentation")}
            </Link>
          </div>
        </div>

        {/* API Token Section */}
        <div className="border-t py-4 px-6">
          <div className="text-xs font-medium text-gray-500 mb-2">
            {t("apiAccess")}
          </div>
          <Link
            to="/api-tokens"
            onClick={() => setIsOpen(false)}
            className={`block px-6 py-3 -mx-6 text-sm font-medium border-${
              direction === "rtl" ? "l" : "r"
            }-4 ${
              isActive("/api-tokens")
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
            }`}
          >
            {t("apiTokens")}
          </Link>
          <Link
            to="/playground"
            onClick={() => setIsOpen(false)}
            className={`block px-6 py-3 -mx-6 text-sm font-medium border--${
              direction === "rtl" ? "l" : "r"
            }-4 ${
              isActive("/playground")
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
            }`}
          >
            {t("playground")}
          </Link>
        </div>

        {/* Social Links */}
        <div className="border-t py-4 px-6">
          <div className="text-xs font-medium text-gray-500 mb-2">
            {t("socialLinks")}
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/OpenIsraeliSupermarkets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/open-israeli-supermarkets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
          <div className="mt-4">
            <a
              href="mailto:erlichsefi@gmail.com"
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">erlichsefi@gmail.com</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Button - highest z-index */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${
          direction === "rtl" ? "right-4" : "left-4"
        } top-4 z-[60] p-2 rounded-md bg-white hover:bg-gray-100 shadow-md`}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </>
  );
};

export default Navbar;
