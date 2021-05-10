/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
this is the component displayed article screen, purposely for reducing and arranging the codes
it contains the article image, text
all values are derived from as a prop from the parent component.
the image component shows only if the image exist
*/
//import libs
import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {Card, CardItem, Text} from 'native-base';
import moment from 'moment';

class ArticleComp extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    //getting states from the parent props
    const {article} = this.props;
    // let date = moment(article.timestamp, 'YYYYMMDD').fromNow();
    // let title = article.title ? article.title.toUpperCase() : '';
    return (
      <View>
        <Card>
          {article.image && (
            <Image
              source={{uri: article.image}}
              style={{height: 200, width: '100%'}}
            />
          )}

          <CardItem>
            <View>
              <View style={{height: 1, backgroundColor: 'black'}} />
            </View>
            <Text style={{textAlign: 'justify'}}>{article.text}</Text>
          </CardItem>
        </Card>
      </View>
    );
  }
}

export default ArticleComp;
