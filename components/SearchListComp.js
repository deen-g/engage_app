/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
This component renders the collected search item listed in the state manager store
if the display is controlled by is_search_empty variable in the App.js
if search input is not empty it renders the list in searchItem comp
remember that the application uses the ML approach to search for information provided by search input
this component calculates the  percentage similarity of each result rendering the searchItem
it displays an ListEmptyComponent if empty
*/
// import libs
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Button,
  TouchableHighlight,
  DeviceEventEmitter,
  Image,
} from 'react-native';
import {Text, Card, CardItem, Body, List} from 'native-base';
import store from '../assets/js/store';
import dispatcher from '../assets/js/dispatcher/dispatcher';
import SearchItem from './_items/SearchItem';

class SearchListComp extends Component {
  //getting search result from store and introduce the % similarities to each item(object)
  set_search_results() {
    //init empty array
    let list = [];
    //get list of search result
    const responses = store.get_search();
    //if not empty
    if (responses.length > 0) {
      //get the item with the maximum score value
      let max_post = responses.reduce((prev, current) =>
        prev.score > current.score ? prev : current,
      );
      //get the maximum score
      let max = max_post.score;
      //loop through all items
      for (let i = 0; i < responses.length; i++) {
        //get each item
        let item = responses[i];
        // extract score from item
        let {score} = item;
        //calculate % similarity
        let percent = (score / max) * 100;
        // add the round up % value and add the value to each item object as percent
        item.percent = Math.ceil(percent);
        // push the new item to preciously declared list
        list.push(item);
      }
    }
    //update the list state with the new list
    this.setState({list: list});
  }
  close_search() {
    // empty the search list in store
    dispatcher.dispatch({
      type: 'ACTION_UPDATE_SEARCH',
      data: [],
    });
    //close the ui- component
    DeviceEventEmitter.emit('event.is_search_empty', false);
  }
  constructor() {
    super();
    this.state = {
      list: [],
    };
    this.close_search = this.close_search.bind(this);
    this.set_search_results = this.set_search_results.bind(this);
  }
  //listener to get the latest search result updates me ml_operation in action.js
  //run set_search_results to calculate the percentage
  componentDidMount() {
    store.on('emit_search', this.set_search_results);
    this.set_search_results();
  }
  //remove listener
  componentWillUnmount() {
    store.removeListener('emit_search', this.set_search_results);
  }
  render() {
    //component to render each item
    const renderItem = ({item}) => (
      <SearchItem item={item} close={this.close_search} />
    );
    return (
      <View style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <View style={{flex: 7}}>
              <Text>Search result:</Text>
            </View>
            <View style={{flex: 1}}>
              <TouchableHighlight
                underlayColor="#DDDDDD"
                onPress={() => {
                  this.close_search();
                }}>
                <Text>X</Text>
              </TouchableHighlight>
            </View>
          </View>
          <Card style={{width: '100%'}}>
            <SafeAreaView>
              <List>
                <FlatList
                  data={this.state.list}
                  renderItem={renderItem}
                  keyExtractor={item => item.post.id}
                  ListEmptyComponent={() =>
                    !this.state.list.length ? (
                      <View style={styles.emptyMessageStyle}>
                        <Image
                          source={require('../assets/no_notification.png')}
                          style={{width: 100, height: 100}}
                        />
                        <Text>loading</Text>
                      </View>
                    ) : null
                  }
                />
              </List>
            </SafeAreaView>
          </Card>
        </View>
      </View>
    );
  }
}

export default SearchListComp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    marginTop: 105,
    marginBottom: 20,
    padding: 10,
    zIndex: 30000,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  emptyMessageStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '20%',
    backgroundColor: '#ffffff',
  },
});
