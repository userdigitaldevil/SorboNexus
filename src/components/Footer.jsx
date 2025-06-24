import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#101114] border-t border-gray-800/60 text-gray-400 py-3 px-2">
      <div className="max-w-7xl mx-auto flex flex-col gap-1">
        {/* Main Footer Row */}
        <div className="flex items-center justify-between text-xs md:text-sm gap-2 flex-wrap">
          {/* Left: Slogan */}
          <span className="font-medium text-gray-300 tracking-wide whitespace-nowrap">
            Connecter · Inspirer · Évoluer
          </span>

          {/* Center: Quick Links */}
          <nav className="flex gap-3 md:gap-5">
            <Link to="/" className="hover:text-blue-300 transition-colors">
              Accueil
            </Link>
            <Link
              to="/ressources"
              className="hover:text-blue-300 transition-colors"
            >
              Ressources
            </Link>
            <Link
              to="/alumnis"
              className="hover:text-blue-300 transition-colors"
            >
              Alumnis
            </Link>
            <Link
              to="/conseils"
              className="hover:text-blue-300 transition-colors"
            >
              Conseils
            </Link>
            <a
              href="mailto:sethaguila@icloud.com"
              className="hover:text-blue-300 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right: Contact */}
          <a
            href="mailto:sethaguila@icloud.com"
            className="text-blue-300 hover:text-blue-200 transition-colors font-normal whitespace-nowrap"
          >
            sethaguila@icloud.com
          </a>
        </div>
        {/* Copyright */}
        <div className="text-center pt-1">
          <span className="text-[10px] text-gray-500 font-light">
            © {new Date().getFullYear()} SorboNexus. Tous droits réservés.
          </span>
        </div>
      </div>
    </footer>
  );
}
