import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Input
} from "@material-ui/core";
import VerifiedUserOutlined from "@material-ui/icons/VerifiedUserOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";
import styles from "./styles";

function Dashboard(props) {
    const { classes } = props

	const [quote,setQuote] = useState('');
	const [quoteU,setQuoteU] = useState('');

	//Update,Mount,Dismount
    useEffect(function checkUser() {
      if (!firebase.getCurrentUsername()) {
        alert("Please login first");
        props.history.replace("/login");
      } else {
        firebase.getCurrentUserQuote().then(setQuote);
      }
    });

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <VerifiedUserOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Hello {firebase.getCurrentUsername()}
          </Typography>
          <Typography component="h1" variant="h5">
            Your quote:{" "}
            {quote ? `"${quote}"` : <CircularProgress size={20} />}
          </Typography>
          <form
            className={classes.form}
            onSubmit={e => e.preventDefault() && false}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Update your Quote</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="off"
                autoFocus
                value={quoteU}
                onChange={e => setQuoteU(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              onClick={update}
              className={classes.submit}
            >
              Update
            </Button>
          </form>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={logout}
            className={classes.submit}
          >
            Logout
          </Button>
        </Paper>
      </main>
    );
	
	async function update() {
    try {
      await firebase.updateQuote(quoteU);
      setQuoteU('');
      props.history.replace("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  }
	
    async function logout() {
        await firebase.logout()
        props.history.push('/');
	}
	
}

export default withRouter(withStyles(styles)(Dashboard))
