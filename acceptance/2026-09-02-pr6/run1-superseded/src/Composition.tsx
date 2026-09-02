import {
  AbsoluteFill,
  Composition,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const GREEN = "#22c55e";
const BG = "#0a0e1a";

const FONT =
  "Inter, 'Segoe UI', 'Helvetica Neue', system-ui, -apple-system, sans-serif";
const MONO = "'Cascadia Code', 'JetBrains Mono', Consolas, monospace";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// ---------------------------------------------------------------- background
const PARTICLES = Array.from({ length: 36 }, (_, i) => {
  const seed = (i * 137.5) % 100;
  return {
    x: (seed / 100) * 1920,
    y: ((i * 61.8) % 100) * 10.8,
    speed: 0.4 + ((i * 13) % 7) * 0.15,
    size: 3 + ((i * 7) % 4) * 2,
    color: i % 3 === 0 ? CYAN : i % 3 === 1 ? VIOLET : "#64748b",
    opacity: 0.15 + ((i * 11) % 5) * 0.06,
  };
});

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: interpolate(frame, [0, 300], [-500, -200]),
          top: interpolate(frame, [0, 300], [-700, -500]),
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(34,211,238,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 1600,
          right: interpolate(frame, [0, 300], [-600, -350]),
          bottom: interpolate(frame, [0, 300], [-800, -550]),
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          translate: `0px ${interpolate(frame, [0, 300], [0, 80])}px`,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {PARTICLES.map((p, i) => {
        const y = ((p.y + frame * p.speed) % 1200) - 60;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: p.opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scene 1 (0–75)
const Scene1: React.FC = () => {
  const frame = useCurrentFrame(); // 0..74
  const { fps } = useVideoConfig();
  const t = (m: number) => m * fps;
  return (
    <AbsoluteFill
      name="Scene1"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 34,
        fontFamily: FONT,
        opacity: interpolate(frame, [t(2.1), t(2.4)], [1, 0], clamp),
      }}
    >
      <div
        name="Logo"
        style={{
          width: 132,
          height: 132,
          borderRadius: 32,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(34,211,238,0.1)",
          border: "2px solid rgba(34,211,238,0.5)",
          boxShadow: "0 0 60px rgba(34,211,238,0.35)",
          scale: interpolate(frame, [0, t(0.6)], [0.3, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 12 }),
          }),
          rotate: interpolate(frame, [0, t(0.8)], [-12, 0], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        <svg width="72" height="72" viewBox="0 0 72 72">
          <polyline
            points="8,50 22,50 30,20 42,58 50,36 56,36"
            fill="none"
            stroke={CYAN}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(frame, [t(0.2), t(1.4)], [1, 0], {
              ...clamp,
              easing: easeOut,
            })}
          />
        </svg>
      </div>
      <div
        name="Title"
        style={{
          fontSize: 118,
          fontWeight: 800,
          color: "#f8fafc",
          letterSpacing: "-2px",
          opacity: interpolate(frame, [t(0.5), t(1.0)], [0, 1], clamp),
          translateY: interpolate(frame, [t(0.5), t(1.0)], [40, 0], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        ZCode{" "}
        <span
          style={{
            background: `linear-gradient(90deg, ${CYAN}, ${VIOLET})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Remotion
        </span>{" "}
        Plugin
      </div>
      <div
        name="Subtitle"
        style={{
          fontSize: 42,
          fontWeight: 500,
          color: "#94a3b8",
          opacity: interpolate(frame, [t(0.9), t(1.4)], [0, 1], clamp),
          translateY: interpolate(frame, [t(0.9), t(1.4)], [24, 0], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        Programmatic video for coding agents
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scene 2 (75–150)
const PROMPT_TEXT = "> make me a 10s promo video";
const Scene2: React.FC = () => {
  const frame = useCurrentFrame(); // 0..74
  const { fps } = useVideoConfig();
  const chars = Math.floor(
    interpolate(frame, [fps * 0.4, fps * 2.0], [0, PROMPT_TEXT.length], {
      ...clamp,
      easing: Easing.linear,
    })
  );
  const cursorOn = frame % 20 < 10;
  return (
    <AbsoluteFill
      name="Scene2"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 48,
        fontFamily: FONT,
        opacity: interpolate(
          frame,
          [0, fps * 0.25, fps * 2.25, fps * 2.5],
          [0, 1, 1, 0],
          clamp
        ),
      }}
    >
      <div
        name="Headline"
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#f8fafc",
          opacity: interpolate(frame, [fps * 0.1, fps * 0.5], [0, 1], clamp),
          translateY: interpolate(frame, [fps * 0.1, fps * 0.5], [30, 0], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        One prompt is all it takes
      </div>
      <div
        name="Terminal"
        style={{
          width: 1240,
          backgroundColor: "rgba(15,23,42,0.92)",
          border: "1px solid rgba(148,163,184,0.25)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          translateY: interpolate(frame, [0, fps * 0.5], [60, 0], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "18px 24px",
            backgroundColor: "rgba(30,41,59,0.9)",
            borderBottom: "1px solid rgba(148,163,184,0.15)",
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#eab308" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#22c55e" }} />
          <div style={{ marginLeft: 16, fontSize: 24, color: "#94a3b8", fontFamily: MONO }}>
            zcode — agent session
          </div>
        </div>
        <div
          style={{
            padding: "36px 40px",
            fontSize: 40,
            fontFamily: MONO,
            color: CYAN,
            minHeight: 120,
          }}
        >
          {PROMPT_TEXT.slice(0, chars)}
          <span style={{ opacity: chars >= PROMPT_TEXT.length && cursorOn ? 1 : 0, color: "#f8fafc" }}>
            ▌
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scene 3 (150–225)
const STEPS = [
  { label: "One prompt", icon: "⌨" },
  { label: "Remotion skills", icon: "⚡" },
  { label: "Visual QA", icon: "🔍" },
  { label: "Verified MP4", icon: "✓" },
];
const Scene3: React.FC = () => {
  const frame = useCurrentFrame(); // 0..74
  const { fps } = useVideoConfig();
  const gap = 400;
  const startX = 960 - (gap * 3) / 2;
  return (
    <AbsoluteFill
      name="Scene3"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 70,
        fontFamily: FONT,
        opacity: interpolate(
          frame,
          [0, fps * 0.25, fps * 2.25, fps * 2.5],
          [0, 1, 1, 0],
          clamp
        ),
      }}
    >
      <div
        name="Headline"
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#f8fafc",
          opacity: interpolate(frame, [fps * 0.1, fps * 0.5], [0, 1], clamp),
        }}
      >
        The full pipeline, automated
      </div>
      <div style={{ position: "relative", width: 1760, height: 320 }}>
        <div
          style={{
            position: "absolute",
            left: startX + 130,
            top: 130,
            width: gap * 3 - 260,
            height: 4,
            backgroundColor: "rgba(148,163,184,0.2)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: startX + 130,
            top: 130,
            width: gap * 3 - 260,
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${CYAN}, ${VIOLET})`,
            scaleX: interpolate(frame, [fps * 0.5, fps * 2.0], [0, 1], {
              ...clamp,
              easing: Easing.linear,
            }),
            transformOrigin: "left center",
          }}
        />
        {STEPS.map((step, i) => {
          const appear = fps * (0.5 + i * 0.45);
          const active = frame > appear + fps * 0.3;
          return (
            <div
              key={step.label}
              style={{
                position: "absolute",
                left: startX + i * gap - 130,
                top: 0,
                width: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
                opacity: interpolate(frame, [appear, appear + fps * 0.35], [0, 1], clamp),
                translateY: interpolate(frame, [appear, appear + fps * 0.35], [36, 0], {
                  ...clamp,
                  easing: easeOut,
                }),
              }}
            >
              <div
                style={{
                  width: 164,
                  height: 164,
                  borderRadius: 36,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 72,
                  color: active ? BG : "#94a3b8",
                  background: active
                    ? `linear-gradient(135deg, ${CYAN}, ${VIOLET})`
                    : "rgba(30,41,59,0.9)",
                  border: `2px solid ${active ? CYAN : "rgba(148,163,184,0.3)"}`,
                  boxShadow: active
                    ? `0 0 50px ${i % 2 === 0 ? "rgba(34,211,238,0.4)" : "rgba(167,139,250,0.4)"}`
                    : "none",
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 600,
                  color: active ? "#f8fafc" : "#94a3b8",
                  textAlign: "center",
                }}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scene 4 (225–300)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame(); // 0..74
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      name="Scene4"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 44,
        fontFamily: FONT,
      }}
    >
      <div
        name="FileCard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          padding: "34px 52px",
          borderRadius: 24,
          backgroundColor: "rgba(15,23,42,0.92)",
          border: `2px solid rgba(34,197,94,0.6)`,
          boxShadow: "0 0 70px rgba(34,197,94,0.25)",
          opacity: interpolate(frame, [0, fps * 0.35], [0, 1], clamp),
          translateY: interpolate(frame, [0, fps * 0.35], [40, 0], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            backgroundColor: GREEN,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            scale: interpolate(frame, [fps * 0.6, fps * 0.85], [0, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 10 }),
            }),
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44">
            <polyline
              points="10,24 19,33 35,13"
              fill="none"
              stroke="#052e16"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={interpolate(frame, [fps * 0.7, fps * 1.1], [1, 0], {
                ...clamp,
                easing: easeOut,
              })}
            />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 56, fontWeight: 700, color: "#f8fafc", fontFamily: MONO }}>
            promo.mp4
          </div>
          <div style={{ fontSize: 30, color: "#4ade80", fontWeight: 600, letterSpacing: 2 }}>
            VERIFIED · 1080p · 30fps
          </div>
        </div>
      </div>
      <div
        name="Tagline"
        style={{
          fontSize: 76,
          fontWeight: 800,
          color: "#f8fafc",
          letterSpacing: "-1px",
          opacity: interpolate(frame, [fps * 0.8, fps * 1.2], [0, 1], clamp),
          translateY: interpolate(frame, [fps * 0.8, fps * 1.2], [30, 0], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        Rendered. Checked.{" "}
        <span
          style={{
            background: `linear-gradient(90deg, ${CYAN}, ${VIOLET})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Delivered.
        </span>
      </div>
      <div
        name="Footer"
        style={{
          fontSize: 36,
          color: "#94a3b8",
          opacity: interpolate(frame, [fps * 1.1, fps * 1.5], [0, 1], clamp),
        }}
      >
        ZCode Remotion Plugin — from prompt to pixels
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- composition
export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

export const MyComponent: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Background />
      <Sequence from={0} durationInFrames={75}>
        <Scene1 />
      </Sequence>
      <Sequence from={75} durationInFrames={75}>
        <Scene2 />
      </Sequence>
      <Sequence from={150} durationInFrames={75}>
        <Scene3 />
      </Sequence>
      <Sequence from={225} durationInFrames={75}>
        <Scene4 />
      </Sequence>
    </AbsoluteFill>
  );
};
