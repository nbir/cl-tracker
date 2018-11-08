import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { addItem, removeItem, mount, unmount } from './actions';

import AddForm from './components/AddForm';
import ItemList from './components/ItemList';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  onAddItem: data => dispatch(addItem(data)),
  onRemoveItem: itemId => dispatch(removeItem(itemId)),
  onMount: () => dispatch(mount()),
  onUnmount: () => dispatch(unmount()),
});

class App extends React.Component {
  componentDidMount() {
    this.props.onMount();
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  renderAddForm() {
    const props = {
      onAddItem: this.props.onAddItem,
    };

    return <AddForm {...props} />;
  }

  renderItemList() {
    const props = {
      items: this.props.items,
      onRemoveItem: this.props.onRemoveItem,
    };

    return <ItemList {...props} />;
  }

  render() {
    if (this.props.loading) return 'Loading...';

    return (
      <div>
        <h1>CL Tracker</h1>
        {this.renderAddForm()}
        {this.renderItemList()}
      </div>
    );
  }
}

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,

  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
