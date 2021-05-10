/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
the header contains:
1). the logo of engage app
2). the search function
3). the engage AI ui-interface
4). the profile navigation button
*/
import React, {Component} from 'react';
import {View, Image, DeviceEventEmitter} from 'react-native';
import {Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import {push} from '../../RootNavigation';
import SearchInputComp from '../SearchInputComp';
import EngageComp from '../EngageComp';
import dispatcher from '../../assets/js/dispatcher/dispatcher';

class HeaderLayout extends Component {
  //this toggle the engage AI ui-interface
  set_engage(is_engaged) {
    this.setState({is_engaged: is_engaged});
  }
  //this toggle the engage search ui-interface
  toggle_search() {
    let {is_search_open} = this.state;
    if (!is_search_open) {
      dispatcher.dispatch({
        type: 'ACTION_UPDATE_SEARCH',
        data: [],
      });
      DeviceEventEmitter.emit('event.is_search_empty', false);
    }
    this.setState({is_search_open: !is_search_open});
  }
  //this closes the  search ui-interface used in some cases
  close_search() {
    this.setState({is_search_open: false});
  }
  //init of search and engage AI
  constructor() {
    super();
    this.state = {
      is_search_open: false,
      is_engaged: false,
    };
    this.toggle_search = this.toggle_search.bind(this);
    this.close_search = this.close_search.bind(this);
    this.set_engage = this.set_engage.bind(this);
  }
  //add event listener to trigger the engage ui-interface. trigger is located in the footer layout
  componentDidMount() {
    DeviceEventEmitter.addListener('event.is_engaged', this.set_engage);
  }
  //remove event listener to trigger the engage ui-interface.
  componentWillUnmount() {
    DeviceEventEmitter.removeListener('event.is_engaged', this.set_engage);
  }

  render() {
    //get updated state
    let {is_search_open, is_engaged} = this.state;
    return (
      <View>
        <Header>
          <Left>
            <Image
              source={require('../../assets/logo.png')}
              style={{width: 30, height: 30}}
            />
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => {
                // toggle search ui
                this.toggle_search();
              }}>
              <Icon name="search" />
            </Button>
            <Button
              transparent
              onPress={() => {
                //go to profile
                push('Profile');
              }}>
              <Icon type="FontAwesome5" name="user-circle" />
            </Button>
          </Right>
        </Header>
        <View>
          {is_search_open && (
            // show if is is_search_open is true
            <SearchInputComp close_search={this.close_search} />
          )}
        </View>
        <View>
          {is_engaged && (
            // show if is is_engaged is true
            <EngageComp />
          )}
        </View>
      </View>
    );
  }
}

export default HeaderLayout;
