import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png"
const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBFA]/98 backdrop-blur-md border-b border-[#E8DAD1]/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-14 lg:h-[4.25rem]">
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-3 group"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="Chebe Care"
              className="h-16 w-auto object-contain"
            />

            <span className="hidden sm:block">
              <span className="block text-[10px] uppercase tracking-[0.12em] text-[#3A2F2A]/60 group-hover:text-[#3A2F2A]/80 transition-colors">
                By SS
              </span>
              <h1 className="text-xl lg:text-[1.35rem] font-serif font-semibold text-[#3A2F2A] tracking-tight">
                CHEBE CARE
              </h1>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              state={{ scrollTo: "products" }}
              className="text-[11px] uppercase tracking-[0.08em] text-[#3A2F2A]/80 hover:text-[#3A2F2A] transition-colors"
            >
              Produits
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "about" }}
              className="text-[11px] uppercase tracking-[0.08em] text-[#3A2F2A]/80 hover:text-[#3A2F2A] transition-colors"
            >
              Notre histoire
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "ingredients" }}
              className="text-[11px] uppercase tracking-[0.08em] text-[#3A2F2A]/80 hover:text-[#3A2F2A] transition-colors"
            >
              Ingrédients
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "values" }}
              className="text-[11px] uppercase tracking-[0.08em] text-[#3A2F2A]/80 hover:text-[#3A2F2A] transition-colors"
            >
              Pourquoi nous
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "gallery" }}
              className="text-[11px] uppercase tracking-[0.08em] text-[#3A2F2A]/80 hover:text-[#3A2F2A] transition-colors"
            >
              Galerie
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "products" }}
              className="bg-amber-600 text-white px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.08em] hover:bg-amber-500 transition-all duration-200 shadow-sm hover:shadow"
            >
              Boutique
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#3A2F2A] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-[#E8DAD1] space-y-1">
            <Link
              to="/"
              state={{ scrollTo: "products" }}
              className="block py-3 text-sm uppercase tracking-[0.06em] text-[#3A2F2A]/80 hover:text-[#3A2F2A]"
              onClick={closeMenu}
            >
              Produits
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "about" }}
              className="block py-3 text-sm uppercase tracking-[0.06em] text-[#3A2F2A]/80 hover:text-[#3A2F2A]"
              onClick={closeMenu}
            >
              Notre histoire
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "ingredients" }}
              className="block py-3 text-sm uppercase tracking-[0.06em] text-[#3A2F2A]/80 hover:text-[#3A2F2A]"
              onClick={closeMenu}
            >
              Ingrédients
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "values" }}
              className="block py-3 text-sm uppercase tracking-[0.06em] text-[#3A2F2A]/80 hover:text-[#3A2F2A]"
              onClick={closeMenu}
            >
              Pourquoi nous
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "gallery" }}
              className="block py-3 text-sm uppercase tracking-[0.06em] text-[#3A2F2A]/80 hover:text-[#3A2F2A]"
              onClick={closeMenu}
            >
              Galerie
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "products" }}
              className="mt-4 block w-full bg-[#C6A75E] text-white py-3.5 rounded-full text-center text-sm font-medium uppercase tracking-[0.06em] shadow-md"
              onClick={closeMenu}
            >
              Boutique
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
