import useScrollToTop from '../hooks/useScrollToTop';
import DocsButtonBar from './DocsButtonBar';
import CopyPageButton from './CopyPageButton';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, SlidersHorizontal, TerminalSquare } from 'lucide-react';

const QUICK_START_STEPS = [
  {
    icon: Search,
    title: 'Choose a component',
    description: 'Browse by category or search for the interaction you need.'
  },
  {
    icon: SlidersHorizontal,
    title: 'Make it yours',
    description: 'Tune the preview and send settings to your usage code.'
  },
  {
    icon: TerminalSquare,
    title: 'Add it to your project',
    description: 'Copy the source or install your chosen variant with the CLI.'
  }
];

const Introduction = () => {
  useScrollToTop();

  return (
    <section className="docs-section">
      <div className="docs-page-header">
        <h1 className="docs-title">Introduction</h1>
        <CopyPageButton />
      </div>

      <p className="docs-lead">
        React Bits is an open-source collection of expressive UI components for adding motion and personality without adopting an entire design system.
      </p>

      <p className="docs-lead">
        Pick a component, tune it in the preview, then copy or install the exact variant for your stack. React Bits makes it easy to be creative, and works great with AI.
      </p>

      <div className="docs-quickstart">
        <div className="docs-quickstart-steps">
          {QUICK_START_STEPS.map(({ icon: StepIcon, title, description }, index) => (
            <div className="docs-quickstart-step" key={title}>
              <div className="docs-quickstart-step-heading">
                <span className="docs-quickstart-index">0{index + 1}</span>
                <StepIcon size={17} aria-hidden="true" />
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <div className="docs-quickstart-actions">
          <Link to="/get-started/index" className="docs-quickstart-primary">
            Browse components
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link to="/get-started/installation" className="docs-quickstart-secondary">
            Installation guide
          </Link>
        </div>
      </div>

      <h2 className="docs-section-title">Mission</h2>

      <p className="docs-paragraph dim">
        The goal of React Bits is simple - provide flexible, visually stunning and most importantly, free components
        that take web projects to the next level.
      </p>
      <p className="docs-paragraph">To make that happen, the project is committed to the following principles:</p>

      <ul className="docs-list">
        <li className="docs-list-item">
          <span className="docs-highlight">Free For All:</span> You own the code, and it&apos;s free to use in your
          projects
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Prop-First Approach:</span> Easy customization through thoughtfully exposed
          props
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Fully Modular:</span> Install strictly what you need, React Bits is not a
          dependency
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Free Choice:</span> JS or TS, plain CSS or Tailwind, the code is all here
        </li>
      </ul>

      <h3 className="docs-subtitle">Free For All</h3>

      <p className="docs-paragraph">
        Every component you choose to bring into your project is yours to modify or extend, because you get full
        visibility of the code, not just an import.
      </p>

      <h3 className="docs-subtitle">Prop-First Approach</h3>

      <p className="docs-paragraph">
        Every component is designed to be flexible and customizable, with props that allow you to adjust the look and
        feel without having to always dive into the code.
      </p>

      <h3 className="docs-subtitle">Fully Modular</h3>

      <p className="docs-paragraph">
        React Bits is not your classic NPM library, you install only the components you need by either copying the code
        or using the CLI, without pulling in a whole library.
      </p>

      <h3 className="docs-subtitle">Free Choice</h3>

      <p className="docs-paragraph">
        I don&apos;t want to dictate how you build your projects. Whether you prefer JavaScript or TypeScript, plain CSS
        or Tailwind, it&apos;s all here for you to use as you see fit.
      </p>

      <p className="docs-paragraph dim">
        P.S. The header has a neat dropdown to help you choose your preferred technologies.
      </p>

      <h2 className="docs-section-title">Performance</h2>

      <p className="docs-paragraph dim">
        While we do everything possible to optimize components and offer the best experience, here are some tips to keep
        in mind when using React Bits:
      </p>

      <ul className="docs-list">
        <li className="docs-list-item">
          <span className="docs-highlight">Less Is More:</span> Using more than 2-3 components on a page is not advised,
          it can overload your page with animations, potentially impacting performance or UX
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Mobile Optimization:</span> Consider disabling certain effects on mobile and
          replacing them with static placeholders instead
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Test Thoroughly:</span> Your device may be high-end, but be considerate of
          your users - always test on multiple devices before going live
        </li>
      </ul>

      <DocsButtonBar next={{ label: 'Installation', route: '/get-started/installation' }} />
    </section>
  );
};

export default Introduction;
