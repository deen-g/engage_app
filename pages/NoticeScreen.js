/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: this is the notification screen. it shows the the changes in local article
by cross-referencing each article with the server's regarding the number of
followers and the number of comments
*/
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import {List, Separator} from 'native-base';
import store from '../assets/js/store';
//each notification render component, it can slide left or right to delete or read
import NotificationItem from '../components/_items/NotificationItem';
import {get_notifications} from '../assets/js/actions/action';
class NoticeScreen extends Component {
  // function to update change from store
  set_notification() {
    this.setState({notifications: store.get_notification()});
  }
  // initial state retrieved from store
  constructor(props) {
    super(props);
    this.state = {
      notifications: store.get_notification(),
    };
    this.set_notification = this.set_notification.bind(this);
  }
  //on component mount it triggers the notification function and add a listener for changes
  componentDidMount() {
    get_notifications();
    store.on('emit_notification', this.set_notification);
  }
  //remove the event listener
  componentWillUnmount() {
    store.removeListener('emit_notification', this.set_notification);
  }
  render() {
    //the item component rendered from the list of notification
    const renderItem = ({item}) => <NotificationItem article={item} />;
    //definition of the latest notification state
    const {notifications} = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            ListHeaderComponent={
              <Separator>
                <Text>NOTIFICATIONS</Text>
              </Separator>
            }
            ListEmptyComponent={() =>
              !notifications.length ? (
                <View style={styles.emptyMessageStyle}>
                  <Image
                    source={require('../assets/no_notification.png')}
                    style={{width: 100, height: 100}}
                  />
                  <Text>No notification available</Text>
                </View>
              ) : null
            }
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
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
    marginTop: '50%',
    marginBottom: '100%',
    backgroundColor: '#ffffff',
  },
});
