import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
const Header = () => {
	const classes = useStyles()

	return (
		<AppBar position='fixed' style={{ background: '#00c853' }}>
			<Toolbar>
				<Typography variant='h6' className={classes.title}>
					TAJ
				</Typography>
				<Link to='/'>
					<Button color='inherit'>Login</Button>
				</Link>
				<Link to='/'>
					<Button color='inherit'>Logout</Button>
				</Link>
			</Toolbar>
		</AppBar>
	)
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	}
}))

export default Header
