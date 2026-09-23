import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../constants/Categories';

const slug = value => value.replace(/\s+/g, '-').toLowerCase();

const COMPONENT_ROUTES = CATEGORIES.filter(category => category.name !== 'Get Started').flatMap(category =>
  category.subcategories.map(component => ({
    category: category.name,
    component,
    path: `/${slug(category.name)}/${slug(component)}`
  }))
);

const PagerLink = ({ item, direction }) => {
  const previous = direction === 'previous';

  if (!item) {
    return (
      <span className={`component-pager-empty component-pager-${direction}`}>
        <span>
          <span className="component-pager-label">Collection</span>
          <span className="component-pager-name">{previous ? 'Start of library' : 'End of library'}</span>
        </span>
      </span>
    );
  }

  return (
    <Link className={`component-pager-link component-pager-${direction}`} to={item.path}>
      {previous ? <ArrowLeft size={16} aria-hidden="true" /> : null}
      <span>
        <span className="component-pager-label">{previous ? 'Previous' : 'Next'}</span>
        <span className="component-pager-name">{item.component}</span>
      </span>
      {!previous ? <ArrowRight size={16} aria-hidden="true" /> : null}
    </Link>
  );
};

const ComponentPager = ({ category, subcategory }) => {
  const path = `/${category}/${subcategory}`;
  const index = COMPONENT_ROUTES.findIndex(item => item.path === path);
  if (index < 0) return null;

  return (
    <nav className="component-pager" aria-label="Component navigation">
      <PagerLink item={COMPONENT_ROUTES[index - 1]} direction="previous" />
      <PagerLink item={COMPONENT_ROUTES[index + 1]} direction="next" />
    </nav>
  );
};

export default ComponentPager;
