import React, { Component } from 'react';
import Axios from 'axios';
import UserFormComponent from './UserFormComponent';

class UserComponent extends Component {
    state = {
    };

    constructor(props) {
        super(props);
    }

    async fetchAvailable() {
        await Axios.get(`/users/${this.props.match.params.id}`)
            .then(response => {
                this.setState({ user: response.data.data.user[0] });
            })
            .catch(() => {debugger} );
    }

    componentDidMount() {
        this.fetchAvailable();
    }

    handleSubmit = (e, user) => {
        e.preventDefault();
        const data = new FormData();
        data.append('user[firstName]', user.first_name);
        data.append('user[surname]', user.surname);
        data.append('user[lastName]', user.last_name);
        data.append('user[description]', user.description);
        data.append('user[dateOfBirthday]', user.date_of_birthday.slice(0,10));
        data.append('user[photo]', user.photo);
        Axios({
            method: 'patch',
            url: `/users/${user.id}`,
            data: data,
            headers: {'access_token': localStorage.getItem('accessToken')} })
            .then(() =>{
                this.setState({ messages: 'success', errors: null });
            })
            .catch(error => {
                this.setState({ errors: error.response.statusText, messages: null });
            }
            );
    };

    render() {
        return (
            <div>
                <div align={"center"}>
                    <h1>Update musician:</h1>
                    <UserFormComponent user={this.state.user} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
                </div>
            </div>
        );
    }
}

export default UserComponent;
