import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { SceneIntro } from './scenes/SceneIntro';
import { ScenePipeline } from './scenes/ScenePipeline';
import { SceneOutro } from './scenes/SceneOutro';

/**
 * 110 + 115 + 99 - 12 - 12 = 300 frames = 10.0s at 30 fps.
 */
export const ZcodePromo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={110}>
        <SceneIntro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: 12 })}
      />
      <TransitionSeries.Sequence durationInFrames={115}>
        <ScenePipeline />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: 12 })}
      />
      <TransitionSeries.Sequence durationInFrames={99}>
        <SceneOutro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
