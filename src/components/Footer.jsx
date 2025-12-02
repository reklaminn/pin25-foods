import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <span className="logo-text">MEALORA</span>
              <span className="logo-tagline">İyi yaşamın tadı</span>
            </div>
            <p className="footer-description">
              Sağlıklı beslenmeyi hayatınızın bir parçası haline getirin. 
              Her öğünde kaliteli, taze ve lezzetli yemeklerle tanışın.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Keşfet</h4>
            <Link to="/menu">Haftanın Menüsü</Link>
            <Link to="/packages">Paketler</Link>
            <Link to="/about">Tanışalım</Link>
            <Link to="/corporate">Kurumsal Çözümler</Link>
          </div>

          <div className="footer-column">
            <h4>Destek</h4>
            <Link to="/faq">Sıkça Sorulan Sorular</Link>
            <Link to="/contact">İletişim</Link>
            <a href="#">Teslimat Bölgeleri</a>
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Koşulları</a>
          </div>

          <div className="footer-column">
            <h4>İletişim</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <Phone size={16} />
                <span>+90 555 123 45 67</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>merhaba@mealora.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 MEALORA. Tüm hakları saklıdır.</p>
          <div className="footer-badges">
            <span className="badge">🌱 Organik</span>
            <span className="badge">✓ Güvenli Teslimat</span>
            <span className="badge">💚 Sürdürülebilir</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
