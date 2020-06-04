import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import ConcertForm from './ConcertFormComponent';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from "@material-ui/icons/Edit";
import ListItem from "@material-ui/core/ListItem";

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

class ConcertsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            concert: {},
            concerts: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.callApi()
            .then(res => {this.setState({ concerts: res.data.concerts })})
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/concerts');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleSubmit = (e, concert) => {
        e.preventDefault();
        const data = new FormData();
        data.append('concert[place]', concert.place);
        data.append('concert[date]', concert.date);
        Axios({
            method: 'post',
            url: '/concerts/new',
            data: data,
            headers: {'access_token': localStorage.getItem('accessToken')} })
            .then((response) =>{
                this.setState({ messages: 'success', errors: null });
                let array = this.state.concerts
                array.push(response.data.concert)
                this.setState({ concerts: array });
            })
            .catch(error => {
                    this.setState({ errors: error.response.statusText, messages: null });
                }
            );
    };
    handleDelete = (e, id) => {
        Axios({
            method: 'delete',
            url: `/concerts/${id}`,
            headers: {'access_token': localStorage.getItem('accessToken')}})
            .then(() => {
                this.setState({ messages: 'success', errors: null });
                let array = this.state.concerts;
                for( let i = 0; i < array.length; i++){
                    if ( array[i].id === id){
                        array.splice(i, 1);
                    }
                }
                this.setState({ concerts: array });
            })
            .catch((error) => {
                this.setState({ errors: error.response.statusText, messages: null });
            });
    }

    render() {
        return (
            <div>
                <div align={"center"}>
                <TableContainer component={Paper} style={{width: "30%"}}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Place</StyledTableCell>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell/>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.concerts.map(concert =>
                                <StyledTableRow key={concert.id}>
                                    <StyledTableCell>{concert.place}</StyledTableCell>
                                    <StyledTableCell>{concert.date.slice(0,10)}</StyledTableCell>
                                    {localStorage.getItem('id') === "1" ?
                                    <StyledTableCell style={{width: "20px"}}><Button color="primary" onClick={(e) => {this.handleDelete(e, concert.id)}}><DeleteIcon/></Button>
                                        <Button component={Link} to={`/concerts/${concert.id}`} color="primary"><EditIcon/></Button>
                                    </StyledTableCell> : undefined}
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
                {localStorage.getItem('id') === "1" ?
                    <div align={'center'}>
                    <h1>Create new concert:</h1>
                    <ConcertForm concert={this.state.concert} errors={this.state.errors} messages={this.state.messages} handleSubmit={this.handleSubmit} />
                </div> : undefined}
            </div>
        );
    }
}

export default ConcertsComponent;