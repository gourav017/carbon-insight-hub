
import { Link } from "react-router-dom";
import { Leaf, Mail, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Trace Resource</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your sustainability intelligence platform for ESG assessment, emissions tracking, and carbon footprint calculation.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Leaf className="w-4 h-4 text-success" />
              <span>Powered by green hosting</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/esg" className="text-muted-foreground hover:text-primary transition-colors">
                  ESG Assessment
                </Link>
              </li>
              <li>
                <Link to="/carbon-emissions" className="text-muted-foreground hover:text-primary transition-colors">
                  Emissions Calculator
                </Link>
              </li>
              <li>
                <Link to="/carbon-footprint" className="text-muted-foreground hover:text-primary transition-colors">
                  Footprint Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/resources#methodology" className="text-muted-foreground hover:text-primary transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link to="/resources#standards" className="text-muted-foreground hover:text-primary transition-colors">
                  Standards & Frameworks
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <a href="mailto:info@traceresource.com" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@traceresource.com
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Trace Resource. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
