/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: this is the search input component ui located in the header component and
triggered in the header search button
in shows the text input and collect search params from the application and send
it to the server via the http get request located in the action.js file.

*/
//importing lib
import React, {Component} from 'react';
import {DeviceEventEmitter, View} from 'react-native';
import {Icon, Item, Input, Button} from 'native-base';
import {ml_operation} from '../assets/js/actions/action';

class SearchInputComp extends Component {
  async search() {
    //emit is is_search_empty event to open the search result dialog box located in App.js
    DeviceEventEmitter.emit('event.is_search_empty', true);
    // get search current state
    const {search} = this.state;
    // if not empty send data to ml_operation
    if (search !== '') {
      const search_data = await ml_operation({
        type: 'request/search',
        data: this.state.search,
      });
      // this is the case where the search ui-interface closes directly refrenced
      // in the  header page
      let is_search_empty = search_data.responses.length > 0;
      if (is_search_empty) {
        this.props.close_search();
      }
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
    this.search = this.search.bind(this);
  }
  render() {
    return (
      <View>
        <Item>
          <Icon name="ios-search" />
          <Input
            placeholder="Search"
            value={this.state.search}
            onChangeText={val => this.setState({search: val})}
            //text input for search
          />
          <Button transparent onPress={this.search}>
            <Icon name="enter" />
          </Button>
        </Item>
      </View>
    );
  }
}

export default SearchInputComp;
