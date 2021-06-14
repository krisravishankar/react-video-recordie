import React from 'react';
import { Story, Meta } from '@storybook/react';
import styles from './video-recordie.stories.module.css';

import {
  VideoRecordie,
  VideoRecordiePropsType,
} from '../components/video-recordie.component';

export default {
  title: 'React Video Recordie/VideoRecordie',
  component: VideoRecordie,
  argTypes: {
    mimeType: { control: 'text' },
    allowPlayback: { control: 'boolean' },
    allowDownload: { control: 'boolean' },
    filename: { control: 'text' },
    timeslice: { control: 'number' },
    onRecordingStart: { control: false },
    onRecordingComplete: { control: false },
    onPlay: { control: false },
    onPause: { control: false },
    onResume: { control: false },
  },
} as Meta;

const Template: Story<VideoRecordiePropsType> = (args) => (
  <div className={styles.storybookContainer}>
    <VideoRecordie {...args} />
  </div>
);

export const Default = Template.bind({});
