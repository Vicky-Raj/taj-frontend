import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import EstimatedOrder from './history/EstimatedOrder'
import OrderReport from './history/OrderReport'

const History = () => {
	const [option, setoption] = useState('order report')

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
								<MenuItem value={'order report'}>order report</MenuItem>
								<MenuItem value={'estimated order'}>estimated order</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={5}></Grid>
				</Grid>
			</div>

			{option === 'order report' && <OrderReport />}
			{option === 'estimated order' && <EstimatedOrder />}
		</div>
	)
}

export default History
