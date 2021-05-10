/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
profile screen update the firstname lastname
and the image of the user then save it on server and local
*/
import React, {Component} from 'react';
import {Input, Item, Label} from 'native-base';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Button,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  get_object,
  logout,
  save_object,
  update_user,
} from '../assets/js/actions/action';
import {push} from '../RootNavigation';

class ProfileScreen extends Component {
  async handle_set_account() {
    const account = await get_object('@storage_account');
    this.setState({
      account: account,
      firstName: account.firstName,
      lastname: account.lastname,
      role: account.role,
      image: account.image,
      photo: null,
    });
  }
  //selecting aand converting image to base 64.
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
    //changing each text input
    this.setState({
      [name]: val,
    });
  }
  handle_submit() {
    //setting image if exist
    let image = this.state.photo
      ? 'data:image/png;base64,' + this.state.photo.base64
      : '';
    //getting user data
    let user = this.state.account;
    user.firstName = this.state.firstName;
    user.lastname = this.state.lastname;
    user.role = this.state.role;
    user.image = image;
    //updating user data
    update_user(user).then(response => {
      const account = response.data;
      //set latest data into state
      this.setState(
        {
          firstName: account.firstName,
          lastname: account.lastname,
          role: account.role,
          image: account.image,
        },
        () => {
          //local saving of user data
          save_object('@storage_account', account);
        },
      );
    });
  }
  constructor() {
    super();
    this.state = {
      account: [],
      firstName: '',
      lastname: '',
      role: '',
      image: '',
      photo: null,
    };
    this.handle_submit = this.handle_submit.bind(this);
    this.handle_choose_photo = this.handle_choose_photo.bind(this);
    this.input_change = this.input_change.bind(this);
    this.handle_set_account = this.handle_set_account.bind(this);
  }
  async componentDidMount() {
    this.handle_set_account();
    console.log(this.state.account);
  }

  render() {
    const {account, photo} = this.state;
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.handle_choose_photo}>
          <View>
            {account.image !== '' && (
              // show profile image if exist
              <Image
                source={{uri: account.image}}
                style={{width: 80, height: 80}}
              />
            )}
            {account.image === '' && (
              // show default image if  profile image do not exist
              <Image
                source={require('../assets/user.png')}
                style={{width: 80, height: 80}}
              />
            )}
          </View>
        </TouchableHighlight>
        <Text style={{color: '#2196F3', marginTop: 20}}>
          {
            this.state.firstName ? this.state.firstName : 'anonymous' // set first name or anonymous if not exist
          }
        </Text>
        <Text style={{color: '#2196F3', marginTop: 20}}>
          {account.location}
        </Text>
        <Item inlineLabel>
          <Label>Email</Label>
          <Input disabled placeholder="First Name" value={account.email} />
        </Item>
        <Item inlineLabel>
          <Label>First Name</Label>
          <Input
            placeholder="First Name"
            value={this.state.firstName}
            onChangeText={val => this.input_change(val, 'firstName')}
          />
        </Item>
        <Item inlineLabel>
          <Label>Last Name</Label>
          <Input
            placeholder="Last Name"
            value={this.state.lastname}
            onChangeText={val => this.input_change(val, 'lastname')}
          />
        </Item>
        <Item inlineLabel>
          <Label>Role</Label>
          <Input disabled placeholder="Role" value={this.state.role} />
        </Item>
        <View style={{marginTop: 20, width: '100%', marginBottom: 20}}>
          <Button
            style={{marginTop: 20, width: '100%'}}
            title="UPDATE"
            onPress={this.handle_submit}
          />
          <Text />
          <Button
            style={{marginTop: 20, width: '100%'}}
            title="Logout"
            onPress={() => {
              console.log('log out');
              logout().then(() => {
                push('Start');
              });
            }}
          />
        </View>
      </View>
    );
  }
}

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
