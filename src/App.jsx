import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StyleGuidePage from './pages/StyleGuidePage';
import ComponentsPage from './pages/ComponentsPage';
import WeeklyMenuPage from './pages/WeeklyMenuPage';
import PackagesPage from './pages/PackagesPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import CorporatePage from './pages/CorporatePage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <div className="app">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/style-guide" element={<StyleGuidePage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/menu" element={<WeeklyMenuPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/corporate" element={<CorporatePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
