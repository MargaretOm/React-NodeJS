import React, { Component } from 'react';
import Axios from "axios";
import CommentFormComponent from './CommentFormComponent'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import {Link} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";

class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: {},
            comments: []
        };
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleDelete = this.handleDelete.bind(this);
    }
    //
    componentDidMount() {
        Axios({
            method: 'get',
            url: '/comments' })
            .then((response) =>{
                this.setState({ comments: response.data.data.comments})
            })
            .catch(error => {

            });
    }

    handleSubmit = (e, comment) => {
        e.preventDefault();
        const data = new FormData();
        debugger
        data.append('comment[avatar]', localStorage.getItem('avatar') ? localStorage.getItem('avatar').replace('"', '').replace('"', '') : null);
        data.append('comment[email]', localStorage.getItem('email').replace('"', '').replace('"', ''));
        data.append('comment[message]', comment.message);
        Axios({
            method: 'post',
            url: '/comments/new',
            data: data,
            headers: {'access_token': localStorage.getItem('accessToken')} })
            .then((response) =>{
                let array = this.state.comments;
                array.push(response.data.comment);
                this.setState({ comments: array });
            })
            .catch(error => {
                    this.setState({ errors: error.response.statusText, messages: null });
                }
            );
    };

    handleDelete = (e, id) => {
        Axios({
            method: 'delete',
            url: `/comments/${id}`,
            headers: {'access_token': localStorage.getItem('accessToken')}
        })
            .then(() => {
                let array = this.state.comments;
                for( let i = 0; i < array.length; i++){
                    if ( array[i].id === id){
                        array.splice(i, 1);
                    }
                }
                this.setState({ comments: array });
            })
            .catch((error) => {
                this.setState({ errors: error.response.statusText, messages: null });
            });
    };

    render() {
        return (
            <div align={"center"}>
                <Grid style={{width: "70%", margin: "10px", backgroundColor: "#e8e8e8", height: "450px", overflow: "scroll"}} container component={Paper}>
                {this.state.comments.map(comment =>
                    <Grid style={{margin: "20px", width: "50%", marginLeft: localStorage.getItem('email') ? (localStorage.getItem('email').replace('"', '').replace('"', '') === comment.email ? "50%" : "20px") : "20px"}} component={Paper}>
                            <List>
                                {console.log(comment.avatar)}
                                <ListItem variant="h6">
                                    <ListItemAvatar>
                                        <Avatar style={{width: 50, height: 50,}} src={`http://localhost:5000/uploads/${comment.avatar}`} />
                                    </ListItemAvatar>
                                    <ListItemText><Typography>{comment.email}<br/>{comment.message}</Typography></ListItemText>
                                </ListItem>
                                {localStorage.getItem('id') === "1" ? <ListItem>
                                    <Button color="primary" onClick={(e) => {this.handleDelete(e, comment.id)}}><DeleteIcon/></Button>
                                </ListItem> : undefined}
                            </List>
                    </Grid>
                )}
                </Grid>
                { localStorage.getItem('id') ?
                <CommentFormComponent comment={this.state.comment} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit}/> : undefined}
            </div>
        );
    }
}

export default MainComponent;
