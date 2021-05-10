/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
Module Title:	Advanced Mobile Computing
Module Code:	CMP7163
Assessment Title:	Design and Implementation of a Cross-platform Mobile Application
Assessment Identifier:	CWRK001
School:	Computing and Digital Technology
Module Co-ordinator:	Harjinder Singh
NOTE:
-The README.md file contain the project structure and point of interest,
-setup information of both server and client application.
-Introduction:
-This file is the entry point to the application, all main components are registered here.
-This application uses the Stack navigation to move between screens.
-The ui- uses nativebase ui theme to construct this elegant ui, details can be found here https://docs.nativebase.io/
-This application uses a promise based HTTP client rest-api called axios to transfer data from the backend.
-The axios baseURL control can found in the ./assets/js/utils/index.js.
-The axios instance for all http request can be found at ./assets/js/utils/axios.js.
-All http request made in this application was called from ./assets/js/action/actions.
-This application uses the async-storage to store local files.
-And all state data is managed by flux state manager and stored in the ./assets/js/action/store
-The first page loaded is the StartScreen, more information about the initialisation of the
application can be found there.
Engage AI:
 Process of activating AI:
-long press the microphone button at the footer and the En ui will appear at the top
-press/tap to enable listening...
-say: hello and get a reply
features
 1). Engage handles page navigation to by saying any thing relating to any page.
 2). Engage can search for articles/ like the search input
 3). Can answer any question regarding a page.
*/
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import {Container, Root, StyleProvider} from 'native-base';
import {DeviceEventEmitter} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//navigationRef enable me to create a a simple navigation in smaller component
import {navigationRef} from './RootNavigation';
// import {Text, View} from 'react-native';
//layout
import HeaderLayout from './components/layout/HeaderLayout';
import FooterLayout from './components/layout/FooterLayout';
//below are the screens
import StartScreen from './pages/StartScreen';
import HomeScreen from './pages/HomeScreen';
import AccountScreen from './pages/AccountScreen';
import ArticleScreen from './pages/ArticleScreen';
import FollowScreen from './pages/FollowScreen';
import ProfileScreen from './pages/ProfileScreen';
import NewScreen from './pages/NewScreen';
import NoticeScreen from './pages/NoticeScreen';
import SearchListComp from './components/SearchListComp';
//importing the navigation manager
const Stack = createStackNavigator();

class App extends Component {
  //function to trigger opening and closing of the search component
  is_search_empty(bool) {
    console.log('is_search_empty', bool);
    this.setState({is_search_empty: bool});
  }
  //function to trigger app state: this controls when the app goes to the home page
  app_ready(bool) {
    this.setState({isReady: bool});
  }
  //initial state false for both stages
  constructor() {
    super();
    this.state = {
      is_search_empty: false,
      isReady: false,
    };
    this.is_search_empty = this.is_search_empty.bind(this);
    this.app_ready = this.app_ready.bind(this);
  }
  // the 2 eventEmitter listens to the is_ready and is_search_empty data and
  // update using the above function accordingly
  componentDidMount() {
    DeviceEventEmitter.addListener('event.ready', this.app_ready);
    DeviceEventEmitter.addListener(
      'event.is_search_empty',
      this.is_search_empty,
    );
  }
  // removes 2 eventEmitter to prevent data leak
  componentWillUnmount() {
    DeviceEventEmitter.removeListener('event.ready', this.app_ready);
    DeviceEventEmitter.removeListener(
      'event.is_search_empty',
      this.is_search_empty,
    );
  }

  render() {
    //render state
    let {isReady, is_search_empty} = this.state;
    return (
      <Root>
        <StyleProvider style={getTheme(material)}>
          <Container>
            {/*Navigation Manager*/}
            <NavigationContainer ref={navigationRef}>
              {/*show header on isReady*/}
              {isReady && <HeaderLayout />}
              <Stack.Navigator headerMode="none" initialRouteName="Start">
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Account" component={AccountScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="New" component={NewScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Follow" component={FollowScreen} />
                <Stack.Screen name="Notice" component={NoticeScreen} />
                <Stack.Screen name="Article" component={ArticleScreen} />
              </Stack.Navigator>
              {/*show footer on isReady*/}
              {isReady && <FooterLayout />}
              {/*show search component is_search_empty is true*/}
              {is_search_empty && <SearchListComp />}
            </NavigationContainer>
          </Container>
        </StyleProvider>
      </Root>
    );
  }
}

export default App;
