import React, { Component } from 'react';
import Axios from 'axios';
import SignInForm from './SignInFormComponent';

class SignInComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e, user) => {
        e.preventDefault();
        const data = new FormData();
        data.append('user[email]', user.email);
        data.append('user[password]', user.password);
        Axios({
            method: 'post',
            url: '/sign_in',
            data: data,
            headers: {'access_token': localStorage.getItem('accessToken')} })
            .then((response) =>{
                if (response.data.accessToken) {
                    localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
                    localStorage.setItem('id', JSON.stringify(response.data.id));
                    localStorage.setItem('email', JSON.stringify(response.data.email));
                    localStorage.setItem('avatar', JSON.stringify(response.data.avatar));
                    this.setState({ messages: 'success', errors: null });
                }
            })
            .catch((error) => {
                this.setState({ errors: error.response.data.message, messages: null });
                }
            );
    };

    render() {
        return (
                <div align={'center'}>
                    <h1>Sign In:</h1>
                    <SignInForm user={this.state.user} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
                </div>
        );
    }
}

export default SignInComponent;