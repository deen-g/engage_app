/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
this is a search item component that displays data based on parent props
it displays title, category,comment and following count, date, and percentage similarities
and colo code each similarities based on how high the value:
% value > 80% = green
% value < 80% %% >40% = blue
% value < 40% = red
*/
import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {ListItem, Body} from 'native-base';
import {push} from '../../RootNavigation';

class SearchItem extends Component {
  close() {
    this.props.close();
  }
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
    };
    this.close = this.close.bind(this);
  }
  componentDidMount() {
    console.log(this.props.item);
  }

  render() {
    const {item} = this.props;
    return (
      <ListItem>
        <TouchableHighlight
          style={{width: '100%'}}
          underlayColor="#DDDDDD"
          onPress={() => {
            push('Article', {id: item.post.id});
            this.close();
          }}>
          <Body>
            <Text>{item.post.title.toUpperCase()}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 3}}>
                <Text note>
                  {item.post.numComments} comments | {item.post.category} |{' '}
                  {item.post.location}|
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color:
                      item.percent > 80
                        ? 'green'
                        : item.percent < 40
                        ? 'red'
                        : 'blue',
                  }}>
                  {item.percent}% match
                </Text>
              </View>
            </View>
          </Body>
        </TouchableHighlight>
      </ListItem>
    );
  }
}

export default SearchItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
