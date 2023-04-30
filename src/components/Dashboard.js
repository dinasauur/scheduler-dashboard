import React, { Component } from 'react';
import axios from 'axios';

import classnames from 'classnames';
import Loading from './Loading';
import Panel from './Panel';
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  // inital state
  state = { 
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };

  // We use the componentDidMount lifecycle method to check to see if there is saved focus state after we render the application the first time.
  // When the local storage contains state, we can set the state of the application to match.
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      })
    })
  }

  // We can use the componentDidUpdate lifecycle method to listen for changes to the state. These functions belong to the Dashboard class. 
  // The componentDidUpdate lifecycle method has access to the props and state from the previous update. 
  // We compare them to the existing state, and if the values change, we write the value to localStorage.
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  // // Instance method the long way
  // selectPanel(id) {
  //   this.setState({
  //     focused: id
  //   });

  //   if (this.state.focused === id) {
  //     this.setState({
  //       focused: null
  //     })
  //   }
  // }

   // Instance method the short way
   selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  // /* Class Property with Arrow Function */
  // selectPanel = id => {
  //   this.setState({
  //    focused: id
  //   });
  // };

  render() {

    const dashboardClasses = classnames('dashboard', {
      'dashboard--focused': this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = (this.state.focused ? data.filter( panel => this.state.focused === panel.id) : data)
    .map(panel => (
      <Panel 
        key={panel.id} 
        id={panel.id} 
        label={panel.label} 
        value={panel.getValue(this.state)}
        onSelect={(event) => this.selectPanel(panel.id)}
      />
    ));

    return (<main className={dashboardClasses}>{panels}</main>)
  }
}

export default Dashboard;
