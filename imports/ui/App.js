import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
 
import { Tasks } from '../api/tasks.js';
import AccountsUiWrapper from './AccountsUiWrapper'
import Task from './Task.js';
 
// App component - represents the whole app
class App extends Component {
  //constructor for changing state of task
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  handleSub(event) {
    event.preventDefault();
     // Find the text field via the React ref
     const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
     Meteor.call('tasks.insert', text)
 
     Tasks.insert({
       text,
       createdAt: new Date(), // current time
       owner: Meteor.userId(),
       username: Meteor.user().username
     });
  
     // Clear form
     ReactDOM.findDOMNode(this.refs.textInput).value = '';
   }
  
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
  toggleHComp() {
    // hidded compleated task
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount}) </h1>       
          <label className="hide-completed">
            <input type="checkbox" readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHComp.bind(this)}
            />
            Hide Completed Tasks
          </label>   
          <AccountsUiWrapper/>
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSub.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}
export default withTracker(() => {
  Meteor.subscribe('tasks');
  return {
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
})(App);