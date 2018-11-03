import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { mount, unmount } from './actions';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
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

  renderItem(item) {
    const { itemId, url } = item;

    return <div key={itemId}>{url}</div>;
  }

  render() {
    const { loading, items } = this.props;

    if (loading) return 'Loading...';

    return (
      <div>
        CL Tracker
        {items.map(this.renderItem)}
      </div>
    );
  }
}

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
