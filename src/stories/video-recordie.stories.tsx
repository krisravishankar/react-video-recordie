import React from 'react';
import { Story, Meta } from '@storybook/react';
import './video-recordie.css';

import {
  VideoRecordie,
  VideoRecordiePropsType,
} from '../components/video-recordie.component';

export default {
  title: 'React Video Recordie/VideoRecordie',
  component: VideoRecordie,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<VideoRecordiePropsType> = () => <VideoRecordie />;

export const Default = Template.bind({});
Default.args = {
  primary: true,
  label: 'Button',
};
