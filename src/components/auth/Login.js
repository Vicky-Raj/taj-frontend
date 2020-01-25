import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import { withStyles, makeStyles } from '@material-ui/core/styles'

import { green, purple } from '@material-ui/core/colors'
import Icon from '@material-ui/core/Icon'

const ColorButton = withStyles(theme => ({
	root: {
		color: theme.palette.getContrastText(purple[500]),
		backgroundColor: green['A700'],
		'&:hover': {
			backgroundColor: green['A400']
		}
	}
}))(Button)

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
			<Link color='inherit' href='https://material-ui.com/'>
				Taj
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	)
}

const useStyles = makeStyles(theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white
		}
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: green['A700']
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 15
	}
}))

const Login = () => {
	const classes = useStyles()

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<Icon color='error' style={{ fontSize: 30, color: 'white' }}>
						person
					</Icon>
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign in
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='email'
						label='Email Address'
						name='email'
						autoComplete='email'
						autoFocus
					/>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						label='Password'
						type='password'
						id='password'
						autoComplete='current-password'
					/>
					<Grid container>
						<Grid item xs={5}></Grid>
						<Grid item xs={2}>
							<ColorButton
								variant='contained'
								color='primary'
								className={classes.submit}
								style={{ justifyContent: 'center', alignItems: 'center' }}
							>
								LOGIN
							</ColorButton>
						</Grid>
						<Grid item xs={5}></Grid>
					</Grid>
				</form>
			</div>
			<Box mt={8}>
				<Copyright />
			</Box>
		</Container>
	)
}

export default Login
