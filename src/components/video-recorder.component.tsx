import Button from '@material-ui/core/Button';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StopIcon from '@material-ui/icons/Stop';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import GetAppIcon from '@material-ui/icons/GetApp';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';

export type VideoRecordPropType = {
  onRecord?: () => {};
  onStop?: () => {};
  onPlay?: () => {};
  onPause?: () => {};
  onResume?: () => {};
  timeslice?: number;
  filename?: string;
};

export enum VideoRecorderStateEnum {
  initial,
  ready,
  recording,
  inactive,
  paused,
  unsupported,
}

export function VideoRecorder({
  onRecord,
  onStop,
  onPause,
  onPlay,
  onResume,
  timeslice,
  filename,
}: VideoRecordPropType) {
  const classes = useStyles();
  const videoElement = useRef<HTMLVideoElement>(null);
  const chunks = useRef<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoRecorderState, setVideoRecorderState] =
    useState<VideoRecorderStateEnum>(VideoRecorderStateEnum.initial);

  const record = () => {
    if (mediaRecorder) {
      if (videoElement.current) {
        videoElement.current.srcObject = mediaRecorder.stream;
        videoElement.current.play();
      }

      mediaRecorder.start(timeslice || 1000);
    }
  };

  const onMediaRecorderStart = () => {
    setVideoRecorderState(VideoRecorderStateEnum.recording);

    if (onRecord) {
      onRecord();
    }
  };

  const stop = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const onMediaRecorderStop = () => {
    const blob = new Blob(chunks.current, { type: 'video/webm' });
    const videoUrl = window.URL.createObjectURL(blob);
    setVideoUrl(videoUrl);

    if (videoElement.current) {
      videoElement.current.pause();
      videoElement.current.srcObject = null;
      videoElement.current.src = videoUrl;
    }

    chunks.current = [];

    setVideoRecorderState(VideoRecorderStateEnum.inactive);

    if (onStop) {
      onStop();
    }
  };

  const pause = () => {
    if (mediaRecorder) {
      mediaRecorder.pause();
    }
  };

  const onMediaRecorderPause = () => {
    setVideoRecorderState(VideoRecorderStateEnum.paused);

    if (onPause) {
      onPause();
    }
  };

  const resume = () => {
    if (mediaRecorder) {
      mediaRecorder.resume();
    }
  };

  const onMediaRecorderResume = () => {
    setVideoRecorderState(VideoRecorderStateEnum.recording);

    if (onResume) {
      onResume();
    }
  };

  const play = () => {
    if (videoElement && videoElement.current) {
      videoElement.current.play();
    }

    if (onPlay) {
      onPlay();
    }
  };

  const download = () => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = videoUrl;
    a.download = filename || 'videorecorder.webm';
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
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.onstart = onMediaRecorderStart;
          mediaRecorder.onstop = onMediaRecorderStop;
          mediaRecorder.onpause = onMediaRecorderPause;
          mediaRecorder.onresume = onMediaRecorderResume;
          mediaRecorder.ondataavailable = function (e) {
            chunks.current.push(e.data);
          };
          setMediaRecorder(mediaRecorder);

          if (videoElement.current) {
            videoElement.current.srcObject = stream;
            videoElement.current.play();
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
      <video
        className={classes.videoRecorder}
        ref={videoElement}
        playsInline
        autoPlay
        muted
      ></video>
      <div className={classes.toolbar}>
        {(videoRecorderState === VideoRecorderStateEnum.initial ||
          videoRecorderState === VideoRecorderStateEnum.inactive) && (
          <Button
            onClick={() => {
              record();
            }}
          >
            <VideocamIcon />
          </Button>
        )}
        {(videoRecorderState === VideoRecorderStateEnum.recording ||
          videoRecorderState === VideoRecorderStateEnum.paused) && (
          <Button
            onClick={() => {
              stop();
            }}
          >
            <StopIcon />
          </Button>
        )}
        {videoRecorderState === VideoRecorderStateEnum.recording && (
          <Button
            onClick={() => {
              pause();
            }}
          >
            <PauseCircleFilledIcon />
          </Button>
        )}
        {videoRecorderState === VideoRecorderStateEnum.paused && (
          <Button
            onClick={() => {
              resume();
            }}
          >
            <VideocamOutlinedIcon />
          </Button>
        )}
        {videoRecorderState === VideoRecorderStateEnum.inactive && (
          <Button
            onClick={() => {
              download();
            }}
          >
            <GetAppIcon />
          </Button>
        )}
        {videoRecorderState === VideoRecorderStateEnum.inactive && (
          <Button
            onClick={() => {
              play();
            }}
          >
            <PlayCircleFilledIcon />
          </Button>
        )}
      </div>
    </>
  );
}

const useStyles = makeStyles({
  videoRecorder: {
    width: '100%',
  },
  toolbar: {
    textAlign: 'center',
  },
});
