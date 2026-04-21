import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-medium tracking-tight">
          <span className="font-editorial">flav</span>
        </span>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-xs text-warm-gray transition-colors duration-300 hover:text-foreground hidden sm:inline">
            Features
          </a>
          <Link to="/docs" className="text-xs text-warm-gray transition-colors duration-300 hover:text-foreground hidden sm:inline">
            Docs
          </Link>
          <a
            href="https://github.com/isakfiks/flav/releases/download/v1.0.0/flav-v1.0.0-windows-x86_64-setup.exe"
            className="text-xs text-warm-gray transition-colors duration-300 hover:text-foreground hidden sm:inline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
          <a
            href="https://github.com/isakfiks/flav"
            target="_blank"
            rel="noopener noreferrer"
            className="text-warm-gray transition-colors duration-300 hover:text-foreground"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
