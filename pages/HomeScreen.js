/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
 * NOTE:
 * The home screen has 2 major components
 * Component called LatestArticleComp for local feed located at the top of the
 * screen for easy access to location_feeds
 * the main component for main feed which is located below the LatestArticleComp
 * this screen uses a FlatList component from react native to itemise each component
 * A working pull to refresh function is initialised to reload all data and notification from the home page
 * followed by a working code for the empty state consisting of an image and a text saying that the to article present   */
import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import {Text, Card, Separator} from 'native-base';
//getting stored data from the state manager
import store from '../assets/js/store';
//top article component
import LatestArticleComp from '../components/layout/LatestArticleComp';
//component to style all data in the list of data from the store
import ArticleItem from '../components/_items/ArticleItem';
//function for loading and managing data
import {
  app_initialisation,
  dispatch_feeds,
  get_notifications,
  get_object,
  save_object,
} from '../assets/js/actions/action';

class HomeScreen extends Component {
  //update states from store on refresh
  async on_refresh() {
    this.setState({refreshing: true});
    //get account
    let account = await get_object('@storage_account');
    //get connection
    const connection = store.get_connection();
    //do initialisation reference in start screen
    const response = await app_initialisation(account);
    await get_notifications();
    if (connection) {
      //do update from server in start screen
      let feed = response[0].data.data;
      let location_feed = response[1].data.data;
      await save_object('@storage_feed', feed);
      await save_object('@storage_location_feed', location_feed);
      await dispatch_feeds(feed, location_feed);
    }
    this.on_get_articles();
    this.setState({refreshing: false});
  }
  //function to update state on emit article provided by flux emitter
  on_get_articles() {
    this.setState({articles: store.get_articles()});
  }
  constructor() {
    super();
    this.state = {
      refreshing: false,
      articles: store.get_articles(),
    };
    this.on_refresh = this.on_refresh.bind(this);
    this.on_get_articles = this.on_get_articles.bind(this);
  }
  componentDidMount() {
    //add update article state Listener when component mount
    store.on('emit_articles', this.on_get_articles);
  }
  componentWillUnmount() {
    //remove added article state Listener when component un-mount
    store.removeListener('emit_articles', this.on_get_articles);
  }

  render() {
    //the item component rendered from the list of articles
    const renderItem = ({item}) => <ArticleItem article={item} />;
    //get updated state on emit_article
    let {articles} = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={articles}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListHeaderComponent={
              <View>
                <Separator>
                  <Text style={{fontSize: 14}}>HOME</Text>
                </Separator>
                <LatestArticleComp />
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.on_refresh}
              />
            }
            ListEmptyComponent={() =>
              !articles.length ? (
                <View style={styles.emptyMessageStyle}>
                  <Image
                    source={require('../assets/no_notification.png')}
                    style={{width: 100, height: 100}}
                  />
                  <Text>No articles available</Text>
                </View>
              ) : null
            }
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default HomeScreen;
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
