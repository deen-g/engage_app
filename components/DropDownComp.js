/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
This component is used in the article screen, it helps with the saving an sharing of currently
viewed article.
it gets updates on current saved articles and detect if the current screen
 article is saved or not and act accordingly.
*/
//importing lib.
import React, {Component} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {View, Linking} from 'react-native';
import {Icon, Input, Item, Text} from 'native-base';
import Dialog from 'react-native-dialog';
import store from '../assets/js/store';
import {
  follow_article,
  get_object,
  remove_object,
  save_object,
} from '../assets/js/actions/action';

class DropDownComp extends Component {
  // async function that confirms if the current article is currently saved or not
  // and update the state is_follow accordingly
  async is_follow() {
    const {id} = this.state;
    const followings = await get_object('@storage_following');
    if (followings) {
      let follow = followings.find(item => item.id === id);
      this.setState({is_follow: follow ? true : false});
    }
  }
  // async save function saves the article to the the storage_following local storage
  handle_submit() {
    const {article, content} = this.state;
    let facebookParameters = [];

    const facebookShareURL =
      'https://server-moa9m2.turbo360-vertex.com/share/EJ5BXsTgFr43dx4Y';
    facebookParameters.push('quote=' + encodeURI(content));
    facebookParameters.push('u=' + encodeURI(facebookShareURL));

    console.log(facebookParameters);
    const url =
      'https://www.facebook.com/sharer/sharer.php?' +
      facebookParameters.join('&');
    Linking.openURL(url)
      .then(data => {
        this.handle_cancel();
        console.log('Facebook Opened');
      })
      .catch(() => {
        console.log('Something went wrong');
      });
  }
  handle_cancel() {
    this.setState({visible: false});
  }
  async save() {
    /*update followers in server and save article in local*/
    const id = this.state.id;
    //update followers in server
    const data = await follow_article(id);
    if (data.confirmation === 'success') {
      // get stored article if exist
      let followings = await get_object('@storage_following');
      followings = followings ? followings : [];
      // get feeds and local_feeds from state manager
      const feeds = store.get_articles();
      const local_feeds = store.get_location_articles();
      // combine both feeds as article
      let articles = feeds.concat(local_feeds);
      // find article in articles
      let article = articles.find(item => {
        return item.id === id;
      });
      // check if followings is empty
      if (followings.length > 0) {
        // remove if followings has article
        followings = (await followings).filter(item => item.id !== id);
      }
      // add with new update
      (await followings).push(data.update);
      // save in local storage
      save_object('@storage_following', followings).then(() => {
        this.is_follow();
      });
    }
  }
  async share() {
    this.setState({visible: true, article: store.get_current_article()});
  }
  async process_options(option) {
    if (option === 'save') {
      await this.save();
    }
    if (option === 'share') {
      await this.share();
    }
    this.setState({
      action: option,
    });
  }
  //init of the state
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      is_follow: false,
      id: props.id,
      action: 'new',
      article: store.get_current_article(),
      content: '',
    };
    this.share = this.share.bind(this);
    this.handle_submit = this.handle_submit.bind(this);
    this.handle_cancel = this.handle_cancel.bind(this);
    this.is_follow = this.is_follow.bind(this);
    this.process_options = this.process_options.bind(this);
  }
  //list of action on componnt mount
  componentDidMount() {
    this.is_follow();
  }

  render() {
    //current state of is_follow during render
    let {is_follow, visible, article} = this.state;
    // list of action buttons listed by the dropdown
    const actions = [
      {
        label: 'Save / Share',
        value: 'new',
        icon: () => (
          <Icon
            name="more-vert"
            type="MaterialIcons"
            style={{fontSize: 11, color: '#2196F3'}}
          />
        ),
      },
      {
        //update article state based on is_follow
        label: is_follow ? 'Saved' : 'Save',
        //left out for presentation
        // disable: is_follow,
        value: 'save',
        icon: () => (
          <Icon
            name={is_follow ? 'check-circle' : 'save'}
            type="FontAwesome5"
            style={{fontSize: 11, color: '#2196F3'}}
          />
        ),
      },
      {
        label: 'Share',
        value: 'share',
        icon: () => (
          <Icon
            type="FontAwesome"
            name="share-square-o"
            style={{fontSize: 11, color: '#2196F3'}}
          />
        ),
      },
    ];
    return (
      <View>
        <DropDownPicker
          items={actions}
          labelStyle={{color: '#2196F3'}}
          defaultValue={this.state.action}
          containerStyle={{height: 30}}
          style={{backgroundColor: '#fafafa', paddingLeft: 100}}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => this.process_options(item.value)}
        />
        <Dialog.Container visible={visible}>
          <Dialog.Title>Share on facebook</Dialog.Title>
          <Dialog.Description>{article.title} </Dialog.Description>
          <Item inlineLabel>
            <Input
              value={this.state.content}
              onChangeText={val => this.setState({content: val})}
            />
          </Item>
          <Dialog.Button label="Cancel" onPress={this.handle_cancel} />
          <Dialog.Button label="share" onPress={this.handle_submit} />
        </Dialog.Container>
      </View>
    );
  }
}

export default DropDownComp;
