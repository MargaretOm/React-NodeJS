import React, { Component } from 'react';
import Axios from 'axios';
import SignUpForm from './SignUpFormComponent';

class SignUpComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = (e, user) => {
        this.setState({ errors: null});
        e.preventDefault();
        if (user.password != user.password_confirmation){
            return this.setState({ errors: 'Password confirmation does not match' });
        }
        const data = new FormData();
        data.append('user[email]', user.email);
        data.append('user[password]', user.password);
        data.append('user[first_name]', user.first_name);
        data.append('user[surname]', user.surname);
        data.append('user[last_name]', user.last_name);
        data.append('user[date_of_birthday]', user.date_of_birthday);
        data.append('user[photo]', user.photo);
        Axios({
            method: 'post',
            url: '/sign_up',
            data: data })
            .then((response) =>{
                this.setState({ messages: response.data.message, errors: null });
            })
            .catch(error => {
                this.setState({ errors: error.response.data.message, messages: null });
                }
            );
    };

    render() {
        return (
            <div align={'center'}>
                    <h1>Sing Up:</h1>
                    <SignUpForm user={this.state.user} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
                </div>
        );
    }
}

export default SignUpComponent;