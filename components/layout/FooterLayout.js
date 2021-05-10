/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
the footer contains:
1). the navigation buttons for all major screens.
2). the engage AI ui-interface trigger:
2-a). long press to start engage AI ui-interface press delay 4s
2-b). short press to start listening
3). hide/show footer on keyboard on/off
*/
import React, {Component} from 'react';
import Sound from 'react-native-sound';
import {DeviceEventEmitter, StyleSheet, View, Keyboard} from 'react-native';
import {Button, Footer, FooterTab, Icon, Text} from 'native-base';
import {push} from '../../RootNavigation';
import store from '../../assets/js/store';

class FooterLayout extends Component {
  //set and emit engage AI activity
  sound(s) {
    let sound = new Sound(s, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      sound.play(async success => {
        if (!success) {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  }
  set_engage() {
    this.sound(!this.state.is_engaged ? 'on.mp3' : 'off.mp3');
    DeviceEventEmitter.emit('event.is_engaged', !this.state.is_engaged);
    this.setState({is_engaged: !this.state.is_engaged});
  }
  // hide footer on keyboard on
  _keyboardDidShow = () => {
    this.setState({keyboardStatus: true});
  };
  // show footer on keyboard off
  _keyboardDidHide = () => {
    this.setState({keyboardStatus: false});
  };
  //init state
  constructor() {
    super();
    this.state = {
      sound: null,
      is_engaged: false,
      keyboardStatus: undefined,
    };
    this.set_engage = this.set_engage.bind(this);
  }
  //add event listener for keyboard
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }
  //remove event listener for keyboard
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    //current state
    let {is_engaged} = this.state;
    return (
      <View>
        {!this.state.keyboardStatus && (
          <View style={{zIndex: 10}}>
            <View style={styles.micBody}>
              <Button
                rounded
                // long press to set engage ui
                onLongPress={() => {
                  this.set_engage();
                  console.log('long press');
                }}
                // press to emit start listening
                onPress={() => {
                  console.log(store.get_action());
                  if (is_engaged) {
                    console.log('is_engaged_listening');
                    DeviceEventEmitter.emit(
                      'event.is_engaged_listening',
                      'listening',
                    );
                  }
                  console.log('short press');
                }}
                // todo: change to 9000 for device
                delayLongPress={4000}
                // icon change based on is_engaged
                style={styles.mic}>
                <Icon
                  style={styles.micIcon}
                  name={is_engaged ? 'mic' : 'mic-outline'}
                />
              </Button>
            </View>
            <View style={{zIndex: 10}}>
              <Footer>
                <FooterTab>
                  <Button
                    vertical
                    onPress={() => {
                      //go to home
                      push('Home');
                    }}>
                    <Icon name="globe" />
                    <Text style={styles.btn_col}>Feeds</Text>
                  </Button>
                  <Button
                    vertical
                    onPress={() => {
                      //go to follow screen
                      push('Follow');
                    }}>
                    <Icon name="heart" />
                    <Text style={styles.btn_col}>Follow</Text>
                  </Button>
                  <Button vertical onPress={() => {}} />
                  <Button
                    vertical
                    onPress={() => {
                      //go to notification screen
                      push('Notice');
                    }}>
                    <Icon name="notifications" />
                    <Text style={styles.btn_col}>Notice</Text>
                  </Button>
                  <Button
                    vertical
                    onPress={() => {
                      //go to new article screen
                      push('New');
                    }}>
                    <Icon name="document-text-outline" />
                    <Text style={styles.btn_col}>New</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default FooterLayout;
const styles = StyleSheet.create({
  btn_col: {
    color: '#ffffff',
  },
  btn_mic: {
    color: '#ffffff',
    width: 70,
  },
  micBody: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginBottom: 25,
  },
  micIcon: {
    textAlign: 'center',
  },
  mic: {
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    marginLeft: 'auto',
    marginRight: 'auto',
    elevation: 9,
  },
});
