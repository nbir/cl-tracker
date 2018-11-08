import PropTypes from 'prop-types';
import React from 'react';

import Item from './Item';

class ItemList extends React.Component {
  renderItem(item) {
    const props = {
      item,
      key: item.itemId,
      onRemoveItem: this.props.onRemoveItem,
    };

    return <Item {...props} />;
  }

  render() {
    if (!this.props.items == null || !this.props.items.length === 0) return <div>Not items</div>;

    return (
      <table>
        <tbody>{this.props.items.map(this.renderItem.bind(this))}</tbody>
      </table>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.array,
  onRemoveItem: PropTypes.func.isRequired,
};

export default ItemList;
