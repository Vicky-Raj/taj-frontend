import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import AllOrder from './history/AllOrder'
import RangeOrder from './history/RangeOrder'
import DateOrder from './history/DateOrder'

const History = () => {
	const [option, setoption] = useState('All')

	const handleChange = e => {
		setoption(e.target.value)
	}
	return (
		<div style={{ padding: 20 }}>
			<div
				className={{
					root: {
						flexGrow: 1,
					},
				}}
			>
				<Grid container>
					<Grid item xs={5}></Grid>
					<Grid item xs={2}>
						<FormControl>
							<InputLabel id='demo-simple-select-label'>choose</InputLabel>
							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								value={option}
								onChange={handleChange}
							>
								<MenuItem value={'All'}>All</MenuItem>
								<MenuItem value={'Date'}>Date</MenuItem>
								<MenuItem value={'Range'}>Range</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={5}></Grid>
				</Grid>
			</div>

			{option === 'Date' && <DateOrder />}
			{option === 'All' && <AllOrder />}
			{option === 'Range' && <RangeOrder />}
		</div>
	)
}

export default History
