# 📱 CampusPulse — Native Android & Capacitor Mobile Engineering Guide

**Version:** 1.0.0 (Production)  
**Classification:** Mobile Engineering & Native Compilation Specification  
**Architecture:** Capacitor 8.5.0 Bridge + Android Native SDK (Java/Gradle)  
**Output Binary:** `CampusPulse.apk` (Application ID: `com.campuspulse.app`)  
**Last Updated:** September 2026  

---

## 1. Native Mobile Architecture Overview

CampusPulse is packaged as a **first-class native Android application** using **Capacitor 8.5**. Instead of running in a standard mobile browser, Capacitor embeds the application inside a hardware-accelerated Android `WebView`, wrapped in native Android lifecycle controls.

### Architectural Highlights:
1. **Live Remote / Hybrid Bridge:** In production, Capacitor connects to the deployed web URL (`APP_URL`, e.g. `https://campuspulse.netlify.app`), ensuring that any updates deployed to the web are instantly reflected in the mobile app without requiring users to download a new APK from the app store.
2. **Offline Splash & Brand Isolation:** Custom branded splash screens (`splash.png`) and launcher icons (`ic_launcher`) across all Android DPI buckets (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`).
3. **Hardware Acceleration:** Native Android scheme (`https`) and mixed content allowances enable instant camera QR scanning and video streaming.

---

## 2. Configuration Analysis (`capacitor.config.ts`)

```typescript
// capacitor.config.ts
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
```

---

## 3. Native Android Project Structure (`android/`)

The repository includes a complete, pre-configured Android Studio project:

```text
android/
├── app/
│   ├── build.gradle          # Android build specs, SDK versions (compileSdk 34, minSdk 22)
│   ├── src/main/
│   │   ├── AndroidManifest.xml # Permissions (INTERNET, CAMERA) & activity definitions
│   │   ├── java/com/campuspulse/app/
│   │   │   └── MainActivity.java # Native entry point inheriting BridgeActivity
│   │   └── res/              # Native resources
│   │       ├── drawable-*/   # Responsive splash screens (portrait & landscape)
│   │       ├── mipmap-*/     # Adaptive app launcher icons (round & square)
│   │       └── values/       # Native colors, styles, and string constants
├── build.gradle              # Top-level Gradle build configuration
├── gradle/wrapper/           # Gradle Wrapper binaries for CLI compilation
├── gradlew & gradlew.bat     # Unix & Windows execution wrappers
└── variables.gradle          # AndroidX and Capacitor plugin dependency version locks
```

---

## 4. Compiling & Building the Android APK

### 4.1 Prerequisites
- **Java Development Kit (JDK):** Version 17 or 21
- **Android SDK:** Platform 33 or 34 (installed via Android Studio or command-line tools)

### 4.2 Step 1: Sync Web Assets to Android
Whenever web configurations or icons change:
```bash
npx cap sync android
```

### 4.3 Step 2: Build Debug APK via Command Line
On Windows (PowerShell):
```powershell
cd android
.\gradlew.bat assembleDebug
```
The compiled APK will be output to:
`android/app/build/outputs/apk/debug/app-debug.apk`

### 4.4 Step 3: Build Signed Release APK
To build a signed APK or Android App Bundle (AAB) for the Google Play Store:
1. Open the `android/` directory in **Android Studio**.
2. Go to **Build > Generate Signed Bundle / APK**.
3. Select your institutional keystore (`.jks` file).
4. Select `release` build variant and click **Finish**.

---

## 5. Existing Pre-Built Binary (`CampusPulse.apk`)

A pre-compiled, production-ready APK binary is located directly at the root of the repository:
- **File:** `CampusPulse.apk` (Size: ~3.68 MB)
- **Application ID:** `com.campuspulse.app`
- **Installation:**
  1. Transfer `CampusPulse.apk` to any Android phone via USB, WhatsApp, or Google Drive.
  2. Enable *"Install unknown apps"* in Android Settings if prompted.
  3. Launch CampusPulse from the home screen for a full-screen, native campus event experience.
