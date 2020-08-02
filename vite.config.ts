import path from 'path';
import type { UserConfig } from 'vite';
import reactPlugin from 'vite-plugin-react';

const config: UserConfig = {
  jsx: 'react',
  alias: {
    '/@/': path.resolve(__dirname, 'src'),
  },
  plugins: [reactPlugin],
};

export default config;
