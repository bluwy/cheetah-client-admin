import type { UserConfig } from 'vite';
import reactPlugin from 'vite-plugin-react';

const config: UserConfig = {
  jsx: 'react',
  plugins: [reactPlugin],
};

export default config;
