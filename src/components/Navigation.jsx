import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            <span className="logo-text">MEALORA</span>
            <span className="logo-tagline">İyi yaşamın tadı</span>
          </Link>

          <div className={`nav-links ${isOpen ? 'open' : ''}`}>
            <div className="nav-menu-item" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
              <Link to="/menu" className="nav-link">
                Haftanın Menüsü <ChevronDown size={16} />
              </Link>
              {menuOpen && (
                <div className="mega-menu">
                  <div className="mega-menu-content">
                    <div className="mega-menu-section">
                      <h4>Kategoriler</h4>
                      <a href="#high-protein">High Protein</a>
                      <a href="#mediterranean">Akdeniz</a>
                      <a href="#clean-eating">Clean Eating</a>
                      <a href="#low-cal">Low-Cal</a>
                    </div>
                    <div className="mega-menu-section">
                      <h4>Öğünler</h4>
                      <a href="#breakfast">Kahvaltı</a>
                      <a href="#lunch">Öğle Yemeği</a>
                      <a href="#dinner">Akşam Yemeği</a>
                      <a href="#snacks">Atıştırmalıklar</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/packages" className="nav-link">Paketler</Link>
            <Link to="/about" className="nav-link">Tanışalım</Link>
            <Link to="/faq" className="nav-link">SSS</Link>
            <Link to="/corporate" className="nav-link">Kurumsal</Link>
            <Link to="/contact" className="nav-link">İletişim</Link>
            
            <div className="nav-divider"></div>
            
            <Link to="/style-guide" className="nav-link nav-link-secondary">Style Guide</Link>
            <Link to="/components" className="nav-link nav-link-secondary">Components</Link>
          </div>

          <div className="nav-actions">
            <button className="btn btn-secondary">Giriş Yap</button>
            <button className="btn btn-primary">Paketini Seç</button>
          </div>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
