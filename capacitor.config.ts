import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.campuspulse.app',
  appName: 'CampusPulse',
  webDir: 'public',
  server: {
    // For local dev or remote production URL
    url: process.env.APP_URL || 'http://localhost:3000',
    cleartext: true,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0b0f19',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0b0f19',
      showSpinner: false,
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;
