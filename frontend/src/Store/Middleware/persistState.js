import _ from 'lodash';
import persistState from 'redux-localstorage';
import * as addSeriesReducers from 'Store/Reducers/addSeriesReducers';
import * as seriesIndexReducers from 'Store/Reducers/seriesIndexReducers';
import * as seriesEditorReducers from 'Store/Reducers/seriesEditorReducers';
import * as seasonPassReducers from 'Store/Reducers/seasonPassReducers';
import * as calendarReducers from 'Store/Reducers/calendarReducers';
import * as historyReducers from 'Store/Reducers/historyReducers';
import * as blacklistReducers from 'Store/Reducers/blacklistReducers';
import * as wantedReducers from 'Store/Reducers/wantedReducers';
import * as settingsReducers from 'Store/Reducers/settingsReducers';
import * as systemReducers from 'Store/Reducers/systemReducers';
import * as manualImportReducers from 'Store/Reducers/manualImportReducers';

const reducers = [
  addSeriesReducers,
  seriesIndexReducers,
  seriesEditorReducers,
  seasonPassReducers,
  calendarReducers,
  historyReducers,
  blacklistReducers,
  wantedReducers,
  settingsReducers,
  systemReducers,
  manualImportReducers
];

function slicer(paths) {
  return (state) => {
    const subset = {};

    paths.forEach((path) => {
      _.set(subset, path, _.get(state, path));
    });

    return subset;
  };
}

function serialize(obj) {
  return JSON.stringify(obj, null, 2);
}

function merge(initialState, persistedState) {
  if (!persistedState) {
    return initialState;
  }

  const computedState = {};

  _.merge(computedState, initialState, persistedState);

  reducers.forEach((reducer) => {
    if (reducer.afterMerge) {
      reducer.afterMerge(initialState, persistedState, computedState);
    }
  });

  return computedState;
}

const paths = _.reduce(reducers, (acc, reducer) => {
  acc = acc.concat(reducer.persistState);
  return acc;
}, []);

const config = {
  slicer,
  serialize,
  merge,
  key: 'sonarr'
};

export default persistState(paths, config);
