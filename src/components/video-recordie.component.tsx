import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import styles from './video-recordie.module.css';
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
        <div className={styles.error}>
          This feature is not supported on your browser :(
        </div>
      )}
      {videoRecorderState === VideoRecorderStateEnum.error && (
        <div className={styles.error}>
          {`Oops, there was an error while recording video. ${error}`}
        </div>
      )}
      <video
        className={styles.videoRecorder}
        ref={videoElement}
        playsInline
        autoPlay
        muted
      ></video>
      <div className={styles.toolbar}>
        {(videoRecorderState === VideoRecorderStateEnum.initial ||
          videoRecorderState === VideoRecorderStateEnum.inactive) && (
          <button
            className={styles.button}
            onClick={() => {
              record();
            }}
          >
            <VideoIcon />
          </button>
        )}
        {(videoRecorderState === VideoRecorderStateEnum.recording ||
          videoRecorderState === VideoRecorderStateEnum.paused) && (
          <button
            className={styles.button}
            onClick={() => {
              stop();
            }}
          >
            <StopIcon />
          </button>
        )}
        {videoRecorderState === VideoRecorderStateEnum.recording && (
          <button
            className={styles.button}
            onClick={() => {
              pause();
            }}
          >
            <PauseIcon />
          </button>
        )}
        {videoRecorderState === VideoRecorderStateEnum.paused && (
          <button
            className={styles.button}
            onClick={() => {
              resume();
            }}
          >
            <VideoIcon />
          </button>
        )}
        {allowDownload &&
          videoRecorderState === VideoRecorderStateEnum.inactive && (
            <button
              className={styles.button}
              onClick={() => {
                download();
              }}
            >
              <DownloadIcon />
            </button>
          )}
        {allowPlayback &&
          videoRecorderState === VideoRecorderStateEnum.inactive && (
            <button
              className={styles.button}
              onClick={() => {
                play();
              }}
            >
              <PlayIcon />
            </button>
          )}
      </div>
    </React.Fragment>
  );
}
