import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SongFormComponent from './SongFormComponent'
import {withStyles} from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#3700B3",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

class SongsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            song: {},
            songs: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        Axios({
          method: 'get',
          url: '/songs'
        })
          .then((response) => {
              this.setState({ songs: response.data.data.songs })
          })
          .catch((error) =>{
          });
    }

    handleSubmit = (e, song) => {
        e.preventDefault();
        const data = new FormData();
        data.append('song[title]', song.title);
        data.append('song[song]', song.song);
        data.append('song[poster]', song.poster);
        Axios({
            method: 'post',
            url: '/songs/new',
            data: data,
            headers: {'access_token': localStorage.getItem('accessToken')} })
            .then((response) =>{
                this.setState({ messages: 'success', errors: null });
                let array = this.state.songs;
                array.push(response.data.song);
                this.setState({ songs: array });
            })
            .catch(error => {
                    // this.setState({ errors: error.response.statusText, messages: null });
                }
            );
    };

    handleDelete = (e, id) => {
        Axios({
            method: 'delete',
            url: `/songs/${id}`,
            headers: {'access_token': localStorage.getItem('accessToken')}
        })
            .then(() => {
                let array = this.state.songs;
                for( let i = 0; i < array.length; i++){
                    if ( array[i].id === id){
                        array.splice(i, 1);
                    }
                }
                this.setState({ songs: array });
            })
            .catch((error) => {
                // this.setState({ errors: error.response.statusText, messages: null });
            });
    };

    render() {
        return (
            <div>
                <div align={"center"}>
                    {localStorage.getItem('email') ?
                    <TableContainer component={Paper} style={{width: "50%"}}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell/>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.songs.map(song =>
                                    <StyledTableRow key={song.id}>
                                        <StyledTableCell>{song.title}</StyledTableCell>
                                        <StyledTableCell>
                                            <audio controls="controls">
                                                <source src={`http://localhost:5000/uploads/${song.song}`} type='audio/mp4'/>
                                            </audio>
                                        </StyledTableCell>
                                        {localStorage.getItem('id') === "1" ?
                                        <StyledTableCell style={{width: "20px"}}><Button color="primary" onClick={(e) => {this.handleDelete(e, song.id)}}><DeleteIcon/></Button>
                                            <Button component={Link} to={`/videos/${song.id}`} color="primary"><EditIcon/></Button>
                                        </StyledTableCell> : undefined}
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer> : <h1>Only for authorized users!</h1>}
                    {localStorage.getItem('id') === "1" ?
                        <div>
                    <h1>Create new song:</h1>
                    <SongFormComponent song={this.state.song} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
                        </div> : undefined}
                </div>
            </div>
        );
    }
}

export default SongsComponent;