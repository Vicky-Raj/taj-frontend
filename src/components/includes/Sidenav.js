import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'

import { Link } from 'react-router-dom'

const Sidenav = () => {
	const classes = useStyles()

	return (
		<div style={{position:"fixed",top:"5rem",left:"10px",zIndex:100}}>
			<Card className={classes.card}>
				<Link to='/neworder'>
					<CardContent style={{ backgroundColor: '#00c853' }}>
						<Typography variant='h5' component='h2'>
							<Icon color='error' style={{ fontSize: 30, color: 'white' }}>
								add_circle
							</Icon>
						</Typography>
						<Typography variant='h6' component='h4'>
							NEW ORDER
						</Typography>
					</CardContent>
				</Link>
			</Card>
			<Card className={classes.card}>
				<Link to='/vieworder'>
					<CardContent style={{ backgroundColor: '#00c853' }}>
						<Typography variant='h5' component='h2'>
							<Icon color='error' style={{ fontSize: 30, color: 'white' }}>
								visibility
							</Icon>
						</Typography>
						<Typography variant='h6' component='h2'>
							VIEW ORDER
						</Typography>
					</CardContent>
				</Link>
			</Card>
			<Card className={classes.card}>
				<Link to='/history'>
					<CardContent style={{ backgroundColor: '#00c853' }}>
						<Typography variant='h5' component='h2'>
							<Icon color='error' style={{ fontSize: 30, color: 'white' }}>
								history
							</Icon>
						</Typography>
						<Typography variant='h6' component='h2'>
							HISTORY
						</Typography>
					</CardContent>
				</Link>
			</Card>
			<Card className={classes.card}>
				<Link to='/info'>
					<CardContent style={{ backgroundColor: '#00c853' }}>
						<Typography variant='h5' component='h2'>
							<Icon color='error' style={{ fontSize: 30, color: 'white' }}>
								info
							</Icon>
						</Typography>
						<Typography variant='h6' component='h2'>
							INFO
						</Typography>
					</CardContent>
				</Link>
			</Card>
		</div>
	)
}

const useStyles = makeStyles({
	card: {
		minWidth: '100%',
		marginBottom: 30,
		textAlign: 'center'
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	}
})

export default Sidenav
