import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { VideoIcon } from './icons/video-icon.component';
import { PlayIcon } from './icons/play-icon.component';
import { PauseIcon } from './icons/pause-icon.component';
import { StopIcon } from './icons/stop-icon.component';
import { DownloadIcon } from './icons/download-icon.component';

export type VideoRecordiePropsType = {
  onRecordingStart?: Function;
  onRecordingComplete?: (video: Blob, videoUrl: string) => void;
  onPlay?: Function;
  onPause?: Function;
  onResume?: Function;
  mimeType?: string;
  allowPlayback?: boolean;
  allowDownload?: boolean;
  filename?: string;
  timeslice?: number;
};

export enum VideoRecorderStateEnum {
  initial,
  recording,
  inactive,
  paused,
  unsupported,
  error,
}

export function VideoRecordie({
  onRecordingStart,
  onRecordingComplete,
  onPause,
  onPlay,
  onResume,
  mimeType,
  timeslice,
  filename,
  allowDownload = true,
  allowPlayback = true,
}: VideoRecordiePropsType) {
  const defaultMimeType = 'video/webm';
  const classes = useStyles();
  const videoElement = useRef<HTMLVideoElement>(null);
  const chunks = useRef<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoRecorderState, setVideoRecorderState] =
    useState<VideoRecorderStateEnum>(VideoRecorderStateEnum.initial);
  const [error, setError] = useState<string>('');

  const getMimeType = (): string => {
    return mimeType && MediaRecorder && MediaRecorder.isTypeSupported(mimeType)
      ? mimeType
      : defaultMimeType;
  };

  const record = () => {
    if (mediaRecorder) {
      if (videoElement.current) {
        videoElement.current.srcObject = mediaRecorder.stream;
        videoElement.current.muted = true;
        videoElement.current.play();
      }

      mediaRecorder.start(timeslice || 1000);
    }
  };

  const onMediaRecorderStart = () => {
    setVideoRecorderState(VideoRecorderStateEnum.recording);

    if (onRecordingStart) {
      onRecordingStart();
    }
  };

  const stop = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const onMediaRecorderStop = () => {
    const blob = new Blob(chunks.current, { type: getMimeType() });
    const videoUrl = window.URL.createObjectURL(blob);
    setVideoUrl(videoUrl);

    if (videoElement.current) {
      videoElement.current.pause();
      videoElement.current.srcObject = null;
      videoElement.current.src = videoUrl;
    }

    chunks.current = [];

    setVideoRecorderState(VideoRecorderStateEnum.inactive);

    if (onRecordingComplete) {
      onRecordingComplete(blob, videoUrl);
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
      videoElement.current.muted = false;
      videoElement.current.play();
    }

    if (onPlay) {
      onPlay();
    }
  };

  const onMediaRecorderError = (event: MediaRecorderErrorEvent) => {
    setVideoRecorderState(VideoRecorderStateEnum.error);
    setError(event.error.name);
  };

  const download = () => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = videoUrl;
    a.download = filename || 'videorecordie.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(videoUrl);
    }, 100);
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then(function (stream) {
          const options = {
            mimeType: getMimeType(),
          };
          const mediaRecorder = new MediaRecorder(stream, options);
          mediaRecorder.onstart = onMediaRecorderStart;
          mediaRecorder.onstop = onMediaRecorderStop;
          mediaRecorder.onpause = onMediaRecorderPause;
          mediaRecorder.onresume = onMediaRecorderResume;
          mediaRecorder.onerror = onMediaRecorderError;
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
          setVideoRecorderState(VideoRecorderStateEnum.error);
          setError(err);
        });
    } else {
      setVideoRecorderState(VideoRecorderStateEnum.unsupported);
    }
  }, []);

  return (
    <React.Fragment>
      {videoRecorderState === VideoRecorderStateEnum.unsupported && (
        <div className={classes.error}>
          This feature is not supported on your browser :(
        </div>
      )}
      {videoRecorderState === VideoRecorderStateEnum.error && (
        <div className={classes.error}>
          {`Oops, there was an error while recording video. ${error}`}
        </div>
      )}
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
            <VideoIcon />
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
            <PauseIcon />
          </Button>
        )}
        {videoRecorderState === VideoRecorderStateEnum.paused && (
          <Button
            onClick={() => {
              resume();
            }}
          >
            <VideoIcon />
          </Button>
        )}
        {allowDownload &&
          videoRecorderState === VideoRecorderStateEnum.inactive && (
            <Button
              onClick={() => {
                download();
              }}
            >
              <DownloadIcon />
            </Button>
          )}
        {allowPlayback &&
          videoRecorderState === VideoRecorderStateEnum.inactive && (
            <Button
              onClick={() => {
                play();
              }}
            >
              <PlayIcon />
            </Button>
          )}
      </div>
    </React.Fragment>
  );
}

const useStyles = makeStyles({
  videoRecorder: {
    width: '100%',
  },
  toolbar: {
    textAlign: 'center',
  },
  error: {
    padding: 10,
    borderRadius: 5,
    color: 'rgb(97, 26, 21)',
    backgroundColor: 'rgb(253, 236, 234)',
  },
});
