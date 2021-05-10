import * as React from 'react';
import {StackActions} from '@react-navigation/native';
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export function current_route() {
  return navigationRef.current?.getCurrentRoute();
}
export function back() {
  navigationRef.current?.dispatch(StackActions.pop(1));
}
