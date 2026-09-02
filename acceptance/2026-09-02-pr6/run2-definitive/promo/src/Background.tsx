import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * Shared ambient background: fading grid, two drifting gradient orbs,
 * and an edge vignette. Entirely frame-driven so it renders deterministically.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#070B14', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: -140,
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.09) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          scale: 1 + frame * 0.00016,
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 45%, black 28%, transparent 76%)',
          maskImage:
            'radial-gradient(ellipse at 50% 45%, black 28%, transparent 76%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 920,
          height: 920,
          left: -280,
          top: -320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.34), transparent 65%)',
          translate: `${Math.sin(frame / 91) * 46}px ${Math.cos(frame / 113) * 34}px`,
          filter: 'blur(50px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1020,
          height: 1020,
          right: -340,
          bottom: -400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.20), transparent 65%)',
          translate: `${Math.cos(frame / 97) * -52}px ${Math.sin(frame / 83) * 40}px`,
          filter: 'blur(50px)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(3,7,18,0.82) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
