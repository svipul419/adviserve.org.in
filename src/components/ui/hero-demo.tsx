import { InteractiveHero } from "./interactive-hero-backgrounds";

const InteractiveHeroDemo = () => {
  return (
      <InteractiveHero
          brandName="Adviserve"
          heroTitle="Innovation Meets Scale"
          heroDescription="A modernist approach to recruitment, business consulting, and IT scale. Experience dynamic HR solutions designed for global leaders."
          emailPlaceholder="Enter your work email"
          ballpitConfig={{
              count: 150,
              gravity: 0.5,
              friction: 0.99,
              minSize: 0.4,
              maxSize: 0.9,
              lightIntensity: 4,
          }}
      />
  );
};

export default InteractiveHeroDemo;
