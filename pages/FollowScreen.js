/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: this is the follow screen.
it gets  stored article from the local storage and display it
if empty it displays an empty state and it uses the same component as the home
page to render item list
*/
import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {get_object} from '../assets/js/actions/action';
import ArticleItem from '../components/_items/ArticleItem';
import {Separator} from 'native-base';

class FollowScreen extends Component {
  async get_articles() {
    let articles = await get_object('@storage_following');
    articles = articles ? articles : [];
    console.log(articles);
    this.setState({articles: articles});
  }
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
    };
    this.get_articles = this.get_articles.bind(this);
  }
  componentDidMount() {
    this.get_articles();
  }
  render() {
    const {articles} = this.state;
    const renderItem = ({item}) => <ArticleItem article={item} />;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={articles}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListHeaderComponent={
              <Separator>
                <Text>FOLLOWING</Text>
              </Separator>
            }
            ListEmptyComponent={() =>
              articles.length < 1 ? (
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

export default FollowScreen;
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
