import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';


export default class ConcertFormComponent extends React.Component {
    state = {
        concert: {},
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.concert) return;
        const { concert } = this.props;
        this.setState({ concert });
    }


    handleChange = (concert) => {
        var prevState = {...this.state};
        var updatedConcert = {...this.state.concert};
        updatedConcert[concert.target.name] = concert.target.value;
        this.setState({ ...prevState, concert: updatedConcert });
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
            <form onSubmit={(e) => { this.props.handleSubmit(e, this.state.concert); }}>
                {errorsMessage}
                {successMessage}
                <Grid item xs={20}>
                    <p><label>Place</label></p>
                    <TextField required name='place'  variant="outlined" value={this.state.concert.place} onChange={this.handleChange} /><br/>
                    <p><label>Date</label></p>
                    <TextField required name='date' variant="outlined" type='date' value={this.state.concert.date ? this.state.concert.date.slice(0,10) : null} onChange={this.handleChange} /><br/>
                    <p></p>
                    <Button color="primary" variant="contained" type="submit">Accept</Button>
                </Grid>
            </form>
            </div>
        );
    }
}
