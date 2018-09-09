import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Template} from 'meteor/templating';
import {Blaze} from 'meteor/blaze';

export default class AccountUiWrapper extends Component {
    componentDidMount(){
        //use meteor for create login button
        this.view = Blaze.render(Template.loginButtons,
            ReactDOM.findDOMNode(this.refs.container));
    }
    componentWillUnmount() {
        // Clean up Blaze view
        Blaze.remove(this.view);
    }
      render() {
        // Just render a placeholder container that will be filled in
        return <span ref="container" />;
      }
}