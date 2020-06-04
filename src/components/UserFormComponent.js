import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Avatar from "@material-ui/core/Avatar";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


export default class UserFormComponent extends React.Component {
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
        this.setState({ ...prevState, user: updatedUser });
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
            <div align={'center'}>
            <form onSubmit={(e) => { this.props.handleSubmit(e, this.state.user); }}>
                {errorsMessage}
                {successMessage}
                <Grid item xs={20}>
                    <p><label>First name</label></p>
                    <TextField required name='first_name' variant="outlined" value={this.state.user.first_name} onChange={this.handleChange} /><br/>
                    <p><label>Surname</label></p>
                    <TextField required name='surname'  variant="outlined" value={this.state.user.surname} onChange={this.handleChange} /><br/>
                    <p><label>Last name</label></p>
                    <TextField required name='last_name' variant="outlined" value={this.state.user.last_name} onChange={this.handleChange} /><br/>
                    <p><label>Birth date</label></p>
                    <TextField required name='date_of_birthday' variant="outlined" type='date' value={this.state.user.date_of_birthday ? this.state.user.date_of_birthday.slice(0,10) : null} onChange={this.handleChange} /><br/>
                    <p><label>Description</label></p>
                    <TextareaAutosize required name='description' rowsMin={5} value={this.state.user.description} onChange={this.handleChange} /><br/>
                    <p><label>Picture</label></p>
                    <Avatar style={{width: 100, height: 100}} src={`http://localhost:5000/uploads/${this.state.user.photo ? (this.state.user.photo.name ? this.state.user.photo.name : this.state.user.photo) : null}`} />
                    <Input
                           type="file"
                           name="photo"
                           accept="image/*"
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
