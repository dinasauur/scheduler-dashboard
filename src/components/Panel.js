import React, { Component } from "react";

class Panel extends Component {
  render() {
    const { id, label, value, onSelect } = this.props;

    return (
      <section onClick={event => onSelect(id)} className="dashboard__panel">
        <h1 className="dashboard__panel-header">{label}</h1>
        <p className="dashboard__panel-value">{value}</p>
      </section>
    );
  }
}

export default Panel;