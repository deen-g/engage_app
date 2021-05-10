/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: this component:
1). shows Carousel of latest data max-5
2). triggers a update location if location is not set in the account data
the other features are similar to the article component but styled different
*/
import React, {Component} from 'react';
import Carousel from 'react-native-snap-carousel';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableHighlight,
  Button,
} from 'react-native';
import {push} from '../../RootNavigation';
import {Card, CardItem, Icon} from 'native-base';
import store from '../../assets/js/store';
import {get_object} from '../../assets/js/actions/action';

class LatestArticleComp extends Component {
  async on_get_local_articles() {
    const account = await get_object('@storage_account');
    let is_location = account.location;
    is_location = is_location !== '' ? true : false;
    let articles = store.get_location_articles();
    this.setState({articles: articles, is_location: is_location});
  }
  constructor() {
    super();
    this.state = {
      articles: [],
      is_location: false,
    };
    this.state = {articles: [], _carousel: null, is_location: false};
    this.on_get_local_articles = this.on_get_local_articles.bind(this);
  }
  componentDidMount() {
    this.on_get_local_articles();
    //add Listener when component mount
    store.on('emit_local_articles', this.on_get_local_articles);
  }
  componentWillUnmount() {
    //remove added Listener when component mount
    store.removeListener('emit_local_articles', this.on_get_local_articles);
  }
  render() {
    const _renderItem = ({item, index}) => {
      return (
        <View>
          <TouchableHighlight
            onPress={() => {
              push('Article', {id: item.id});
            }}>
            <ImageBackground
              style={styles.backgroundImage}
              source={{uri: item.image}}>
              <Text numberOfLines={3} style={styles.text}>
                {item.title}
              </Text>
              <Text numberOfLines={3} style={styles.text}>
                {item.location}
              </Text>
            </ImageBackground>
          </TouchableHighlight>
        </View>
      );
    };
    let {articles, is_location} = this.state;
    const windowWidth = Dimensions.get('window').width;
    const sliderWidth = windowWidth;
    const itemWidth = windowWidth / 3;
    const itemHeight = 300;
    const sliderHeight = 300;
    return (
      <View style={{backgroundColor: '#2196F3'}}>
        {is_location && (
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={articles}
            renderItem={_renderItem}
            itemHeight={itemHeight}
            sliderHeight={sliderHeight}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            activeSlideAlignment={'start'}
          />
        )}
        {!is_location && (
          <View>
            <Card style={styles.container}>
              <CardItem>
                <Text style={{textAlign: 'center'}}>
                  To get full the features this application, your location needs
                  to be updated in your profile settings
                </Text>
              </CardItem>
              <CardItem>
                <Button
                  onPress={() => {
                    push('Profile');
                  }}
                  title="UPDATE LOCATION"
                />
              </CardItem>
            </Card>
          </View>
        )}
      </View>
    );
  }
}

export default LatestArticleComp;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 120,
    borderWidth: 4,
    borderColor: '#ffffff',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
  },
  text: {
    backgroundColor: '#ffffff',
    bottom: 0,
    opacity: 0.7,
    textAlign: 'center',
  },
});
