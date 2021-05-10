//import libraries
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../utils/axios';
import store from '../store/index';
import dispatcher from '../dispatcher/dispatcher';
// async object operators
const remove_object = async item => {
  try {
    await AsyncStorage.removeItem(item);
  } catch (e) {
    // remove error
  }
};
const save_object = async (item, object) => {
  try {
    let _string = JSON.stringify(object);
    await AsyncStorage.setItem(item, _string);
    return object;
  } catch (e) {
    // remove error
  }
};
const get_object = async item => {
  try {
    const jsonValue = await AsyncStorage.getItem(item);
    return jsonValue !== [] ? JSON.parse(jsonValue) : [];
  } catch (e) {
    // read error
  }

  console.log('getMyObject Done.');
};
// dispatch latest or previously stored data to state manager
const dispatch_feeds = async (feed, location_feed) => {
  dispatcher.dispatch({type: 'ACTION_UPDATE_ARTICLES', data: feed});
  dispatcher.dispatch({
    type: 'ACTION_UPDATE_LOCATION_ARTICLES',
    data: location_feed,
  });
};
//exported functions
const get_all_post = () => {
  // get teh first 10 feed
  return instance.get('/posts/all');
};
const get_all_location_post = location => {
  // get teh first 5 feed based on location
  return instance.get('/posts/' + location + '/all');
};

//loading get_all_post and get_all_location_post
const app_initialisation = async account => {
  // get connection status from state manager storage
  const connection = store.get_connection();
  // define feed and location feed for home screen
  let feed = [];
  let location_feed = [];
  // get account from local storage
  // check if connection
  if (connection) {
    //load latest data from api
    return await Promise.all([
      get_all_post(),
      get_all_location_post(account.location),
    ]);
  } else {
    // load previously saved data if no connection
    feed = await get_object('@storage_feed');
    location_feed = await get_object('@storage_location_feed');
    //set the initialised variable
    return await dispatch_feeds(feed, location_feed);
  }
};
// const get_application
const get_comments = async id => {
  // get connection status from state manager storage
  const connection = store.get_connection();
  //  list definition
  let comments = [];
  // check if connection
  if (connection) {
    //load data from api
    const response = await instance.get('/comments/post/' + id);
    comments = response.data.data;
    return comments;
  }
  return comments;
};
const set_comment = async (id, text) => {
  /**
   * try return http request to backend to create comments
   * return response
   * @params: text,postId,userId
   * @response: confirmation- success, failed
   */
  // get connection status from state manager storage
  const connection = store.get_connection();
  //  list definition
  const account = await get_object('@storage_account');
  const input = {
    text: text,
    postId: id,
    userId: account.id,
  };
  // let user_id = account.id;
  // // check if connection
  if (connection) {
    //post comment to api
    const response = await instance.post('/comments/create', input);
    console.log(response.data);
    return response.data.confirmation;
  }
  // return comments;
};

const follow_article = async id => {
  // get connection status from state manager storage
  const connection = store.get_connection();
  // check if connection
  if (connection) {
    const response = await instance.get('/post/follow/' + id);
    return response.data;
  }
  return [];
};
const update_user = async user => {
  // get connection status from state manager storage
  const connection = store.get_connection();
  // check if connection
  if (connection) {
    const response = await instance.post('/users/update', user);
    return response.data;
  }
  return [];
};
const add_article = async article => {
  // get connection status from state manager storage
  const connection = store.get_connection();
  //  list definition
  let comments = [];
  // check if connection
  if (connection) {
    const response = await instance.post('/posts/create', article);
    return response.data;
    //load data from api
  }
  return [];
};
const get_notifications = async () => {
  /**
   * articles from LOCAL_FEEDS compaired with server feeds
   * try return http request to backend to update number of followers
   * return response
   * @params: text,postId,userId
   * @response: confirmation- success, failed
   */
  let list = [];
  // get connection status from state manager storage
  const connection = store.get_connection();
  // check if connection
  if (connection) {
    let followings = await get_object('@storage_following');

    followings = followings ? followings : [];
    console.log(followings);
    for (let i = 0; i < followings.length; i++) {
      let article = followings[i];
      const id = article.id;
      let item = await instance.get('/post/follow/updates/' + id);
      let {data} = item;
      if (data.numFollowers > article.numFollowers) {
        let num = data.numFollowers - article.numFollowers;
        list.push({
          key: list.length + 1,
          id: article.id,
          title: article.title,
          numFollowers: data.numFollowers,
          num: num,
          type: 'follower',
        });
      }
      if (data.numComments > article.numComments) {
        let numc = data.numComments - article.numComments;
        list.push({
          key: list.length + 1,
          id: article.id,
          title: article.title,
          numComments: data.numComments,
          num: numc,
          type: 'comment',
        });
      }
    }
    dispatcher.dispatch({
      type: 'UPDATE_NOTIFICATION',
      data: list,
    });
    return true;
  }

  return;
};
const speaking = async statement => {
  return Tts.speak(statement, {
    androidParams: {
      KEY_PARAM_PAN: -1,
      KEY_PARAM_VOLUME: 0.5,
      KEY_PARAM_STREAM: 'STREAM_MUSIC',
    },
  });
};
const logout = async () => {
  await remove_object('@storage_account');
  await remove_object('@storage_feed');
  await remove_object('@storage_location_feed');
  await remove_object('@storage_following');
};
const speaking_stop = async () => {
  return Tts.stop();
};
const ml_operation = async event => {
  console.log(event);
  // get connection status from state manager storage
  const connection = store.get_connection();
  //  list definition
  let collection = null;
  // check if connection
  if (connection) {
    // collect ml data from server
    collection = await instance.get('/' + event.type + '/' + event.data);
    // dispatch result to store
    dispatcher.dispatch({
      type: 'ACTION_UPDATE_' + event.type.toUpperCase(),
      data: collection.data.responses,
    });
    // return result
    return collection.data;
  }
};

// const get_comments = async id => {
//   // get connection status from state manager storage
//   const connection = store.get_connection();
//   //  list definition
//   let comments = [];
//   // check if connection
//   if (connection) {
//     //load data from api
//   }
//   return [];
// };
export {
  remove_object,
  get_object,
  save_object,
  logout,
  dispatch_feeds,
  app_initialisation,
  get_notifications,
  get_comments,
  set_comment,
  follow_article,
  update_user,
  add_article,
  speaking,
  speaking_stop,
  ml_operation,
};
