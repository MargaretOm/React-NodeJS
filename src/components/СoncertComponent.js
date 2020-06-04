import React, { Component } from 'react';
import Axios from 'axios';
import ConcertForm from './ConcertFormComponent';

class ConcertComponent extends Component {
    state = {
    };

    constructor(props) {
        super(props);
    }

    async fetchAvailable() {
        await Axios.get(`/concerts/${this.props.match.params.id}`)
            .then(response => {
                this.setState({ concert: response.data.data.concert[0] });
            })
            .catch(() => {debugger} );
    }

    componentDidMount() {
        this.fetchAvailable();
    }

    handleSubmit = (e, concert) => {
        e.preventDefault();
        const data = new FormData();
        data.append('concert[place]', concert.place);
        data.append('concert[date]', concert.date.slice(0,10));
        Axios({
            method: 'patch',
            url: `/concerts/${concert.id}`,
            data: data,
            headers: {'access_token': localStorage.getItem('accessToken')}})
            .then((response) =>{
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
                    <h1>Update concert:</h1>
                    <ConcertForm concert={this.state.concert} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
                </div>
            </div>
        );
    }
}

export default ConcertComponent;
