import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';

import useProImpression from '../../hooks/useProImpression';
import { PRO_UPSELLS } from '../../constants/Pro';
import { proComponentPreview, proLinkProps } from '../../utils/pro';
import './ProCardMobile.css';

const REVEAL_SCROLL_Y = 240;

const ProCardMobile = () => {
  const { pathname } = useLocation();
  const category = pathname.split('/').filter(Boolean)[0];
  const config = PRO_UPSELLS[category] || PRO_UPSELLS.default;
  const isProRoute = pathname.startsWith('/pro');
  const destination = isProRoute ? '/#pricing' : config.path;
  const ctaLabel = isProRoute ? 'Get React Bits Pro' : `Explore more ${config.noun}`;
  const [visible, setVisible] = useState(false);
  const impressionRef = useProImpression('mobile-bar', { category: category || 'unknown' }, visible);

  useEffect(() => {
    const update = () => setVisible(window.scrollY >= REVEAL_SCROLL_Y);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <aside ref={impressionRef} className={`pro-mobile-shell${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <a
        {...proLinkProps(destination, 'mobile-bar', {
          params: { category: category || 'unknown' },
          sameTab: true
        })}
        className="pro-mobile-bar"
        tabIndex={visible ? undefined : -1}
        aria-label={isProRoute ? 'Get React Bits Pro' : `Explore React Bits Pro ${config.noun}`}
      >
        <img
          className="pro-mobile-bar-image"
          src={proComponentPreview(config.featured[0].slug).poster}
          alt=""
          aria-hidden="true"
        />
        <span className="pro-mobile-bar-text">
          <span className="pro-mobile-bar-label">React Bits Pro</span>
          <strong>{ctaLabel}</strong>
        </span>
        <span className="pro-mobile-bar-cta">
          <LuArrowRight size={13} />
        </span>
      </a>
    </aside>
  );
};

export default ProCardMobile;
