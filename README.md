Shoppistant App
=====================

Always have your receipts just one click away! Organize, search and even re-print your receipts.

## How to run?

You'll need [Ionic CLI](https://github.com/driftyco/ionic-cli) to build and run the app.

To run the app on your iPhone, use:

```bash
$ ionic state reset
$ ionic platform add ios
$ ionic run ios --device
```

For Android, replace ios in the command above with 'android'.

## How to release?

   change config.xml and bump up the version

   ionic build --release android
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../shoppistant-app/release-key.jks platforms/android/build/outputs/apk/android-release-unsigned.apk "shoppistant android release key"
   $ANDROID_HOME/build-tools/21.1.1/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk shoppistant.apk
## Issues
Please report any issues to: https://github.com/shoppistant/shoppistant-app/issues
