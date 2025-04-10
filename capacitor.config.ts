
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5382896ed8c34a3da7c6d46a64daa873',
  appName: 'zepmeds-digital-rx-hub',
  webDir: 'dist',
  server: {
    url: 'https://5382896e-d8c3-4a3d-a7c6-d46a64daa873.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      signingType: "apksigner"
    }
  }
};

export default config;
