# Kloudius Assessment with Expo (RN) 👋

  

  ## Prerequisites
  1. Ensure you have Expo setup on your machine. For the basic prerequisites, you can follow [this](https://docs.expo.dev/tutorial/create-your-first-app/) tutorial

  2. Make sure you have a Google Places API key setup with account. Follow [here](https://developers.google.com/maps/documentation/places/web-service/get-api-key) on this guide on how to obtain one. (Might concern billing, advisable to setup alerts for potential overcharge)

  3. Have Expo Go installed in your emulator/physical device (**Note**: You cannot use iOS simulators on a Windows machine)

## Get Started
1. Install dependencies
```bash

npm install

```

2. Create a new .env file in root directory and place your Google Places API key as follows:

```
EXPO_PUBLIC_WEB_PLACES_API_KEY=<YOUR_API_KEY_HERE>
```

3. Start the app

  

```bash

npx expo start

```
  4. Scan the QR Code generated on the CLI or manually input the Expo URL on your Sim/Device. For example: *exp://192.168.100.13:8081*

## How To Use App

The app essentially has only 2 Screens:
1. Home page where the Map and Search Bar is
2. History page where it can be navigated from the FloatingActionButton with the book icon

The search bar was configured to debounce the realtime search so we don't trigger API calls per letters typed.

Once the location has been found it will be mapped on the map using a marker just like Google Maps. 

The history page has all records of the search and will navigate to previously navigated locations. It is stored using react-native-async-storage on the device, therefore uninstalling the app will remove the stored data.

***Note**: For iOS, it will default to Apple Maps since the react-native-maps package is having issues related to the current Expo SDK at the time of writing (13/4/2025) and therefore ignored.* 

*Re-rolling back to SDK 51 will require an iOS sim to have the previous Expo Go ver. installed, which I cant since I am only developing using a Windows Machine + Evaluation will only count for android.*