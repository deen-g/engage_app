/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
this is the comment item comp rendered by the comment flat list comp cocated in the
article screen. it shoes the user image, username, date created, and the comment
the user image show a default image if the user image is empty and anonymous if
the user firstname id empty

*/
import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {ListItem, Thumbnail, Left, Body, Right} from 'native-base';
import moment from 'moment';

class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
    };
  }
  componentDidMount() {}

  render() {
    const {comment} = this.state;
    //convert date format with momment
    let date = moment(comment.timestamp, 'YYYYMMDD').fromNow();
    return (
      <View
        style={{
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
          zIndex: 3,
        }}>
        <ListItem avatar>
          {comment.user.image !== '' && (
            //show if image is present
            <Left>
              <Thumbnail source={{uri: comment.user.image}} />
            </Left>
          )}
          {comment.user.image === '' && (
            //show if image is absent
            <Left>
              <Thumbnail source={require('../../assets/user.png')} />
            </Left>
          )}
          <Body>
            {/*change to anonymous if firstName co not exist*/}
            <Text>
              {comment.user.firstName === ''
                ? //show if firstname is present
                  'anonymous'
                : comment.user.firstName}
            </Text>
            <Text note>{comment.text}</Text>
          </Body>
          <Right>
            <Text note>{date}</Text>
          </Right>
        </ListItem>
      </View>
    );
  }
}

export default CommentItem;
