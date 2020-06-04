import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import UserFormComponent from './UserFormComponent';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/Edit';

class UsersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      users: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.callApi()
        .then(res => {this.setState({ users: res.data.users })})
        .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/users');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit = (e, user) => {
    e.preventDefault();
    const data = new FormData();
    data.append('user[firstName]', user.first_name);
    data.append('user[surname]', user.surname);
    data.append('user[lastName]', user.last_name);
    data.append('user[description]', user.description);
    data.append('user[dateOfBirthday]', user.date_of_birthday);
    data.append('user[photo]', user.photo);
    Axios({
      method: 'post',
      url: '/users/new',
      data: data,
      headers: {'access_token': localStorage.getItem('accessToken')} })
        .then((response) =>{
          this.setState({ messages: 'success', errors: null });
          let array = this.state.users;
          array.push(response.data.user);
          this.setState({ users: array });
        })
        .catch(error => {
            this.setState({ errors: error.response.statusText, messages: null });
          }
          );
  };
  handleDelete = (e, id) => {
    Axios({
        method: 'delete',
        url: `/users/${id}`,
        headers: {'access_token': localStorage.getItem('accessToken')}
        })
        .then(() => {
          let array = this.state.users;
          for( let i = 0; i < array.length; i++){
            if ( array[i].id === id){
              array.splice(i, 1);
            }
          }
          this.setState({ users: array });
        })
        .catch((error) => {
          this.setState({ errors: error.response.statusText, messages: null });
        });
  };

  render() {
    return (
        <div>
          <div style={{
            width: "100%",
            display: "flex",
            "flex-direction": "row",
            "flex-wrap": "wrap",
            "justify-content": "center"}}>
            {this.state.users.map(person =>
              <Grid style={{width: "30%", margin: "10px", backgroundColor: "#e8e8e8"}} container key={person.id} component={Paper}>
                <Grid item xs={12}>
                  <div>
                    <List>
                      <ListItem variant="h6">
                        <ListItemAvatar>
                          <Avatar style={{width: 200, height: 200,}} src={`http://localhost:5000/uploads/${person.photo}`} />
                        </ListItemAvatar>
                        <ListItemText align={"center"}><Typography variant="h6" align={"center"}>{person.first_name}<br/>{person.surname}<br/>{person.last_name}</Typography></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText>Birth date: {person.date_of_birthday.slice(0,10)}</ListItemText>
                      </ListItem>
                      <ListItem>
                        Description: {person.description}
                      </ListItem>
                        {localStorage.getItem('id') === "1" ? <ListItem>
                            <Button color="primary" onClick={(e) => {this.handleDelete(e, person.id)}}><DeleteIcon/></Button>
                            <Button component={Link} to={`/users/${person.id}`} color="primary"><EditIcon/></Button>
                        </ListItem> : undefined}
                    </List>
                  </div>
                </Grid>
              </Grid>
            )}
          </div>
            {localStorage.getItem('id') === "1" ?
            <div align={'center'}>
            <h1>Create new musician:</h1>
            <UserFormComponent user={this.state.user} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
          </div> : undefined}
        </div>
    );
  }
}

export default UsersComponent;
