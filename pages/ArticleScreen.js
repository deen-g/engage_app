/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
each article is redirected to this screen for full details
major operation on each article occur here such as:
1): save or share article.
2): read article using test-to-speech
3): show comments from all users
4): add new comment
5): empty state for comments
*/
import React, {Component} from 'react';
import moment from 'moment';
import {
  View,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {CardItem, Left, Body, Button, Card, Icon, Text} from 'native-base';
//navigation lib
import {back, push} from '../RootNavigation';
//main article comp
import ArticleComp from '../components/ArticleComp';
// comment input component
import CommentInputComp from '../components/CommentInputComp';
//render each comment component
import CommentItem from '../components/_items/CommentItem';
//dropdown for share and save
import DropDownComp from '../components/DropDownComp';
//state manager store
import store from '../assets/js/store';
// reusable action
import {
  get_comments,
  speaking,
  speaking_stop,
} from '../assets/js/actions/action';
//send data to store
import dispatcher from '../assets/js/dispatcher/dispatcher';

class ArticleScreen extends Component {
  // get_article gets both feeds and location_feeds from store and rename the combination articles
  // then find the the correct id retrieved from sent props
  // sent the article data to store as current_article: reference (1)
  async get_article() {
    const id = this.state.id;
    // get feeds and local_feeds from state manager
    const feeds = store.get_articles();
    const local_feeds = store.get_location_articles();
    // combine both feeds as article
    let articles = feeds.concat(local_feeds);
    // find article in articles
    let article = articles.find(item => {
      return item.id === id;
    });
    dispatcher.dispatch({type: 'ACTION_UPDATE_CURRENT_ARTICLE', data: article});
    this.setState({article: article});
  }
  //get latest comment from server
  async get_comment_from_server() {
    let comments = await get_comments(this.state.id);
    comments = comments ? comments : [];
    this.setState({comments: comments});
  }
  //speak combine the title and the mani text together and
  // tells tha app to read it
  async speak() {
    const {article} = this.state;
    const statement =
      'Title: ' +
      article.title +
      ' article: ' +
      article.text +
      '.  end of article';
    const speak = await speaking(statement);
    this.setState({is_speaking: true});
  }
  // triggers reading to stop
  async stop_speak() {
    await speaking_stop();
    this.setState({is_speaking: false});
  }
  get_view_dimensions(layout) {
    const {height} = layout;
    console.log(height);
    const screenHeight = Dimensions.get('window').height;
    let flat = screenHeight - height - 170;
    this.setState({height: flat});
  }
  //shows initial stage of all state
  constructor(props) {
    super(props);
    this.state = {
      is_speaking: false,
      height: 0,
      article: [],
      comments: {},
      action: 'new',
      id: props.route.params.id,
    };
    this.get_view_dimensions = this.get_view_dimensions.bind(this);
    this.get_article = this.get_article.bind(this);
    this.get_comment_from_server = this.get_comment_from_server.bind(this);
    this.speak = this.speak.bind(this);
    this.stop_speak = this.stop_speak.bind(this);
  }
  //async latest article to store then get the data comment from server
  async componentDidMount() {
    await this.get_article();
    this.get_comment_from_server();
  }

  render() {
    //render comment item details found in comment item
    const renderItem = ({item}) => <CommentItem comment={item} />;
    //get screen height
    const screenHeight = Dimensions.get('window').height;
    //get id and article from state
    const {id, article, comments, height, is_speaking} = this.state;
    //convert date to * moment time format
    let date = moment(article.timestamp, 'YYYYMMDD').fromNow();
    //convert title to uppercase
    let title = article.title ? article.title.toUpperCase() : '';
    return (
      // <KeyboardAvoidingView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={styles.container_view}>
          <View style={{flex: 1}}>
            <Button
              style={{height: 30}}
              onPress={() => {
                back();
              }}>
              <Icon
                style={{fontSize: 9}}
                active
                type="FontAwesome5"
                name="arrow-left"
              />
              <Text style={{fontSize: 9}}>back</Text>
            </Button>
          </View>
          <View style={{flex: 4}}>
            <DropDownComp id={id} />
          </View>
        </View>
        <View style={{flex: 0}}>
          <CardItem>
            <Body>
              <Text>{title}</Text>
              <Text note>{date}</Text>
            </Body>
          </CardItem>
          <View style={{height: 1, backgroundColor: 'black'}} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 2}}>
              <Button transparent style={{height: 30}}>
                <Icon style={{fontSize: 9}} active name="thumbs-up">
                  <Text style={{fontSize: 9}}>
                    {article.numFollowers} Following
                  </Text>
                </Icon>
              </Button>
            </View>
            <View style={{flex: 2}}>
              <Button transparent style={{height: 30}}>
                <Icon style={{fontSize: 9}} active name="chatbubbles">
                  <Text style={{fontSize: 9}}>
                    {article.numComments} Comments
                  </Text>
                </Icon>
              </Button>
            </View>
            <View style={{flex: 2}}>
              {!is_speaking && (
                <Button
                  style={{height: 30}}
                  onPress={() => {
                    this.speak();
                  }}>
                  <Icon
                    style={{fontSize: 9}}
                    active
                    type="FontAwesome5"
                    name="readme">
                    <Text style={{fontSize: 9, color: '#ffffff'}}>
                      {' '}
                      Read Article
                    </Text>
                  </Icon>
                </Button>
              )}
              {is_speaking && (
                <Button
                  danger
                  style={{height: 30}}
                  onPress={() => {
                    this.stop_speak();
                  }}>
                  <Icon
                    style={{fontSize: 9}}
                    active
                    type="FontAwesome5"
                    name="readme">
                    <Text style={{fontSize: 9, color: '#ffffff'}}>
                      {' '}
                      Stop Reading
                    </Text>
                  </Icon>
                </Button>
              )}
            </View>
          </View>
          <View style={{height: 1, backgroundColor: 'black'}} />
        </View>
        <View style={{flex: 15}}>
          <SafeAreaView>
            <FlatList
              style={{height: screenHeight - 350}}
              data={comments}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ListHeaderComponent={<ArticleComp article={article} />}
              ListEmptyComponent={() =>
                comments.length < 1 ? (
                  <View style={styles.emptyMessageStyle}>
                    <Image
                      source={require('../assets/no_notification.png')}
                      style={{width: 100, height: 100}}
                    />
                    <Text>No comment available</Text>
                  </View>
                ) : null
              }
            />
          </SafeAreaView>
        </View>
        <View style={{flex: 0}}>
          <CommentInputComp id={id} update={this.get_comment_from_server} />
        </View>
      </View>
      // </KeyboardAvoidingView>
    );
  }
}

export default ArticleScreen;
const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  container_view: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    flex: 0,
  },
  emptyMessageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '20%',
    backgroundColor: '#ffffff',
  },
});
