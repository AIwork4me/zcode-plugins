import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { Background } from '../Background';
import { COLORS, FONT_MONO, FONT_SANS } from '../theme';

const clamped = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const CheckBadge: React.FC<{ frame: number }> = ({ frame }) => {
  const circleDraw = interpolate(frame, [52, 70], [138, 0], {
    ...clamped,
    easing: easeOut,
  });
  const tickDraw = interpolate(frame, [64, 78], [34, 0], {
    ...clamped,
    easing: easeOut,
  });
  return (
    <svg width={46} height={46} viewBox="0 0 56 56" style={{ flexShrink: 0 }}>
      <circle
        cx={28}
        cy={28}
        r={22}
        fill="none"
        stroke={COLORS.green}
        strokeWidth={4}
        strokeDasharray={138}
        strokeDashoffset={circleDraw}
        transform="rotate(-90 28 28)"
      />
      <path
        d="M18 29 L25.5 36.5 L39 20"
        fill="none"
        stroke={COLORS.green}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={34}
        strokeDashoffset={tickDraw}
      />
    </svg>
  );
};

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();

  const line1Y = interpolate(frame, [4, 32], [64, 0], {
    ...clamped,
    easing: Easing.spring({ damping: 17, mass: 0.9 }),
  });
  const line1Opacity = interpolate(frame, [4, 18], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const line2Y = interpolate(frame, [12, 40], [64, 0], {
    ...clamped,
    easing: Easing.spring({ damping: 17, mass: 0.9 }),
  });
  const line2Opacity = interpolate(frame, [12, 26], [0, 1], {
    ...clamped,
    easing: easeOut,
  });

  const tagOpacity = interpolate(frame, [32, 50], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const tagY = interpolate(frame, [32, 52], [26, 0], {
    ...clamped,
    easing: easeOut,
  });

  const pillOpacity = interpolate(frame, [46, 60], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const pillScale = interpolate(frame, [46, 66], [0.92, 1], {
    ...clamped,
    easing: Easing.spring({ damping: 14, mass: 0.7 }),
    output: 'perceptual-scale',
  });

  const zoom = interpolate(frame, [0, 99], [1, 1.035], {
    ...clamped,
    output: 'perceptual-scale',
  });
  const glow = 0.45 + 0.25 * Math.sin(frame / 10);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
      }}
    >
      <Background />
      <div
        style={{
          position: 'absolute',
          width: 1200,
          height: 700,
          left: '50%',
          top: '42%',
          translate: '-50% -50%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(99,102,241,0.30), transparent 65%)',
          opacity: glow,
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          scale: zoom,
        }}
      >
        <Interactive.Div
          name="Brand line 1"
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            backgroundImage: COLORS.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: line1Opacity,
            translate: `0px ${line1Y}px`,
          }}
        >
          ZCode
        </Interactive.Div>
        <Interactive.Div
          name="Brand line 2"
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            color: COLORS.textPrimary,
            opacity: line2Opacity,
            translate: `0px ${line2Y}px`,
          }}
        >
          Remotion Plugin
        </Interactive.Div>

        <Interactive.Div
          name="Tagline"
          style={{
            fontFamily: FONT_SANS,
            fontWeight: 500,
            fontSize: 52,
            color: COLORS.textSecondary,
            marginTop: 34,
            opacity: tagOpacity,
            translate: `0px ${tagY}px`,
            textAlign: 'center',
          }}
        >
          One prompt in. Verified MP4 out.
        </Interactive.Div>

        <Interactive.Div
          name="Verified pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 44,
            padding: '20px 42px',
            borderRadius: 999,
            border: '1px solid rgba(52, 211, 153, 0.42)',
            background: 'rgba(52, 211, 153, 0.08)',
            boxShadow: '0 0 44px rgba(52, 211, 153, 0.16)',
            opacity: pillOpacity,
            scale: pillScale,
          }}
        >
          <CheckBadge frame={frame} />
          <div
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: 3,
              color: COLORS.greenSoft,
              whiteSpace: 'nowrap',
            }}
          >
            VERIFIED OUTPUT · MP4 · 1920×1080 · 30 FPS
          </div>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
