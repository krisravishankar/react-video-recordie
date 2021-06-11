import Button from '@material-ui/core/Button';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StopIcon from '@material-ui/icons/Stop';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import GetAppIcon from '@material-ui/icons/GetApp';

export type VideoRecordPropType = {
  onRecord?: () => {};
  onStop?: () => {};
  onPlay?: () => {};
  onPause?: () => {};
  timeslice?: number;
};

export function VideoRecorder({
  onRecord,
  onStop,
  onPause,
  onPlay,
  timeslice,
}: VideoRecordPropType) {
  const video = useRef<HTMLVideoElement>(null);
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const chunks = useRef<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  let mediaRecorder: MediaRecorder;

  const record = () => {
    mediaRecorder.start(timeslice || 1000);

    if (onRecord) {
      onRecord();
    }
  };

  const onMediaRecorderStop = () => {
    const blob = new Blob(chunks.current, { type: 'video/webm' });
    const videoUrl = window.URL.createObjectURL(blob);
    setVideoUrl(videoUrl);

    if (videoPlayer.current) {
      videoPlayer.current.src = videoUrl;
    }

    chunks.current = [];

    if (onStop) {
      onStop();
    }
  };

  const stop = () => {
    mediaRecorder.stop();
  };

  const pause = () => {
    mediaRecorder.pause();

    if (onPause) {
      onPause();
    }
  };

  const play = () => {
    if (videoPlayer && videoPlayer.current) {
      videoPlayer.current.play();
    }

    if (onPlay) {
      onPlay();
    }
  };

  const download = () => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = videoUrl;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(videoUrl);
    }, 100);
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then(function (stream) {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.onstop = onMediaRecorderStop;
          mediaRecorder.ondataavailable = function (e) {
            chunks.current.push(e.data);
          };
          if (video.current) {
            video.current.srcObject = stream;
            video.current.play();
          }
        })
        .catch(function (err) {
          console.log('The following getUserMedia error occurred: ' + err);
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }, []);

  return (
    <>
      <video ref={video} playsInline autoPlay muted></video>
      <div>
        <Button
          onClick={() => {
            record();
          }}
        >
          <FiberManualRecordIcon />
        </Button>
        <Button
          onClick={() => {
            stop();
          }}
        >
          <StopIcon />
        </Button>
        <Button
          onClick={() => {
            pause();
          }}
        >
          <PauseCircleFilledIcon />
        </Button>
        <Button
          onClick={() => {
            download();
          }}
        >
          <GetAppIcon />
        </Button>
        <Button
          onClick={() => {
            play();
          }}
        >
          <PlayCircleFilledIcon />
        </Button>
      </div>
      <video ref={videoPlayer} playsInline muted></video>
    </>
  );
}
