import _ from 'lodash';
import moment from 'moment';
import { handleActions } from 'redux-actions';
import * as types from 'Store/Actions/actionTypes';
import { filterTypes, sortDirections } from 'Helpers/Props';
import createSetReducer from './Creators/createSetReducer';
import createSetClientSideCollectionSortReducer from './Creators/createSetClientSideCollectionSortReducer';
import createSetClientSideCollectionFilterReducer from './Creators/createSetClientSideCollectionFilterReducer';

const COLUMNS_PERSISTED_STATE = 'seriesIndex.columns';

export const defaultState = {
  sortKey: 'sortTitle',
  sortDirection: sortDirections.ASCENDING,
  secondarySortKey: 'sortTitle',
  secondarySortDirection: sortDirections.ASCENDING,
  filterKey: null,
  filterValue: null,
  filterType: filterTypes.EQUAL,
  view: 'table',

  columns: [
    {
      name: 'status',
      label: '',
      columnLabel: 'Status',
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'sortTitle',
      label: 'Series Title',
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'network',
      label: 'Network',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'qualityProfileId',
      label: 'Quality Profile',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'nextAiring',
      label: 'Next Airing',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'previousAiring',
      label: 'Previous Airing',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'added',
      label: 'Added',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'seasonCount',
      label: 'Seasons',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'episodeProgress',
      label: 'Episodes',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'path',
      label: 'Path',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'sizeOnDisk',
      label: 'Size on Disk',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'tags',
      label: 'Tags',
      isSortable: false,
      isVisible: false
    },
    {
      name: 'actions',
      columnLabel: 'Actions',
      isVisible: true,
      isModifiable: false
    }
  ],

  sortPredicates: {
    network: function(item) {
      return item.network.toLowerCase();
    },

    nextAiring: function(item, direction) {
      const nextAiring = item.nextAiring;

      if (nextAiring) {
        return moment(nextAiring).unix();
      }

      if (direction === sortDirections.DESCENDING) {
        return 0;
      }

      return Number.MAX_VALUE;
    },

    episodeProgress: function(item) {
      const {
        episodeCount = 0,
        episodeFileCount
      } = item;

      const progress = episodeCount ? episodeFileCount / episodeCount * 100 : 100;

      return progress + episodeCount / 1000000;
    }
  },

  filterPredicates: {
    missing: function(item) {
      return item.episodeCount - item.episodeFileCount > 0;
    }
  }
};

export const persistState = [
  'seriesIndex.sortKey',
  'seriesIndex.sortDirection',
  'seriesIndex.filterKey',
  'seriesIndex.filterValue',
  'seriesIndex.filterType',
  'seriesIndex.view',
  COLUMNS_PERSISTED_STATE
];

export function afterMerge(initialState, persistedState, computedState) {
  const initialColumns = _.get(initialState, COLUMNS_PERSISTED_STATE);
  const persistedColumns = _.get(persistedState, COLUMNS_PERSISTED_STATE);

  if (!persistedColumns || !persistedColumns.length) {
    return;
  }

  const columns = [];

  initialColumns.forEach((initialColumn) => {
    const persistedColumnIndex = _.findIndex(persistedColumns, { name: initialColumn.name });
    const column = Object.assign({}, initialColumn);
    const persistedColumn = persistedColumnIndex > -1 ? persistedColumns[persistedColumnIndex] : undefined;

    if (persistedColumn) {
      column.isVisible = persistedColumn.isVisible;
    }

    // If there is a persisted column, it's index doesn't exceed the column list
    // and it's modifiable, insert it in the proper position.

    if (persistedColumn && columns.length - 1 > persistedColumnIndex && persistedColumn.isModifiable !== false) {
      columns.splice(persistedColumnIndex, 0, column);
    } else {
      columns.push(column);
    }

    // Set the columns in the persisted state
    _.set(computedState, COLUMNS_PERSISTED_STATE, columns);
  });
}

const reducerSection = 'seriesIndex';

const seriesIndexReducers = handleActions({

  [types.SET]: createSetReducer(reducerSection),

  [types.SET_SERIES_SORT]: createSetClientSideCollectionSortReducer(reducerSection),
  [types.SET_SERIES_FILTER]: createSetClientSideCollectionFilterReducer(reducerSection),

  [types.SET_SERIES_VIEW]: function(state, { payload }) {
    return Object.assign({}, state, { view: payload.view });
  },

  [types.SET_SERIES_TABLE_OPTIONS]: function(state, { payload }) {
    return Object.assign({}, state, payload);
  }

}, defaultState);

export default seriesIndexReducers;
