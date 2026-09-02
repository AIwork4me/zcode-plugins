import { Composition, Folder } from 'remotion';
import { ZcodePromo } from './ZcodePromo';
import { SceneIntro } from './scenes/SceneIntro';
import { ScenePipeline } from './scenes/ScenePipeline';
import { SceneOutro } from './scenes/SceneOutro';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="ZcodePromo-Scenes">
        <Composition
          id="SceneIntro"
          component={SceneIntro}
          durationInFrames={110}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ScenePipeline"
          component={ScenePipeline}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SceneOutro"
          component={SceneOutro}
          durationInFrames={99}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="ZcodePromo"
        component={ZcodePromo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
