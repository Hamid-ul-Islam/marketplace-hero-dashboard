import React from "react";
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

export default function LectureVideoPreview({
  title,
  videoId,
}: {
  title: string;
  videoId: string;
}) {
  return (
    <div className="">
      <MediaPlayer title={title || "No Title"} src={`youtube/${videoId}`}>
        <MediaProvider />
        <PlyrLayout
          thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
          icons={plyrLayoutIcons}
        />
      </MediaPlayer>
    </div>
  );
}
