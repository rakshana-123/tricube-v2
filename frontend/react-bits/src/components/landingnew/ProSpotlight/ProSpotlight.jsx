import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LuArrowRight } from 'react-icons/lu';

import useProImpression from '../../../hooks/useProImpression';
import { trackProClick } from '../../../utils/pro';
import './ProSpotlight.css';

const LIBRARY_PREVIEWS = [
  {
    label: 'Animated components',
    title: 'Motion and interaction',
    image: '/assets/pro/components/aurora-beam-poster.webp',
    to: '/pro/components'
  },
  {
    label: 'Page blocks',
    title: 'Complete marketing sections',
    image: '/assets/pro/blocks/hero-7.webp',
    crop: 'standard',
    to: '/pro/blocks'
  },
  {
    label: 'App UI',
    title: 'Interfaces for real products',
    image: '/assets/pro/app-ui/ai-chat-8.webp',
    crop: 'deep',
    to: '/pro/app-ui'
  },
  {
    label: 'Agent Kit',
    title: 'Prompts, skills & recipes',
    image: '/assets/pro/agent-kit/skill-terminal-dark.webp',
    to: '/pro/agent-kit'
  },
  {
    label: 'Templates',
    title: 'Complete Next.js websites',
    video: 'https://cdn.reactbits.dev/security-preview.mp4',
    to: '/pro/templates'
  }
];

const ProSpotlight = () => {
  const impressionRef = useProImpression('landing-pro-spotlight');
  const templateVideoRef = useRef(null);

  const playTemplate = () => {
    const video = templateVideoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const playback = video.play();
    playback?.catch(() => {});
  };

  const stopTemplate = () => {
    const video = templateVideoRef.current;
    if (!video) return;

    video.pause();
    if (video.readyState >= 1) video.currentTime = 0.4;
  };

  return (
    <section className="ln-prospot-section" ref={impressionRef}>
      <motion.div
        className="ln-prospot-inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <header className="ln-prospot-header">
          <div className="ln-prospot-copy">
            <h2>Build the complete product.</h2>
            <p>React Bits Pro adds more components, page blocks, application UI, full Next.js templates and agent skills to the package you already use.</p>
          </div>
          <a
            className="ln-prospot-primary"
            href="https://pro.reactbits.dev/docs/introduction"
            onClick={() =>
              trackProClick('landing-pro-spotlight', {
                destination: 'https://pro.reactbits.dev/docs/introduction'
              })
            }
          >
            Explore the library <LuArrowRight size={15} />
          </a>
        </header>

        <div className="ln-prospot-gallery" aria-label="Inside React Bits Pro">
          {LIBRARY_PREVIEWS.map(item => (
            <Link
              className="browse-card ln-prospot-item"
              to={item.to}
              key={item.label}
              onMouseEnter={item.video ? playTemplate : undefined}
              onMouseLeave={item.video ? stopTemplate : undefined}
              onFocus={item.video ? playTemplate : undefined}
              onBlur={item.video ? stopTemplate : undefined}
              onClick={() => trackProClick('landing-pro-preview', { section: item.label, destination: item.to })}
            >
              <span
                className={`browse-card-well ln-prospot-media${item.crop ? ` is-zoomed is-zoomed-${item.crop}` : ''}`}
              >
                {item.video ? (
                  <video
                    ref={templateVideoRef}
                    src={item.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    onLoadedMetadata={event => {
                      event.currentTarget.currentTime = 0.4;
                    }}
                  />
                ) : (
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                )}
              </span>
              <span className="ln-prospot-item-copy">
                <strong className="browse-card-title">{item.title}</strong>
                <small>{item.label}</small>
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProSpotlight;
