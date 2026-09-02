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

const CHIP = 88;
const ROW_GAP = 38;
const ROWS = [
  { num: '01', label: 'One prompt', sub: 'describe the video', accent: false },
  {
    num: '02',
    label: 'Official Remotion skills',
    sub: 'loaded automatically',
    accent: false,
  },
  {
    num: '03',
    label: 'Visual QA',
    sub: 'render + inspect frames',
    accent: false,
  },
  {
    num: '04',
    label: 'Verified MP4',
    sub: 'duration · resolution · stream',
    accent: true,
  },
];

const ROWS_HEIGHT = ROWS.length * CHIP + (ROWS.length - 1) * ROW_GAP;

const CheckMark: React.FC<{ frame: number }> = ({ frame }) => {
  const circleDraw = interpolate(frame, [92, 108], [138, 0], {
    ...clamped,
    easing: easeOut,
  });
  const tickDraw = interpolate(frame, [102, 114], [34, 0], {
    ...clamped,
    easing: easeOut,
  });
  return (
    <svg
      width={54}
      height={54}
      viewBox="0 0 56 56"
      style={{ marginLeft: 24, flexShrink: 0 }}
    >
      <circle
        cx={28}
        cy={28}
        r={22}
        fill="none"
        stroke={COLORS.green}
        strokeWidth={3.5}
        strokeDasharray={138}
        strokeDashoffset={circleDraw}
        transform="rotate(-90 28 28)"
      />
      <path
        d="M18 29 L25.5 36.5 L39 20"
        fill="none"
        stroke={COLORS.green}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={34}
        strokeDashoffset={tickDraw}
      />
    </svg>
  );
};

export const ScenePipeline: React.FC = () => {
  const frame = useCurrentFrame();

  const kickerOpacity = interpolate(frame, [0, 12], [0, 1], {
    ...clamped,
    easing: easeOut,
  });
  const kickerY = interpolate(frame, [0, 14], [-18, 0], {
    ...clamped,
    easing: easeOut,
  });

  const lineProgress = interpolate(frame, [12, 76], [0, 1], {
    ...clamped,
    easing: easeOut,
  });

  const zoom = interpolate(frame, [0, 115], [1, 1.03], {
    ...clamped,
    output: 'perceptual-scale',
  });

  const pulse = ((frame - 24) % 48) / 48;
  const pulseActive = frame >= 24;
  const dotTop = 44 + pulse * (ROWS_HEIGHT - CHIP);
  const dotOpacity = pulseActive ? Math.sin(Math.PI * pulse) : 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
      }}
    >
      <Background />
      <div style={{ width: 1620, scale: zoom }}>
        <Interactive.Div
          name="Kicker"
          style={{
            textAlign: 'center',
            fontFamily: FONT_MONO,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 12,
            color: COLORS.cyan,
            opacity: kickerOpacity,
            translate: `0px ${kickerY}px`,
          }}
        >
          HOW IT WORKS
        </Interactive.Div>

        <div style={{ position: 'relative', marginTop: 58 }}>
          <div
            style={{
              position: 'absolute',
              left: 43,
              top: 44,
              width: 2,
              height: ROWS_HEIGHT - CHIP,
              background: `linear-gradient(180deg, ${COLORS.indigo}, ${COLORS.cyan})`,
              opacity: 0.55,
              scale: `1 ${lineProgress}`,
              transformOrigin: 'top',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 37,
              top: dotTop,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: COLORS.cyan,
              boxShadow: `0 0 18px 4px rgba(34, 211, 238, 0.55)`,
              opacity: dotOpacity,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
            {ROWS.map((row, i) => {
              const start = 18 + i * 20;
              const opacity = interpolate(frame, [start, start + 14], [0, 1], {
                ...clamped,
                easing: easeOut,
              });
              const x = interpolate(frame, [start, start + 24], [-70, 0], {
                ...clamped,
                easing: Easing.spring({ damping: 16, mass: 0.8 }),
              });
              return (
                <Interactive.Div
                  key={row.num}
                  name={`Step ${row.num}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 34,
                    opacity,
                    translate: `${x}px 0`,
                  }}
                >
                  <div
                    style={{
                      width: CHIP,
                      height: CHIP,
                      borderRadius: 22,
                      border: `1px solid ${COLORS.panelBorder}`,
                      background: COLORS.panel,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontFamily: FONT_MONO,
                      fontWeight: 700,
                      fontSize: 30,
                      color: row.accent ? COLORS.green : COLORS.cyan,
                      flexShrink: 0,
                    }}
                  >
                    {row.num}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: 64,
                      letterSpacing: '-0.01em',
                      color: row.accent ? COLORS.greenSoft : COLORS.textPrimary,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.label}
                  </div>
                  {row.accent ? <CheckMark frame={frame} /> : null}
                  <div
                    style={{
                      marginLeft: 'auto',
                      fontFamily: FONT_MONO,
                      fontSize: 29,
                      color: COLORS.textSecondary,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.sub}
                  </div>
                </Interactive.Div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
