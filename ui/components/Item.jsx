import PropTypes from 'prop-types';
import React from 'react';

class Item extends React.Component {
  handleDelete() {
    const { itemId } = this.props.item;

    this.props.onRemoveItem(itemId);
  }

  renderDeleteButton() {
    const props = {
      onClick: this.handleDelete.bind(this),
    };

    return <button {...props}>Delete</button>;
  }

  render() {
    const { expired, price, title, url, updatedAt } = this.props.item;

    return (
      <tr>
        <td>{price}</td>
        <td>
          <a href={url}>{title}</a>
        </td>
        <td>{expired ? 'expired' : 'active'}</td>
        <td>{updatedAt}</td>
        <td>{this.renderDeleteButton()}</td>
      </tr>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object,
  onRemoveItem: PropTypes.func.isRequired,
};

export default Item;
