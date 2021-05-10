import store from '../store';
import {push, current_route} from '../../../RootNavigation';
import {
  get_object,
  ml_operation,
  save_object,
  speaking,
  speaking_stop,
} from './action';
import dispatcher from '../dispatcher/dispatcher';
import {DeviceEventEmitter} from 'react-native';
// Dispatch engage actions to state
const dispatch = async action => {
  dispatcher.dispatch({type: 'ACTION_UPDATE_ENGAGE_ACTION', data: action});
};
// process default action 1 - 9 from tensorflow api
const process_actions = async responses => {
  let reply = responses.reply ? responses.reply : '';
  let index = responses.index;
  switch (index) {
    case 0:
      {
        push('Home');
        const account = await get_object('@storage_account');
        // reply = 'Hello ' + account.firstName + ' ' + reply;
      }
      break;
    case 1:
    case 9:
      {
        await dispatch('statement');
      }
      break;
    case 2:
      {
        push('New');
      }
      break;
    case 3:
      {
        await dispatch('search');
        reply = 'what key words do you want to search for?';
      }
      break;
    case 4:
      {
        const route = current_route();
        if (route.name !== 'Article') {
          await dispatch('search');
          reply = 'Which article do you want to search in ?';
        } else {
          const article = store.get_current_article();
          await dispatch('qna/' + article.id);
          reply = 'Ask your question ?';
        }
      }
      break;
    case 5:
      {
        push('Profile');
      }
      break;
    case 6:
      {
        push('Follow');
      }
      break;
    case 7:
      {
        push('Notice');
      }
      break;
    case 8:
      {
        const route = current_route();
        if (route.name !== 'Article') {
          reply = 'Search for the article you want save ?';
        } else {
          const article = store.get_current_article();
          //remove if followings has article
          let followings = await get_object('@storage_following');
          followings = followings.length > 0 ? followings : [];
          if (followings.length > 0) {
            // remove if followings has article
            followings = (await followings).filter(
              item => item.id !== article.id,
            );
          }
          // add with new update
          (await followings).push(article);
          // save in local storage
          save_object('@storage_following', followings).then(async () => {
            await dispatch('statement');
          });
        }
      }
      break;
    case 11:
      {
        const route = current_route();
        if (route.name !== 'Article') {
          await dispatch('search');
          reply = 'Which article do you want to read ?';
        }
      }
      break;
    case 12:
      {
        await speaking_stop();
      }
      break;
  }
  return reply;
};
// process sarch from engage
const process_search = async responses => {
  console.log('search result');
  DeviceEventEmitter.emit('event.is_search_empty', true);
  await dispatch('statement');
  return 'these are your result';
};
//answer question from current article
const process_qna = async answers => {
  let option = 'you have ' + answers.length + ' options:\n';
  for (let i = 0; i < answers.length; i++) {
    let c = i + 1;
    option = option + 'Option ' + c + ': ' + answers[i].text + '.\n';
  }
  await dispatch('statement');
  return option;
};
//manage the above functions
const respond = async result => {
  // initialise statement
  let response = '';
  if (result.confirmation === 'statement') {
    console.log('statement');
    response = await process_actions(result.responses);
  }
  if (result.confirmation === 'search') {
    console.log('search');
    response = await process_search(result.responses);
    // await dispatch('statement');
  }
  if (result.confirmation === 'qna') {
    console.log('qna');
    response = await process_qna(result.answers);
  }
  return response;
};
// process and manage voice control
const process_engage = async data => {
  let store_action = store.get_action();
  let action = store_action === '' ? 'statement' : store_action;
  // get connection status from state manager storage
  const connection = store.get_connection();
  //  list definition
  let reply = 'you are not connected';
  // check if connection
  if (data === 'engage') {
    await dispatch('statement');
    return 'engage active';
  }
  if (connection) {
    console.log('set');
    const result = await ml_operation({type: 'request/' + action, data: data});
    reply = await respond(result);
    //load data from api
  }
  return reply;
};

export {process_engage};
