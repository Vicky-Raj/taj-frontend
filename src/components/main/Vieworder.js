import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import Items from './vieworder/Items'
import Customers from './vieworder/Customers'
import CustomerAndItems from './vieworder/CustomerAndItems'

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}))

const Vieworder = () => {
	const classes = useStyles()
	const [option, setoption] = useState('Customer')

	const handleChange = event => {
		setoption(event.target.value)
	}

	return (
		<>
			<Grid container style={{ padding: 20 }}>
				<Grid item xs={5}></Grid>
				<Grid item xs={2}>
					<FormControl className={classes.formControl}>
						<InputLabel id='demo-simple-select-label'>choose</InputLabel>
						<Select
							labelId='demo-simple-select-label'
							id='demo-simple-select'
							value={option}
							onChange={handleChange}
						>
							<MenuItem value={'Customer'}>Customer</MenuItem>
							<MenuItem value={'Customer + Items'}>Customer + Items</MenuItem>
							<MenuItem value={'Items'}>Items</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={5}></Grid>
				<Grid item xs={12}>
					<Paper style={{ boxShadow: 'none' }}>
						{option === 'Customer' && <Customers />}
						{option === 'Customer + Items' && <CustomerAndItems />}

						{option === 'Items' && <Items />}
					</Paper>
				</Grid>
			</Grid>
		</>
	)
}

export default Vieworder
