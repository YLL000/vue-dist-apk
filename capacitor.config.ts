import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.agentic.app',
  appName: 'Agentic',
  webDir: 'dist',
  bundledWebRuntime: false,
  // Optional: enable live reload during dev (not for APK)
  server: {
    androidScheme: 'https',
  },
};

export default config;
