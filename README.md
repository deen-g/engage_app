### Engage app
    Student ID: 20170158
    Student Name: ABIODUN AYANTAYO
________________________________
    Module Title: Advanced Mobile Computing
    Module Code: CMP7163
    Assessment Title: Design and Implementation of a 
    Cross-platform Mobile Application
    Assessment: CWRK001
    School: Computing and Digital Technology
    Module Co-ordinator: Harjinder Singh
## Table of Contents

  - [Prerequisite](#Prerequisite)
  - [Setup](#Setup)
  - [Structure](#Structure)
  - [License](#License)
### Prerequisite
    [node -v] v14.16.0
    [npm -v] 6.14.11
    [turbo360 -cli] https://docs.turbo360.co/
    [facebook account] https://developers.facebook.com/

> **NOTE:**  Android Version
> - buildToolsVersion = "29.0.3"
> - minSdkVersion = 21 
> - compileSdkVersion = 30 
> - targetSdkVersion = 29 
> - ndkVersion = "20.1.5948944"
> 
### Setup
- Unzip `app` to a location 
- Unzip `server` to a location
- Open `app & server` in webstorm
- In `server` folder
- Install using npm in the terminal:
```bash
$ npm install
```
Start server
```bash
$  turbo devserver
```

> **NOTE:**  The Turbo 360 platform is the environment used for creating and deploying this Node/Express backend rest-api.
> make sure the server is connected the output will look like the details below.

- Successful connection for `server`
```bash
Turbo dev server running on http://localhost:3000
Open this address in a browswer to view your project.
This is a local environment for testing and is NOT actually live on the internet.
To turn off server: CONTROL-C
```
> **NOTE:** The server url must be the same as the variable: `baseURL` in the `app/assets/js/utils/index.js` file
- In the terminal cd `/app`
- Install using npm :
```bash
$ npm install
```
- link dependencies
```bash
$  react-native link
```
- run android on emulator / mobile phone
```bash
$  react-native run-android
```
- Successful build for `app`
```bash
BUILD SUCCESSFUL in 16s
233 actionable tasks: 2 executed, 231 up-to-date
info Connecting to the development server...
8081
info Starting the app on "****************"...
Starting: Intent { cmp=com.app/.MainActivity }
✨  Done in 20.89s.

Process finished with exit code 0
```
> **NOTE:** `mobile phone is prefered` this application uses voice control, 
> which requires a mobile phone with a working microphone.

### Structure
```bash
-File structure-{point of interest}:
-app
    -assets
        -js
            -actions
                -[list]: reusable http js files
            -store
                -[list]: state management store
             -utils
                 -[list]: reusable js files
        -sounds
            -[list]: the on and off sound files
        -[list]: image and logos
    -android
    -ios
    -components
        -_items
            -[list]: all components used for iteration within sub components
        -layouts
            -[list]: the header and the footer reusable component
     -pages
            -[list]: all main screens in the App.js enter point
    -App.js
```
### License

[BCU](LICENSE)
