# Prerequisites

Must have:

- Xcode
- Android Studio
- Ruby v3.0.0+ (use rbenv to manage ruby versions)
- react-native-cli (npm install react-native-cli)

# Getting Started

install dependencies by running:

- npm run install:all

## Setup for GooglePay SDK

Github Personal Access Token (PAT) is required to download the android package `com.tyro.tyro-pay-android`.

Steps to setup the PAT:

- Navigate to GitHub page, **Profile** -> **Settings** -> **Developer Settings**
- On the left panel, select **Personal Access Token** -> **Token(classic)**
- Generate a new token with `read:package` permission
- Configure the token: authorise it for organisation `tyro`
- Store the new token as a environment variable: `export GITHUB_PACKAGES_TOKEN={YOUR_GITHUB_TOKEN}`

# Run on ios and android

For android use java 11+

Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file at 'tyro-pay-api-react-native/android/local.properties'.
Then run:
`- npm run android`

- npm run ios

# Running e2e Integration tests

Install Maestro:

- curl -Ls "https://get.maestro.mobile.dev" | bash
- brew tap facebook/fb
- brew install facebook/fb/idb-companion
  Note: Xcode must be v14+

Run Maestro to write e2e tests

https://maestro.mobile.dev/getting-started/maestro-studio

`maestro studio`

Running the tests:

- npm run test:e2e:ios (make sure to start your iOS simulator before running npm run)
- npm run test:e2e:android (make sure to start your android simulator before running)

For some tests that must be run on a real device, connect your mobile device to machine, and enable the developer options following these guides:

- ios: https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device
- android: https://developer.android.com/studio/debug/dev-options#:~:text=Enable%20USB%20debugging%20on%20your%20device,-Before%20you%20can&text=Enable%20USB%20debugging%20in%20the,Advanced%20%3E%20Developer%20Options%20%3E%20USB%20debugging

Then run the local tests:

- npm run test:local:ios
- npm run test:local:android

For testing GooglePay, you can add your google account on the device to the google group `Google Pay API Test Cards Allowlist` (https://groups.google.com/g/googlepay-test-mode-stub-data?pli=1) to enable test cards on the account.

# Releasing the Package to GitHub Packages

## Release using GitHub Action

Before releasing:

- Checkout the branch 'version-bump' which would have the latest package version pushed to it.
- Create a PR and have it reviewed/merged in.
- Go to the main master branch on GitHub and click 'Create a new release' under 'Releases' on the left hand side of the page

Releasing:

- If still prerelease check 'Set as pre-release' box, then write a description of the release and click 'Publish Release' when ready to release.
- Check the GitHub Action ran to publish the release to GitHub Packages

## Release Locally

Before releasing:

- Check/update the version in `package.json`
- Run `npm run prepack` to pack the package
- Login to the NPM Registry, replacing USERNAME with your GitHub username, TOKEN with your personal access token (classic)

```bash
$ npm login --scope=@tyro --auth-type=legacy --registry=https://npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
```

Releasing:

- Run `npm publish`
