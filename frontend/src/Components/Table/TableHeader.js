import React, { Component, PropTypes } from 'react';

class TableHeader extends Component {

  //
  // Render

  render() {
    const {
      children
    } = this.props;

    return (
      <thead>
        <tr>
          {children}
        </tr>
      </thead>
    );
  }
}

TableHeader.propTypes = {
  children: PropTypes.node
};

export default TableHeader;
