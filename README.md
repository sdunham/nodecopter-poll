# Nodecopter Poll

Crowdsource control of your Parrot AR Drone 2.0 with this special version of the [Node Poll](https://github.com/sdunham/node-poll) app.

## Todos

1. Make sure the barrel roll action only happens at a safe altitude.
2. Land the drone on process exit and crash?
3. Add a "DESTROY" button???

## Installing the App

1. [Install Node.js](http://sailsjs.org/#/getStarted)
2. [Install Sails](https://github.com/balderdashy/sails-docs/blob/master/getting-started/getting-started.md)
3. Clone this repo
4. Run `npm install` from the terminal in the app directory to install dependencies (may require sudo)

## Running the App

Getting things set up to connect this app to your drone is a bit mor complicated than the original Node Poll app...

1. Connect your computer to your drone
2. `cd nodecopter-poll/ardrone-wpa2`
3. Install wpa2 support to your AR drone by running: `script/install`
4. Connect to a network with: `script/connect "<wireless_network_name>" -p "<wireless_network_password>" -a 192.168.1.200`
5. Connect your computer to the same network your drone is now connected to
6. Terminal command: `telnet 192.168.1.200`
7. Terminal command: `route add default gw <wireless_router_ip> ath0`
8. Terminal command: `exit`
9. Run `sails lift` from the terminal in the app root directory
