import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tocchat.app',
  appName: 'TocChat',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;