
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5382896ed8c34a3da7c6d46a64daa873',
  appName: 'zepmeds-digital-rx-hub',
  webDir: 'dist',
  server: {
    url: 'https://5382896e-d8c3-4f3a-a54f-b8a80cb4cf9b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      signingType: "apksigner"
    },
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE"
    ]
  },
  ios: {
    contentInset: "always"
  }
};

export default config;
