import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';


export default class SignInFormComponent extends React.Component {
    state = {
        user: {},
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForFile = this.handleChangeForFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.user) return;
        const { user} = this.props;
        this.setState({ user });
    }


    handleChange = (user) => {
        var prevState = {...this.state};
        var updatedUser = {...this.state.user};
        updatedUser[user.target.name] = user.target.value;
        this.setState({ ...prevState, user: updatedUser, errors: null });
    }

    handleChangeForFile = (user) => {
        var prevState = {...this.state};
        var updatedUser = {...this.state.user};
        updatedUser[user.target.name] = user.target.files[0];
        this.setState({ ...prevState, user: updatedUser });
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
            <form align={'center'} onSubmit={(e) => { this.props.handleSubmit(e, this.state.user); }}>
                {errorsMessage}
                {successMessage}
                <Grid item xs={20}>
                    <p><label>Email</label></p>
                    <TextField required name='email' variant="outlined" value={this.state.user.email} onChange={this.handleChange} /><br/>
                    <p><label>Password</label></p>
                    <TextField required name='password' variant="outlined" type='password' value={this.state.user.password} onChange={this.handleChange} /><br/>
                    <p></p>
                    <Button color="primary" variant="contained" type="submit">Sign In</Button>
                </Grid>
            </form>
        );
    }
}
