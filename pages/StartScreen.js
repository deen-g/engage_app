/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: Following the explanation provided in the App.js this is the initialisation
of data both for online or off line connection state.
this page manages the login status and load data for the application.
this is the most important screen of the application
a step by step walk true is provided.
summary: the screen process loading data on 4 different scenarios:
1. if connected and has account
2. if connected but no account
3. if not connected but has account
4. if not connected but and no account
this enables the application to work perfectly on when offline and demonstrate the
management of on an off device data management.
*/
// import external liberties
import React, {Component} from 'react';
//progress indicator lib
import * as Progress from 'react-native-progress';
import {Image, View, DeviceEventEmitter, Button} from 'react-native';
import {Text} from 'native-base';
//lib for account actions before login and main actions after login and utilities for both
import {check_account, set_account} from '../assets/js/actions/account';
import {
  app_initialisation,
  dispatch_feeds,
  get_notifications,
  get_object,
  save_object,
} from '../assets/js/actions/action';
import * as utils from '../assets/js/utils';
import {push} from '../RootNavigation';

class StartScreen extends Component {
  //increase loading state on process completed
  progress(int) {
    let {progress} = this.state;
    progress = progress + int / 10;
    // console.log(progress);
    this.setState({progress: progress});
  }
  //initial state progress for the indicator below: complete is 10 stages,
  //isConnected to trigger offline or online state
  //isReady  changes when complete init of the above.
  constructor() {
    super();
    this.interval = null;
    this.state = {
      progress: 0,
      isConnected: false,
      isReady: false,
    };
    this.progress = this.progress.bind(this);
  }
  componentDidMount() {
    //retrieve account info if exist
    check_account().then(account => {
      //progress stage 1
      this.progress(1);
      //check if isConnected to the internet
      let subscribe = utils.check_network();
      subscribe.then(async state => {
        //progress stage 2
        this.progress(1);
        //set isConnected state for future references
        this.setState({isConnected: state.isConnected});
        if (state.isConnected) {
          //if isConnected is true it is online false offline
          //get current location co-ordinate
          utils.check_location().then(location => {
            //progress stage 3
            this.progress(1);
            //get location data from geocode convert long and lat to city name
            utils.get_location(location).then(location_data => {
              //progress stage 4
              this.progress(1);
              account.location = location_data; //set latest location
              let {is_login} = account; // get login status
              if (is_login) {
                // if account is already stored locally
                //update account local storage
                set_account(account).then(data => {
                  //progress stage 5
                  this.progress(1);
                  // load update home screen data, notification and local data
                  // get 10 general feed and 5 feed based on location (location_feed)
                  app_initialisation(data).then(async response => {
                    //progress stage 6
                    this.progress(1);
                    // selected feed and location_feed from back end
                    let feed = response[0].data.data;
                    let location_feed = response[1].data.data;
                    // store feed data to local storage
                    await save_object('@storage_feed', feed);
                    //progress stage 7
                    this.progress(1);
                    // store location_feed data to local storage
                    await save_object('@storage_location_feed', location_feed);
                    //progress stage 8
                    this.progress(1);
                    // update state manager
                    await dispatch_feeds(feed, location_feed);
                    //progress stage 9
                    this.progress(1);
                    //process latest notification for notification page
                    await get_notifications();
                    //progress stage 10
                    this.progress(1);
                    // go to home screen if all 10 process is complete
                    if (this.state.progress > 0.9) {
                      push('Home');
                      // prompt application to show header and footer in App.js
                      DeviceEventEmitter.emit('event.ready', true);
                    }
                  });
                });
              } else {
                //it is connected but no account installed
                // back to account
                push('Account');
              }
            });
          });
        } else {
          // if not connected
          let {is_login} = account; // get login status
          if (is_login) {
            //if account exist
            //get all existing feed and local_feed from local store
            const feed = await get_object('@storage_feed');
            const location_feed = await get_object('@storage_location_feed');
            // send above to state management
            await dispatch_feeds(feed, location_feed);
            //go to home
            push('Home');
            // prompt application to show header and footer in App.js
            DeviceEventEmitter.emit('event.ready', true);
          } else {
            // if not connected and no account
            // back to account
            push('Account');
          }
        }
      });
    });
  }

  render() {
    let {progress} = this.state;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/logo.png')}
          style={{width: 60, height: 60}}
        />
        <Text>ENGAGE APPLICATION</Text>
        <Text />
        {/*<Button*/}
        {/*  title="testing"*/}
        {/*  onPress={() => {*/}
        {/*    console.log('true');*/}
        {/*    DeviceEventEmitter.emit('event.ready', true);*/}
        {/*  }}*/}
        {/*/>*/}
        <Progress.Bar size={40} progress={progress} />
      </View>
    );
  }
}

export default StartScreen;
