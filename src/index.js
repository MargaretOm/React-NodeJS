import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Switch, Route} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import UsersComponent from './components/UsersComponent';
import NavBarComponent from './components/NavBarComponent';
import MainComponent from './components/MainComponent'
import UserComponent from "./components/UserComponent";
import SongsComponent from './components/SongsComponent';
import SongComponent from './components/SongComponent';
import СoncertsComponent from './components/СoncertsComponent';
import СoncertComponent from './components/СoncertComponent';
import SignUpComponent from './components/SignUpComponent';
import SignInComponent from './components/SignInComponent';

const Main = () => (
    <Switch>
        <Route exact path='/' component={MainComponent} />
        <Route exact path='/users' component={UsersComponent} />
        <Route exact path='/users/:id' component={UserComponent} />
        <Route exact path='/videos' component={SongsComponent} />
        <Route exact path='/videos/:id' component={SongComponent} />
        <Route exact path='/concerts' component={СoncertsComponent} />
        <Route exact path='/concerts/:id' component={СoncertComponent} />
        <Route exact path='/sign_up' component={SignUpComponent} />
        <Route exact path='/sign_in' component={SignInComponent} />
    </Switch>
);

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <NavBarComponent/>
    <Main />
  </Router>,
  document.getElementById('root')
);
