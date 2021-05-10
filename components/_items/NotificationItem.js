/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
this comp shows the change in each article shown in the notification screen
it contains the title of the article, the comment and the following count,
user has the opportunity to either slide left or slide right to delete or read
either way the article will update the local store.
*/
//import lib
import React, {Component} from 'react';
import {Animated, Button, StyleSheet, View} from 'react-native';
import {ListItem, Body, Right, Text, Icon} from 'native-base';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import store from '../../assets/js/store';
import {get_object, save_object} from '../../assets/js/actions/action';
import dispatcher from '../../assets/js/dispatcher/dispatcher';
import {push} from '../../RootNavigation';

class NotificationItem extends Component {
  // the function acts based on the slide direction
  async save_followings(direction) {
    let {article, notifications} = this.state;
    // get current following from store
    const followings = await get_object('@storage_following');
    // remove his article from following from notifications
    let notification_left = notifications.filter(item => {
      return item.id !== article.id;
    });
    //update store articles
    for (let i = 0; i < followings.length; i++) {
      if (followings[i].id === article.id) {
        if (article.type === 'follower') {
          followings[i].numFollowers = article.numFollowers;
        } else {
          console.log('canged');
          followings[i].numComments = article.numComments;
        }
      }
    }
    // save state manager
    dispatcher.dispatch({
      type: 'UPDATE_NOTIFICATION',
      data: notification_left,
    });
    // save updated data to local store
    await save_object('@storage_following', followings);
    if (direction === 'right') {
      // go to article for reading
      push('Article', {id: article.id});
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      notifications: store.get_notification(),
      article: props.article,
    };
    this.save_followings = this.save_followings.bind(this);
  }
  //swipe left render
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 60, 60, 101],
      outputRange: [-10, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{translateX: trans}],
            },
          ]}>
          <Icon
            name="trash"
            type="FontAwesome"
            style={{fontSize: 20, color: '#ffffff'}}
          />{' '}
          <Text style={{fontSize: 20, color: '#ffffff'}}>Remove</Text>{' '}
        </Animated.Text>
      </RectButton>
    );
  };
  //swipe right render
  renderRightActions = (progress, dragX) => {
    let trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.5, 0],
    });
    return (
      <RectButton style={styles.rightAction}>
        <Animated.Text
          style={[
            styles.actionRightText,
            {
              transform: [{translateX: trans}],
            },
          ]}>
          {' '}
          <Text style={{fontSize: 20, color: '#ffffff'}}>Read</Text>{' '}
          <Icon
            name="readme"
            type="FontAwesome5"
            style={{fontSize: 20, color: '#ffffff'}}
          />
        </Animated.Text>
      </RectButton>
    );
  };
  render() {
    const {article} = this.state;
    return (
      <View style={{flex: 1}}>
        <Swipeable
          onSwipeableLeftWillOpen={() => {
            this.save_followings('left');
          }}
          onSwipeableRightWillOpen={() => {
            this.save_followings('right');
          }}
          leftThreshold={100}
          rightThreshold={100}
          renderLeftActions={this.renderLeftActions}
          renderRightActions={this.renderRightActions}>
          <RectButton>
            <ListItem style={{backgroundColor: '#ffffff', marginLeft: 0}}>
              <Body>
                <Text>{article.type.toUpperCase()}</Text>
                <Text note>{article.title}</Text>
              </Body>
              <Right>
                <Text note>{article.num}</Text>
              </Right>
            </ListItem>
          </RectButton>
        </Swipeable>
      </View>
    );
  }
}

export default NotificationItem;
const styles = StyleSheet.create({
  actionText: {
    color: 'white',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingLeft: 30,
  },
  actionRightText: {
    color: 'white',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingRight: 40,
  },
  leftAction: {
    backgroundColor: '#f3214b',
    width: '100%',
  },
  rightAction: {
    backgroundColor: '#2196F3',
    width: '100%',
    alignItems: 'flex-end',
  },
});
