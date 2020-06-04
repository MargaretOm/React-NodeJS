import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';


export default class SongFormComponent extends React.Component {
    state = {
        song: {},
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForFile = this.handleChangeForFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.song) return;
        const { song } = this.props;
        this.setState({ song });
    }


    handleChange = (song) => {
        var prevState = {...this.state};
        var updatedSong = {...this.state.song};
        updatedSong[song.target.name] = song.target.value;
        this.setState({ ...prevState, song: updatedSong });
    }

    handleChangeForFile = (song) => {
        var prevState = {...this.state};
        var updatedSong = {...this.state.song};
        updatedSong[song.target.name] = song.target.files[0];
        this.setState({ ...prevState, song: updatedSong });
    }

    render () {
        let errorsMessage;
        let successMessage;
        if (this.props.errors)  {
            errorsMessage = <SnackbarContent style={{backgroundColor: '#FD3B3B'}} message={this.props.errors}/>
        }
        if (this.props.messages)  {
            successMessage = <SnackbarContent style={{backgroundColor: '#5FD13D'}} message={this.props.messages}/>
        }
        return (
            <div align={'center'}>
                <form onSubmit={(e) => { this.props.handleSubmit(e, this.state.song); }}>
                    {errorsMessage}
                    {successMessage}
                    <Grid item xs={20}>
                        <p><label>Title</label></p>
                        <TextField required name='title' variant="outlined" value={this.state.song.title} onChange={this.handleChange} /><br/>
                        <p><label>Video</label></p>
                        <Input
                            required
                            type="file"
                            name="song"
                            accept="audio/*"
                            onChange={this.handleChangeForFile}
                        />
                        <p></p>
                        <Button color="primary" variant="contained" type="submit">Accept</Button>
                    </Grid>
                </form>
            </div>
        );
    }
}
