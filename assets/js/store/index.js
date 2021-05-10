import {EventEmitter} from 'events';
import dispatcher from '../dispatcher/dispatcher';
class Store extends EventEmitter {
  constructor() {
    super();
    // network connection status init
    this.connection = [];
    // search data init
    this.articles = [];
    this.current_article = {};
    this.location_articles = [];
    this.notification = [];
    this.search = [];
    this.action = '';
  }
  // store and get connection status
  set_connection(data) {
    this.connection = data;
    this.emit('emit_connection');
  }
  get_connection() {
    return this.connection;
  }
  // store and get articles data
  set_articles(data) {
    this.articles = data;
    this.emit('emit_articles');
  }
  get_articles() {
    return this.articles;
  }
  // store and get location_articles data
  set_location_articles(data) {
    this.location_articles = data;
    this.emit('emit_location_articles');
  }
  get_location_articles() {
    return this.location_articles;
  }
  // store and get search data
  set_notification(data) {
    this.notification = data;
    this.emit('emit_notification');
  }
  get_notification() {
    return this.notification;
  }
  // store and get search data
  set_action(data) {
    this.action = data;
    this.emit('emit_action');
  }
  get_action() {
    return this.action;
  }
  // store and get search data
  set_search(data) {
    this.connection = data;
    this.emit('emit_search');
  }
  get_search() {
    return this.connection;
  }
  // store and get search data
  set_current_article(data) {
    this.current_article = data;
    this.emit('emit_current_article');
  }
  get_current_article() {
    return this.current_article;
  }

  handleActions(actions) {
    console.log(actions);
    switch (actions.type) {
      case 'ACTION_UPDATE_CONNECTION':
        {
          this.set_connection(actions.data);
        }
        break;
      case 'ACTION_UPDATE_ARTICLES':
        {
          this.set_articles(actions.data);
        }
        break;
      case 'ACTION_UPDATE_LOCATION_ARTICLES':
        {
          this.set_location_articles(actions.data);
        }
        break;
      case 'UPDATE_NOTIFICATION':
        {
          this.set_notification(actions.data);
        }
        break;
      case 'ACTION_UPDATE_REQUEST/SEARCH':
        {
          this.set_search(actions.data);
        }
        break;
      case 'ACTION_UPDATE_ENGAGE_ACTION':
        {
          this.set_action(actions.data);
        }
        break;
      case 'ACTION_UPDATE_CURRENT_ARTICLE':
        {
          this.set_current_article(actions.data);
        }
        break;
    }
  }
}
const store = new Store();
dispatcher.register(store.handleActions.bind(store));
export default store;
