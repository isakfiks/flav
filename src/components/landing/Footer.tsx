import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-sm text-warm-gray">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-foreground"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
          <Link to="/docs" className="transition-colors duration-300 hover:text-foreground">
            Docs
          </Link>
          <a href="https://github.com/releases" className="transition-colors duration-300 hover:text-foreground" target="_blank" rel="noopener noreferrer">
            Releases
          </a>
        </div>

        <p className="text-xs text-warm-gray/60">
          flav · Built with care
        </p>
      </div>
    </footer>
  );
};

export default Footer;
