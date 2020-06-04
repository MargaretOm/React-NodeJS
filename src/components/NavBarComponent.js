import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {Toolbar} from '@material-ui/core';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';

class NavBarComponent extends Component {
    handleSubmit = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('avatar');
    };

    render() {
        return (
            <div className="App">
                <AppBar>
                    <Toolbar>
                        <Button component={Link} to={'/'} size="large" color="inherit">Main page</Button>
                        <Button component={Link} to={'/users'} size="large" color="inherit">Musicians</Button>
                        <Button component={Link} to={'/videos'} size="large" color="inherit">Songs</Button>
                        <Button component={Link} to={'/concerts'} size="large" color="inherit">Concerts</Button>
                        <Button component={Link} to={'/sign_in'} size="large" color="secondary" style={{align:'right'}}>Sign in</Button>
                        <Button component={Link} to={'/sign_up'} size="large" color="secondary" style={{align:'right'}}>Sign up</Button>
                        <Button component={Link} onClick={this.handleSubmit} size="large" color="secondary" style={{align:'right'}}>Sign out</Button>
                    </Toolbar>
                </AppBar>
                <br/><br/><br/><br/>
            </div>
        );
    }
}

export default NavBarComponent;
