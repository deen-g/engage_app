/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: This is the part of the application that handles the engage AI.
Engage AI is the process that gives meaning to users action and respond accordingly.
it uses:
 The text-to-speech library
 The speech-to-text library
 The Machine learning algorithm gotten from the server to gives the best reaction
 to users action.
 The logic:
 speech-to-text: say something...
 En: begin process...
 En: respond...
 [getting required response from the server and process the action accordingly]
 En: respond with required action.
 A simple conversation with the engage was:
 User: hello..
 En: Hello, how do you do ?..
 User: I am fine.
 En: do you want to do something ?
 User: No.
 En: Okay.

*/
import React, {Component} from 'react';
import Voice from '@react-native-voice/voice';
import {Card, CardItem, Body} from 'native-base';
import {Text, View, DeviceEventEmitter, Image} from 'react-native';
//all functions associated with the processing of engage response
import {process_engage} from '../assets/js/actions/engage';
import store from '../assets/js/store';
import {speaking} from '../assets/js/actions/action';
import dispatcher from '../assets/js/dispatcher/dispatcher';
class EngageComp extends Component {
  // Voice event listener function
  onSpeechStart = e => {
    //reset response and start listening
    this.setState({
      response: '',
      started: true,
    });
  };
  onSpeechRecognized = e => {
    console.log('onSpeechRecognized');
  };
  onSpeechEnd = e => {
    // notify engage to start processing
    this.setState({
      started: false,
    });
  };
  onSpeechError = e => {
    //reset all states
    this.setState({
      started: false,
      pitch: '',
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    //the complete result is provided
    this.setState({
      pitch: 'processing',
      results: e.value,
    });
    //Ai takes over the response
    process_engage(e.value[0]).then(async response => {
      this.setState({pitch: '', response: response});
      if (response === 'yes I can Read this article') {
        const article = store.get_current_article();
        const statement =
          'Title: ' +
          article.title +
          ' article: ' +
          article.text +
          '.  end of article';
        await speaking(statement);
      } else {
        await speaking(response);
      }
    });
  };
  onSpeechPartialResults = e => {
    //this shows show the user speech converted in text
    this.setState({
      partialResults: e.value,
    });
  };
  onSpeechVolumeChanged = e => {
    // this recognises the speech pitch and converts it into visual aid
    let pitch = '';
    let value = e.value;
    value = value * 2;
    let x = Math.abs(Math.floor(value));
    for (let i = 0; i < x; i++) {
      pitch = pitch + '.';
    }
    this.setState({
      pitch: pitch,
    });
  };
  constructor() {
    super();
    this.state = {
      response: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
    };
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }
  _startRecognizing = async () => {
    //activate the speech recognition plugin
    this.setState({
      pitch: '',
      error: '',
      started: false,
      results: [],
      partialResults: [],
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };
  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      pitch: '',
      error: '',
      started: false,
      results: [],
      partialResults: [],
    });
  };

  componentDidMount() {
    dispatcher.dispatch({
      type: 'ACTION_UPDATE_ENGAGE_ACTION',
      data: 'statement',
    });
    //listens to the microphone button at the footer
    DeviceEventEmitter.addListener(
      'event.is_engaged_listening',
      this._startRecognizing,
    );
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  render() {
    let {started, pitch, response, partialResults, results} = this.state;
    return (
      <View>
        <Card>
          <CardItem>
            <Body>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <View style={{flex: 1}}>
                  {pitch === 'processing' && (
                    <Image
                      source={require('../assets/en.gif')}
                      style={{width: 10, height: 10}}
                    />
                  )}
                  {pitch !== 'processing' && (
                    <Image
                      source={require('../assets/en-b.png')}
                      style={{width: 11, height: 11}}
                    />
                  )}
                </View>
                <View style={{flex: 27}}>
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={{flex: pitch === '' ? 1 : 3}}>
                      {pitch === '' && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontStyle: 'italic',
                            color: '#2196F3',
                          }}>
                          gage:
                        </Text>
                      )}
                      {pitch !== '' && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontStyle: 'italic',
                            color: '#2196F3',
                          }}>
                          | {pitch}:
                        </Text>
                      )}
                    </View>
                    <View style={{flex: pitch === '' ? 13 : 11}}>
                      {response !== '' && (
                        <Text style={{fontSize: 10, color: '#2196F3'}}>
                          {response}
                        </Text>
                      )}
                      {partialResults.length > 0 && (
                        <View>
                          {results.length > 0 && (
                            <Text style={{fontSize: 10, fontStyle: 'italic'}}>
                              {results[0]}
                            </Text>
                          )}
                          {results.length < 1 && (
                            <Text style={{fontSize: 10, fontStyle: 'italic'}}>
                              {partialResults[0]}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }
}
export default EngageComp;
