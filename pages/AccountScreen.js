/*
Student ID: 20170158
Student Name: ABIODUN_AYANTAYO
________________________________
NOTE:
2 different loging option:
1) continue with email and password
2) login with facebook
*/
import React, {Component} from 'react';
import {Text, View, Item, Label, Input, Toast} from 'native-base';
import {Image, Button, Alert, StyleSheet} from 'react-native';
//account functions
import {push} from '../RootNavigation';
import {
  set_account,
  user_create,
  user_fb_login,
  user_login,
} from '../assets/js/actions/account';

class AccountScreen extends Component {
  create_option() {
    //alert create account option if account do not exist
    Alert.alert(
      'ENGAGE ACCOUNT',
      'No account with this email would you like to create one ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.create()},
      ],
    );
  }
  create() {
    // creating account then login directly
    const {email, password} = this.state;
    user_create({email: email, password: password}).then(data => {
      let {confirmation} = data; // new or success
      if (confirmation === 'success') {
        this.login();
      }
    });
    console.log('OK Pressed create');
  }

  // function to process login with facebook
  //todo: fb login
  fb_login() {
    user_fb_login().then(() => {
      console.log('facebook connected');
    });
  }
  // function to process login with email and password
  login() {
    const {email, password} = this.state;
    // get if user detail exist
    user_login({email: email, password: password}).then(response => {
      let {confirmation} = response; // new or success
      if (confirmation === 'new') {
        // alert option to create
        this.create_option();
      }
      if (confirmation === 'success') {
        // alert option to create
        let account = response.data;
        account.is_login = true;
        set_account(response.data).then(obj => {
          if (obj) {
            push('Start');
          }
        });
      }
    });
  }
  constructor() {
    super();
    //default login details
    this.state = {email: 'demo@gmail.com', password: 'demo'};
    // this.state = {email: '', password: ''};
    this.create_option = this.create_option.bind(this);
    this.login = this.login.bind(this);
    this.fb_login = this.fb_login.bind(this);
  }
  render() {
    return (
      <View
        style={{
          padding: 20,
          marginTop: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/logo.png')}
          style={{width: 80, height: 80}}
        />
        <Text style={{color: '#2196F3', marginTop: 20}}>ENGAGE APP</Text>
        <View style={{width: '100%', padding: 20}} />
        <Item inlineLabel>
          <Label>Email</Label>
          <Input
            value={this.state.email}
            onChangeText={val => this.setState({email: val})}
          />
        </Item>
        <Item inlineLabel last>
          <Label>Password</Label>
          <Input
            value={this.state.password}
            onChangeText={val => this.setState({password: val})}
          />
        </Item>
        <View style={{marginTop: 30}} />
        <Button title="Continue with email" onPress={this.login} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          <View>
            <Text style={{width: 50, textAlign: 'center'}}>OR</Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
        <View style={{marginTop: 10}} />
        <Button title="Login with facebook" onPress={this.fb_login} />
      </View>
    );
  }
}

export default AccountScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
