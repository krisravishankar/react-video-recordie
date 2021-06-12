# react-video-recordie

> Video Recorder in React using MediaRecorder API

[![NPM](https://img.shields.io/npm/v/react-video-recordie.svg)](https://www.npmjs.com/package/react-video-recordie) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Netlify Status](https://api.netlify.com/api/v1/badges/6ab428ac-c45a-4938-974a-6f8b9a3f9af4/deploy-status)](https://app.netlify.com/sites/react-video-recordie/deploys)

## Install

Install via npm

```bash
npm install react-video-recordie
```

or via yarn

```bash
yarn add react-video-recordie
```

## Demo

Check out the [Storybook](https://react-video-recordie.netlify.app) for a demo.

## Usage

```tsx
import React, { Component } from 'react';

import { VideoRecordie } from 'react-video-recordie';

class Example extends Component {
  render() {
    return <VideoRecordie />;
  }
}
```

### Options/Props

##### onRecordingStart

A callback function that will be invoked when recording begins

type: `() => void`

##### onRecordingComplete

A callback function that will be invoked when recording ends

type: `(video: Blob, videoUrl: string) => void`

##### onPlay

A callback function that will be invoked when the recorded video is played

type: `() => void`

##### onPause

A callback function that will be invoked when the recording is paused

type: `() => void`

##### onResume

A callback function that will be invoked when the paused recording is resumed

type: `() => void`

##### mimeType

The MIME media type required for your video, defaults to 'video/webm'

type: `string`

##### allowPlayback

A boolean to enable or disable the ability to replay the recorded video

type: `boolean`

##### allowDownload

A boolean to enable or disable the ability to download the recorded video

type: `boolean`

##### filename

The name of the downloaded file, defaults to 'videorecordie.webm'

type: `string`

##### timeslice

The number of milliseconds to record into each blob, defaults to 1000 milliseconds

type: `number`

## License

MIT © [krisravishankar](https://github.com/krisravishankar)
