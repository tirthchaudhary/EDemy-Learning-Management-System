import Youtube from "react-youtube";
import React from "react";

const PlayerOrThumbnail = ({ playerData, CourseData }) => {
  // Prepend backend URL if the thumbnail is a local file path
  const thumbnailUrl = CourseData.courseThumbnail.startsWith('http')
    ? CourseData.courseThumbnail
    : `http://localhost:3000/${CourseData.courseThumbnail}`;

  return playerData
    ? <Youtube
      key={playerData.videoId}
      videoId={playerData.videoId}
      opts={{ playerVars: { autoplay: 1 } }}
      iframeClassName='w-full aspect-video'
    />
    : <img
      src={thumbnailUrl}
      alt={CourseData.courseTitle}
      className='w-full aspect-video object-cover'
    />
}

export default PlayerOrThumbnail;
