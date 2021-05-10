/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE: this screen creates article with the following criteria:
1) uploading images
2) writing article text
3) adding the category
4) adding the title.
5) saving the article
6) it Automatically add your location by default
7) the server add the timestamp before upload
//todo: verification before upload
*/
import React, {Component} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Input, Item, Separator, Textarea} from 'native-base';
import {
  add_article,
  get_object,
  save_object,
} from '../assets/js/actions/action';

class NewScreen extends Component {
  handle_choose_photo() {
    const options = {
      noData: true,
      includeBase64: true,
      maxWidth: 300,
      maxHeight: 300,
      videoQuality: 'low',
      quality: 0.5,
    };
    launchImageLibrary(options, response => {
      if (response.uri) {
        console.log(response.uri);
        this.setState({photo: response});
      }
    });
  }
  input_change(val, name) {
    this.setState({
      [name]: val,
    });
  }
  async handle_submit() {
    let account = await get_object('@storage_account');
    // add_article
    let image = this.state.photo
      ? 'data:image/png;base64,' + this.state.photo.base64
      : '';
    let article = {
      category: this.state.category,
      title: this.state.title,
      text: this.state.article,
      image: image,
      location: account.location,
    };
    add_article(article).then(async response => {
      console.log(response);
      let download_article = response.data;
      this.setState(
        {
          status: null,
          photo: null,
          title: '',
          category: '',
          article: '',
          location: '',
        },
        async () => {
          let followings = await get_object('@storage_following');
          followings.push(download_article);
          await save_object('@storage_following', followings);
        },
      );
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      photo: null,
      title: '',
      category: '',
      article: '',
      location: '',
    };
    this.handle_submit = this.handle_submit.bind(this);
    this.handle_choose_photo = this.handle_choose_photo.bind(this);
    this.input_change = this.input_change.bind(this);
  }
  render() {
    const {photo} = this.state;
    const windowHeight = Dimensions.get('window').height;
    return (
      <View style={styles.container}>
        <ScrollView style={{width: '100%'}}>
          <Separator>
            <Text style={{fontSize: 14}}>NEW ARTICLE</Text>
          </Separator>

          <View style={{marginTop: 20, width: '100%', marginBottom: 20}}>
            {photo && (
              <Image
                source={{uri: photo.uri}}
                style={{width: '100%', height: 300}}
              />
            )}
            <Button title="Choose Photo" onPress={this.handle_choose_photo} />
          </View>
          <Item>
            <Input
              placeholder="Category"
              value={this.state.category}
              onChangeText={val => this.input_change(val, 'category')}
            />
          </Item>
          <Item>
            <Input
              placeholder="Title"
              value={this.state.title}
              onChangeText={val => this.input_change(val, 'title')}
              onFocus={() => {}}
            />
          </Item>
          <Item>
            <Textarea
              style={{width: '100%'}}
              rowSpan={12}
              bordered
              value={this.state.article}
              placeholder="Write article"
              onChangeText={val => this.input_change(val, 'article')}
              onFocus={() => {}}
            />
          </Item>
        </ScrollView>
        <View style={{marginTop: 20, width: '100%', marginBottom: 20}}>
          <Button
            style={{marginTop: 20, width: '100%'}}
            title="Submit"
            onPress={this.handle_submit}
          />
        </View>
      </View>
    );
  }
}

export default NewScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
