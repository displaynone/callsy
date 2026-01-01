# Callsy

Callsy is a mobile app that lets you pick “allowed” contacts for calls and enable options related to Do Not Disturb (DND) and WhatsApp notifications.

## What it does

- Lets you choose contacts from your address book and save them as “allowed”.
- Can mark those contacts as favorites to allow calls during Do Not Disturb.
- Can filter WhatsApp notifications (requires notification access).
- Stores your selection and preferences on the device.

## How it works

1. Load your contacts (with read permission).
2. Select allowed contacts and save the selection.
3. If you enable “Calls”, the app marks those contacts as favorites and guides you to allow calls during Do Not Disturb.
4. If you enable “WhatsApp”, it turns on the filter and asks for notification access.

## Android only

This app is intended for Android and relies on Android-specific features. iOS is not supported.

## Installation

Recommended requirements:

- Node.js and npm
- Android Studio or a physical Android device with USB debugging
- Expo CLI (via `npx`)

Steps:

```bash
npm install
npm run android
```

## npm scripts

- `npm start`: Start Expo.
- `npm run android`: Run the app on Android.
- `npm run android:prebuild`: Expo prebuild for Android.
- `npm run android:build`: Local EAS build for Android (profile `preview`).
- `npm run ios`: Run on iOS (not supported for Callsy).
- `npm run web`: Run the app on web.
- `npm run lingui:extract`: Extract translation messages.
- `npm run lingui:compile`: Compile translation catalogs.
