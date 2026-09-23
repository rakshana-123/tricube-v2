import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { FiArrowRight } from 'react-icons/fi';
import MoltenMetal from '@/content/Backgrounds/MoltenMetal/MoltenMetal';
import useProImpression from '../../../hooks/useProImpression';
import { proLinkProps } from '../../../utils/pro';
import './CTA.css';

const CTA = () => {
  const prefersReducedMotion = useReducedMotion();
  const impressionRef = useProImpression('landing-final-cta');

  return (
    <section className="ln-cta-section" ref={impressionRef}>
      <div className="ln-cta-glow" />

      <motion.div
        className="ln-cta-inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="ln-cta-card-wrapper">
          <div className="ln-cta-card-border" />
          <div className="ln-cta-card">
            {!prefersReducedMotion && (
              <div className="ln-cta-bg" aria-hidden="true">
                <MoltenMetal opacity={0.4} mouseInteraction={false} />
              </div>
            )}
            <h2 className="ln-cta-headline">Build something people remember.</h2>

            <p className="ln-cta-sub">
              Start with the free library. When you need the complete page, product UI and tools to ship it, React Bits
              Pro is ready.
            </p>

            <div className="ln-cta-buttons">
              <a
                {...proLinkProps('/#pricing', 'landing-final-cta', { sameTab: true })}
                className="ln-cta-btn ln-cta-btn--primary"
              >
                Get React Bits Pro <FiArrowRight size={15} />
              </a>
              <Link to="/get-started/index" className="ln-cta-btn ln-cta-btn--secondary">
                Browse free components
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
