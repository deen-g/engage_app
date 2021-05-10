/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
this is the component displayed for each article in tha home and the follow screen
it contains images, text, date, location, category, number of comment and number of followers
all values are derived from the data provided from the server.
the image the image component shows only if the image exist
*/
import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Card, CardItem, Text, Button, Icon, Body} from 'native-base';
import moment from 'moment';
import {push} from '../../RootNavigation';
class ArticleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: this.props.article,
    };
  }
  componentDidMount() {}

  render() {
    const {article} = this.state;
    let date = moment(article.timestamp, 'YYYYMMDD').fromNow();
    return (
      <View>
        <Card>
          <CardItem>
            <Body>
              <Text>{article.title.toUpperCase()}</Text>
              <Text note>
                {article.category.toUpperCase()} | {article.location}
              </Text>
            </Body>
          </CardItem>
          {article.image && (
            <CardItem cardBody>
              <Image
                source={{uri: article.image}}
                style={{height: 100, width: null, flex: 1}}
              />
            </CardItem>
          )}
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 0}}>
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
            <View style={{flex: 1}}>
              <Text style={{fontSize: 9}}>{date}</Text>
            </View>
            <View style={{flex: 2}}>
              <Button
                transparent
                style={{height: 30}}
                onPress={() => {
                  push('Article', {id: article.id});
                }}>
                <Text style={{fontSize: 9}}>More</Text>
                <Icon
                  style={{fontSize: 9}}
                  active
                  type="FontAwesome5"
                  name="arrow-right"
                />
              </Button>
            </View>
          </View>
          <CardItem>
            <Text note numberOfLines={3}>
              {article.text}
            </Text>
          </CardItem>
        </Card>
      </View>
    );
  }
}

export default ArticleItem;
