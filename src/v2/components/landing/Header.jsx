import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t('nav.features'), id: 'features' },
    { label: t('nav.demo'), id: 'demo' },
    { label: t('nav.pricing'), id: 'pricing' },
    { label: t('nav.faq'), id: 'faq' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-black/50 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 group"
                data-testid="header-logo"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#00D2FF]/50 flex items-center justify-center">
                    <span className="font-black text-black text-sm">K</span>
                  </div>
                  <div className="absolute inset-0 w-8 h-8 rounded-lg bg-[#00D2FF] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>
                <span className="font-heading font-bold text-xl text-white tracking-tight">
                  kcaliper<span className="text-[#00D2FF]">.com</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white/70 hover:text-white font-medium text-sm tracking-wide transition-colors relative group"
                  whileHover={{ y: -2 }}
                  data-testid={`nav-${link.id}`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D2FF] group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
              
              {/* Nosotros link */}
              <Link
                to="/nosotros"
                className="text-white/70 hover:text-white font-medium text-sm tracking-wide transition-colors"
                data-testid="nav-nosotros"
              >
                {language === 'es' ? 'Nosotros' : 'About Us'}
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Para Coaches Link - Desktop */}
              <Link
                to="/coaches"
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all text-sm font-semibold"
                data-testid="nav-coaches-link"
              >
                <span>{language === 'es' ? 'Para Coaches' : 'For Coaches'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 hover:border-[#00D2FF] text-white/70 hover:text-[#00D2FF] transition-all text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="language-toggle"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </motion.button>

              {/* CTA Button - Desktop */}
              <motion.button
                onClick={() => scrollToSection('waitlist')}
                className="hidden lg:flex items-center gap-2 bg-[#00D2FF] text-black font-bold px-5 py-2.5 rounded-full hover:bg-[#33DBFF] hover:shadow-[0_0_20px_rgba(0,210,255,0.6)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="header-cta"
              >
                {t('nav.joinBeta')}
              </motion.button>

              {/* Login Link - Desktop */}
              <Link
                to="/login"
                className="hidden lg:block text-white/70 hover:text-white font-medium text-sm transition-colors"
                data-testid="header-login-link"
              >
                {language === 'es' ? 'Ingresar' : 'Login'}
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white"
                whileTap={{ scale: 0.9 }}
                data-testid="mobile-menu-toggle"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 p-6">
              <div className="flex flex-col gap-4">
                {/* Login Mobile */}
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white font-medium text-lg py-2 text-left hover:text-[#00D2FF] transition-colors"
                >
                  {language === 'es' ? 'Ingresar a mi cuenta' : 'Login to my account'}
                </Link>

                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white font-medium text-lg py-2 text-left hover:text-[#00D2FF] transition-colors"
                    data-testid={`mobile-nav-${link.id}`}
                  >
                    {link.label}
                  </motion.button>
                ))}
                
                {/* Nosotros - Mobile */}
                <Link
                  to="/nosotros"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white font-medium text-lg py-2 text-left hover:text-[#00D2FF] transition-colors"
                >
                  {language === 'es' ? 'Nosotros' : 'About Us'}
                </Link>

                {/* Para Coaches - Mobile */}
                <Link
                  to="/coaches"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-orange-400 font-semibold text-lg py-2"
                >
                  {language === 'es' ? 'Para Coaches' : 'For Coaches'}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <motion.button
                  onClick={() => scrollToSection('waitlist')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 w-full bg-[#00D2FF] text-black font-bold py-3 rounded-full hover:bg-[#33DBFF] transition-colors"
                  data-testid="mobile-cta"
                >
                  {t('nav.joinBeta')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
