import React, { Component } from 'react';
import Axios from 'axios';
import SongFormComponent from "./SongFormComponent";

class SongComponent extends Component {
    state = {
    };

    constructor(props) {
        super(props);
    }

    async fetchAvailable() {
        await Axios.get(`/songs/${this.props.match.params.id}`)
            .then(response => {
                this.setState({ song: response.data.data.song[0] });
            })
            .catch(() => {debugger} );
    }

    componentDidMount() {
        this.fetchAvailable();
    }

    handleSubmit = (e, song) => {
        e.preventDefault();
        const data = new FormData();
        data.append('song[title]', song.title);
        data.append('song[song]', song.song);
        data.append('song[poster]', song.poster);
        Axios({
            method: 'patch',
            url: `/songs/${song.id}`,
            data: data,
            headers: {'access_token': localStorage.getItem('accessToken')} })
            .then(() =>{
                this.setState({ messages: 'success', errors: null });
            })
            .catch(error => {
                    // this.setState({ errors: error.response.statusText, messages: null });
                }
            );
    };

    render() {
        return (
            <div>
                <div align={"center"}>
                    <h1>Update song:</h1>
                    <SongFormComponent song={this.state.song} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
                </div>
            </div>
        );
    }
}

export default SongComponent;
