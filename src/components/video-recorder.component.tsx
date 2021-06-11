import Button from '@material-ui/core/Button';
import React, { useRef } from 'react';
import { useEffect } from 'react';

export type VideoRecordPropType = {
  onRecord?: () => {};
  onStop?: () => {};
  onPlay?: () => {};
  onPause?: () => {};
};

export function VideoRecorder({
  onRecord,
  onStop,
  onPause,
}: VideoRecordPropType) {
  const video = useRef<HTMLVideoElement>(null);
  let mediaRecorder: MediaRecorder;

  const record = () => {
    mediaRecorder.start();
    if (onRecord) {
      onRecord();
    }
  };

  const stop = () => {
    mediaRecorder.stop();
    if (onStop) {
      onStop();
    }
  };

  const pause = () => {
    mediaRecorder.pause();
    if (onPause) {
      onPause();
    }
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
    <div>
      <Button
        onClick={() => {
          record();
        }}
      >
        Record
      </Button>
      <Button
        onClick={() => {
          stop();
        }}
      >
        Stop
      </Button>
      <Button
        onClick={() => {
          pause();
        }}
      >
        Pause
      </Button>
      <video ref={video} playsInline autoPlay muted></video>
    </div>
  );
}
