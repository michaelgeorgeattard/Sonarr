import React, { PropTypes } from 'react';
import { icons, sortDirections } from 'Helpers/Props';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Icon from 'Components/Icon';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import InteractiveEpisodeSearchRow from './InteractiveEpisodeSearchRow';

const headers = [
  {
    name: 'protocol',
    label: 'Source',
    isSortable: true
  },
  {
    name: 'age',
    label: 'Age',
    isSortable: true
  },
  {
    name: 'title',
    label: 'Title',
    isSortable: true
  },
  {
    name: 'indexer',
    label: 'Indexer',
    isSortable: true
  },
  {
    name: 'size',
    label: 'Size',
    isSortable: true
  },
  {
    name: 'peers',
    label: 'Peers',
    isSortable: true
  },
  {
    name: 'qualityWeight',
    label: 'Quality',
    isSortable: true
  },
  {
    name: 'rejections',
    label: React.createElement(Icon, { name: icons.DANGER }),
    isSortable: true,
    fixedSortDirection: sortDirections.ASCENDING
  },
  {
    name: 'releaseWeight',
    label: React.createElement(Icon, { name: icons.DOWNLOAD }),
    isSortable: true,
    fixedSortDirection: sortDirections.ASCENDING
  }
];

function InteractiveEpisodeSearch(props) {
  const {
    isFetching,
    isPopulated,
    error,
    items,
    sortKey,
    sortDirection,
    onSortPress,
    onGrabPress
  } = props;

  if (isFetching) {
    return <LoadingIndicator />;
  } else if (!isFetching && !!error) {
    return <div>Unable to load results for this episode search. Try again later.</div>;
  } else if (isPopulated && !items.length) {
    return <div>No results found.</div>;
  }

  return (
    <Table
      headers={headers}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSortPress={onSortPress}
    >
      <TableBody>
        {
          items.map((item) => {
            return (
              <InteractiveEpisodeSearchRow
                key={item.guid}
                {...item}
                onGrabPress={onGrabPress}
              />
            );
          })
        }
      </TableBody>
    </Table>
  );
}

InteractiveEpisodeSearch.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortKey: PropTypes.string,
  sortDirection: PropTypes.string,
  onSortPress: PropTypes.func.isRequired,
  onGrabPress: PropTypes.func.isRequired
};

export default InteractiveEpisodeSearch;
