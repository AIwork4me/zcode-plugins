import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { Background } from '../Background';
import { COLORS, FONT_MONO, FONT_SANS } from '../theme';

const COMMAND = 'zcode render promo.mp4';

const clamped = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const termOpacity = interpolate(frame, [0, 10], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const termY = interpolate(frame, [0, 14], [40, 0], {
    ...clamped,
    easing: easeOut,
  });
  const termScale = interpolate(frame, [0, 14], [0.96, 1], {
    ...clamped,
    easing: easeOut,
    output: 'perceptual-scale',
  });

  const typedCount = Math.min(
    COMMAND.length,
    Math.max(0, Math.floor(frame - 12)),
  );
  const typed = COMMAND.slice(0, typedCount);
  const cursorOn = frame % 28 < 16;

  const resultOpacity = interpolate(frame, [44, 56], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const resultX = interpolate(frame, [44, 60], [-18, 0], {
    ...clamped,
    easing: easeOut,
  });

  const titleOpacity = interpolate(frame, [58, 72], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const titleY = interpolate(frame, [58, 88], [54, 0], {
    ...clamped,
    easing: Easing.spring({ damping: 18, mass: 0.9 }),
  });
  const taglineOpacity = interpolate(frame, [78, 94], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const taglineY = interpolate(frame, [78, 96], [22, 0], {
    ...clamped,
    easing: easeOut,
  });

  const glow = 0.5 + 0.5 * Math.sin(frame / 9);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
      }}
    >
      <Background />
      <Interactive.Div
        name="Intro column"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Interactive.Div
          name="Terminal"
          style={{
            width: 960,
            borderRadius: 20,
            border: `1px solid ${COLORS.panelBorder}`,
            background: 'rgba(10, 15, 28, 0.86)',
            boxShadow: `0 32px 90px rgba(2, 6, 23, 0.7), 0 0 ${40 + 50 * glow}px rgba(99, 102, 241, ${0.08 + 0.12 * glow})`,
            overflow: 'hidden',
            opacity: termOpacity,
            translate: `0px ${termY}px`,
            scale: termScale,
          }}
        >
          <div
            style={{
              height: 54,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 22,
              gap: 10,
              borderBottom: `1px solid ${COLORS.panelBorder}`,
              position: 'relative',
            }}
          >
            {[0, 1, 2].map((i) => {
              const dotScale = interpolate(frame, [4 + i * 3, 12 + i * 3], [0, 1], {
                ...clamped,
                easing: Easing.spring({ damping: 12, mass: 0.6 }),
                output: 'perceptual-scale',
              });
              return (
                <div
                  key={i}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: '50%',
                    background: ['#F87171', '#FBBF24', '#34D399'][i],
                    scale: dotScale,
                  }}
                />
              );
            })}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontFamily: FONT_MONO,
                fontSize: 21,
                color: COLORS.textSecondary,
              }}
            >
              zcode · render
            </div>
          </div>
          <div
            style={{
              padding: '28px 38px 32px',
              fontFamily: FONT_MONO,
              fontSize: 34,
              lineHeight: 1.55,
            }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>
              <span style={{ color: COLORS.cyan }}>$ </span>
              <span style={{ color: COLORS.textPrimary }}>{typed}</span>
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 36,
                  marginLeft: 4,
                  translate: '0px 6px',
                  background: COLORS.cyan,
                  opacity: cursorOn ? 1 : 0,
                }}
              />
            </div>
            <div
              style={{
                opacity: resultOpacity,
                translate: `${resultX}px 0`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: COLORS.green }}>✓ </span>
              <span style={{ color: COLORS.greenSoft }}>300 frames</span>
              <span style={{ color: COLORS.textSecondary }}>
                {' '}
                · visual QA passed
              </span>
            </div>
          </div>
        </Interactive.Div>

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <Interactive.Div
            name="Product title"
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 800,
              fontSize: 108,
              letterSpacing: '-0.02em',
              color: COLORS.textPrimary,
              opacity: titleOpacity,
              translate: `0px ${titleY}px`,
            }}
          >
            <span
              style={{
                backgroundImage: COLORS.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ZCode
            </span>{' '}
            Remotion Plugin
          </Interactive.Div>
          <Interactive.Div
            name="Tagline"
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 500,
              fontSize: 46,
              color: COLORS.textSecondary,
              marginTop: 20,
              opacity: taglineOpacity,
              translate: `0px ${taglineY}px`,
            }}
          >
            From prompt to verified video.
          </Interactive.Div>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
