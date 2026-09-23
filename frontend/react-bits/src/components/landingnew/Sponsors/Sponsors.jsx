import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Plus } from 'lucide-react';
import {
  diamondSponsors,
  platinumSponsors,
  silverSponsors
} from '../../../constants/Sponsors';
import './Sponsors.css';

const buildSponsorUrl = (url, tier) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'reactbits');
    u.searchParams.set('utm_medium', 'sponsor');
    u.searchParams.set('utm_campaign', tier);
    u.searchParams.set('ref', 'reactbits');
    return u.toString();
  } catch {
    return `${url}${url.includes('?') ? '&' : '?'}utm_source=reactbits&utm_medium=sponsor&utm_campaign=${tier}&ref=reactbits`;
  }
};

const SponsorCard = ({ sponsor, tier }) => (
  <a
    href={buildSponsorUrl(sponsor.url, tier)}
    target="_blank"
    rel="noopener noreferrer"
    className={`ln-sp-card ln-sp-card--${tier}`}
  >
    <div className={`ln-sp-card-visual ln-sp-card-visual--${tier}`}>
      <img className="ln-sp-card-logo" src={sponsor.imageUrl} alt={sponsor.name} loading="lazy" />
    </div>
    <ArrowRight size={14} className="ln-sp-card-arrow" aria-hidden="true" />
  </a>
);

const EmptySlot = ({ tier }) => (
  <Link
    to="/sponsors#sponsor-plans"
    className={`ln-sp-card ln-sp-card--${tier} ln-sp-card--empty`}
    aria-label={`Become a ${tier} sponsor`}
  >
    <div className={`ln-sp-card-visual ln-sp-card-visual--${tier}`}>
      <Plus size={18} className="ln-sp-empty-icon" aria-hidden="true" />
    </div>
  </Link>
);

const SponsorTier = ({ label, tier, sponsors, capacity }) => (
  <motion.div
    className={`ln-sp-tier ln-sp-tier--${tier}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    <div className="ln-sp-tier-header">
      <span className={`ln-sp-tier-label ln-sp-tier-label--${tier}`}>{label}</span>
    </div>
    <div className={`ln-sp-grid ln-sp-grid--${tier}`}>
      {sponsors.map(sponsor => (
        <SponsorCard key={sponsor.id} sponsor={sponsor} tier={tier} />
      ))}
      {Array.from({ length: Math.max(0, capacity - sponsors.length) }, (_, index) => (
        <EmptySlot key={`${tier}-empty-${index}`} tier={tier} />
      ))}
    </div>
  </motion.div>
);

const Sponsors = () => (
  <section className="ln-sp-section">
    <div className="ln-sp-inner">
      <motion.h2
        className="ln-sp-title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        Sponsors
      </motion.h2>

      <div className="ln-sp-tiers">
        <SponsorTier label="Diamond" tier="diamond" sponsors={diamondSponsors} capacity={2} />
        <SponsorTier label="Platinum" tier="platinum" sponsors={platinumSponsors} capacity={3} />
        <SponsorTier label="Silver" tier="silver" sponsors={silverSponsors} capacity={5} />
      </div>

      <motion.div
        className="ln-sp-footer"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Link to="/sponsors" className="ln-sp-footer-link">
          View all sponsors <ArrowRight size={12} />
        </Link>
        <Link to="/sponsors#sponsor-plans" className="ln-sp-footer-link">
          Become a sponsor <ArrowRight size={12} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default Sponsors;
