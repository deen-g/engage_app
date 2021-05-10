/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: this is a sub component used in the article screen, it contains
a text input for sending comments based on the parent's props (id)
and updates the article screen comment based on the parent function named (get_comment_from_server)
*/
import React, {Component} from 'react';
import {View, TextInput, Text} from 'react-native';
import {Button, Card, Icon} from 'native-base';
//set_comment is the http post request sent to the server to upload the users comment
import {set_comment} from '../assets/js/actions/action';

class CommentInputComp extends Component {
  //function to get required details needed by set_comment in action.js
  async send_comment() {
    const {text} = this.state;
    let confirmation = await set_comment(this.state.id, text);
    if (confirmation === 'success') {
      //if successful refresh and set text state to emplt
      this.props.update();
      this.setState({text: ''});
    }
  }
  //init state of id from parent props and text with default empty state
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      text: '',
    };
    this.send_comment = this.send_comment.bind(this);
  }
  render() {
    // current state of text
    let {text, id} = this.state;
    return (
      <View>
        <Card>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 5}}>
              <TextInput
                style={{height: 40}}
                placeholder="Type comment here!"
                onChangeText={val => this.setState({text: val})}
                defaultValue={text}
                // text input component
              />
            </View>
            <View>
              <Button
                transparent
                onPress={() => {
                  // butten to activate send_comment on press
                  this.send_comment();
                }}>
                <Icon style={{fontSize: 18}} active name="send" />
              </Button>
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

export default CommentInputComp;
