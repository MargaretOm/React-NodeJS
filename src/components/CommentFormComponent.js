import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import SendIcon from '@material-ui/icons/Send';


export default class CommentFormComponent extends React.Component {
    state = {
        comment: {},
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.comment) return;
        const { comment } = this.props;
        this.setState({ comment });
    }


    handleChange = (comment) => {
        var prevState = {...this.state};
        var updatedComment = {...this.state.comment};
        updatedComment[comment.target.name] = comment.target.value;
        this.setState({ ...prevState, comment: updatedComment });
    };

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
            <div position={"absolute"}>
                <form onSubmit={(e) => { this.props.handleSubmit(e, this.state.comment); }}>
                    {errorsMessage}
                    {successMessage}
                    <Grid item xs={20}>
                        <TextareaAutosize style={{margin: "20px", width: "70%"}} rowsMin={3} required name='message' variant="outlined" value={this.state.comment.message} onChange={this.handleChange} /><br/>
                        <Button color="primary" variant="contained" type="submit"><SendIcon/></Button>
                    </Grid>
                </form>
            </div>
        );
    }
}
