import { motion } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

// TikTok icon (not in lucide-react)
const TikTokIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.01a8.35 8.35 0 004.76 1.49V7.04a4.79 4.79 0 01-1-.35z"/>
  </svg>
);

const Footer = () => {
  const { t, language } = useLanguage();

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/kcaliperai', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://tiktok.com/@kcaliperai', label: 'TikTok' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#00D2FF]/50 flex items-center justify-center">
                <span className="font-black text-black text-sm">K</span>
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                kcaliper<span className="text-[#00D2FF]">.ai</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#00D2FF] hover:border-[#00D2FF]/30 transition-colors"
                    aria-label={social.label}
                    data-testid={`social-${social.label.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footer.links.product')}
            </h4>
            <ul className="space-y-3">
              {[
                { key: 'features', href: '#features' },
                { key: 'pricing', href: '#pricing' },
                { key: 'demo', href: '#demo' },
              ].map((link) => (
                <li key={link.key}>
                  <a 
                    href={link.href} 
                    className="text-white/50 hover:text-[#00D2FF] transition-colors text-sm block py-1"
                  >
                    {t(`footer.links.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footer.links.company')}
            </h4>
            <ul className="space-y-3">
              {[
                { key: 'about', href: '/nosotros' },
                { key: 'blog', href: '#' },
                { key: 'careers', href: '#' },
              ].map((link) => (
                <li key={link.key}>
                  <Link 
                    to={link.href}
                    className="text-white/50 hover:text-[#00D2FF] transition-colors text-sm block py-1"
                  >
                    {t(`footer.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footer.links.legal')}
            </h4>
            <ul className="space-y-3">
              {[
                { key: 'privacy', href: '/privacy' },
                { key: 'terms', href: '/terms' },
              ].map((link) => (
                <li key={link.key}>
                  <Link 
                    to={link.href}
                    className="text-white/50 hover:text-[#00D2FF] transition-colors text-sm block py-1"
                  >
                    {t(`footer.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-white/40 text-sm order-2 sm:order-1">
              © 2026 kcaliper.com. Todos los derechos reservados.
            </p>
            <p className="text-white/30 text-xs order-1 sm:order-2">
              Owned by Future Ventures Group LLC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
