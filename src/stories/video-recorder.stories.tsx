import React from 'react';
import { Story, Meta } from '@storybook/react';

import {
  VideoRecorder,
  VideoRecordPropType as VideoRecorderPropsType,
} from '../components/video-recorder.component';

export default {
  title: 'React Video Recorder/VideoRecorder',
  component: VideoRecorder,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<VideoRecorderPropsType> = () => <VideoRecorder />;

export const Default = Template.bind({});
Default.args = {
  primary: true,
  label: 'Button',
};
