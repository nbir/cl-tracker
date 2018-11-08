import PropTypes from 'prop-types';
import React from 'react';

class AddForm extends React.Component {
  handleSubmit(e) {
    e.preventDefault();

    this.props.onAddItem({ url: this.urlElement.value });
  }

  render() {
    return (
      <form>
        <input
          type="text"
          ref={ref => {
            this.urlElement = ref;
          }}
        />
        <button type="submit" onClick={this.handleSubmit.bind(this)}>
          Add
        </button>
      </form>
    );
  }
}

AddForm.propTypes = {
  onAddItem: PropTypes.func.isRequired,
};

export default AddForm;
