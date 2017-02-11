import { connect } from 'react-redux';
import { setSeriesTableOptions } from 'Store/Actions/seriesIndexActions';
import SeriesIndexHeader from './SeriesIndexHeader';

function createMapDispatchToProps(dispatch, props) {
  return {
    onTableOptionChange(payload) {
      dispatch(setSeriesTableOptions(payload));
    }
  };
}

export default connect(undefined, createMapDispatchToProps)(SeriesIndexHeader);
