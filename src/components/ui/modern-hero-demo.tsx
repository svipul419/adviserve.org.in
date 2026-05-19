import RainingLetters from "./modern-animated-hero-section";

interface ModernHeroDemoProps {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  ctaText?: string
  ctaLink?: string
  secondaryText?: string
  secondaryLink?: string
  badgeText?: string
}

const Main: React.FC<ModernHeroDemoProps> = (props) => {
  return <RainingLetters {...props} />;
};

export { Main as ModernHeroDemo };
