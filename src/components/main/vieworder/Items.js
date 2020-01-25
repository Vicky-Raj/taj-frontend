import React,{ useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import 'date-fns'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Print from '@material-ui/icons/Print'
import MaterialTable from 'material-table'
import Axios from 'axios'
import Moment from 'moment'

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	button: {
		margin: theme.spacing(1),
	},
	tableSpacing: {
		padding: theme.spacing(5),
		margin: theme.spacing(3),
		boxShadow: 0,
		zIndex: 0,
	},
}))

const stylesy = {}

const Items = () => {
	const [morningItems, setMorningItems] = React.useState([])
	const [afternoonItems, setAfternoonItems] = React.useState([])
	const [eveningItems, setEveningItems] = React.useState([])
	const [allItems, setAllItems] = React.useState([])
	const classes = useStyles()
	const [session, setsession] = React.useState('All')

	const handleChange = event => {
		setsession(event.target.value)
	}
	const [selectedDate, setSelectedDate] = React.useState(
		new Date()
	)
	const handleDateChange = date => {
		let updatedDate = Moment(date).format('YYYY-MM-DD')
		Axios.get('http://127.0.0.1:8000/hotel/order/').then(res => {
			const changedData = res.data.filter(d => d.date_of_delivery.slice(0, 10) === updatedDate).map((el, i) => ({
				sno:i+1,
				session: el.session,
				items: el.ordered_items.map((subel) => ({
					name: subel.name,
					quantity: subel.total_price / subel.price
				})),
				date: el.date_of_delivery
			}))
			setAllItems(state => ({
				...state,
				allItems: changedData
			}))
			setViewOrderState(state => ({
				...state,
				data: changedData,
			}))
		})
		setSelectedDate(date)
	}

	const [viewOrderState, setViewOrderState] = React.useState({
		columns: [
			{ title: 'S.No', field: 'sno' },
			{ title: 'item', field: 'item' },
			{ title: 'Quantity', field: 'quantity' },
			{ title: 'Date', field: 'date' },
		],
		data: [],
	})

	useEffect(() => {
		const getData = async () => {
			const today = Moment(Date()).format('YYYY-MM-DD')
			let res = await Axios.get('http://127.0.0.1:8000/hotel/order/')
			const data = res.data.filter(d => d.date_of_delivery.slice(0,10) === today).map((el, i) => ({
				sno:i+1,
				session: el.session,
				items: el.ordered_items.map((subel) => ({
					unique_id:subel.unique_id,
					name: subel.name,
					quantity: subel.total_price / subel.price, // change to subel.quantity
					subitems: subel.subitems.map((subsubel)=>({
						unique_id:subsubel.unique_id,
						name: subsubel.name,
						quantity: subsubel.quantity
					}))
				})),
				date: el.date_of_delivery
			}))
			
			let todayItems = data.map((el) => ([el.items]))
			let subtodayitems = []
			let tempItems = []

			for(var i in todayItems){
				for(var j in todayItems[i]){
					for(var k in todayItems[i][j]){
						subtodayitems.push(todayItems[i][j][k])
					}
				}
			}

			while(subtodayitems.length != 0){
				tempItems.push(subtodayitems.shift())
				for(i in subtodayitems){
					if(tempItems[tempItems.length - 1].unique_id == subtodayitems[i].unique_id){
						tempItems[tempItems.length - 1].quantity += subtodayitems[i].quantity
						subtodayitems.splice(i, 1)
					}
				}
			}
			setAllItems((state) => ({
				...state,
				allItems: data,
			}))

			const morningData = data.filter(d => d.session == 'FN')
			const afternoonData = data.filter(d => d.session == 'Afternoon')
			const eveningData = data.filter(d => d.session == 'Evening')

			setMorningItems(state => ({
				...state,
				morningItems: morningData
			}))
			
			setAfternoonItems(state => ({
				...state,
				afternoonItems: afternoonData
			}))

			setEveningItems(state => ({
				...state,
				eveningItems: eveningData
			}))

			setViewOrderState(state => ({
				...state,
				data,
			}))
		}
		getData()
	}, [])

	return (
		<>
			<Grid container spacing={3}>
				<Grid container spacing={3} className={classes.gridDropdown}>
					<Grid item xs={8} sm={4}>
						<FormControl className={classes.formControl}>
							<InputLabel
								shrink
								id='demo-simple-select-placeholder-label-label'
							>
								Session
							</InputLabel>
							<Select
								className={classes.selectEmpty}
								value={session}
								label='Session'
								name='Session'
								onChange={handleChange}
								inputProps={{ 'aria-label': 'Session' }}
							>
								<MenuItem value={'All'}>All</MenuItem>
								<MenuItem value={'Morning'}>Morning</MenuItem>
								<MenuItem value={'Afternoon'}>Afternoon</MenuItem>
								<MenuItem value={'Evening'}>Evening</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={8} sm={4}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								disableToolbar
								variant='inline'
								format='MM/dd/yyyy'
								margin='normal'
								id='date-picker-inline'
								label='Date'
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					</Grid>
					<Grid item xs={8} sm={4}>
						<Button
							style={{ marginLeft: '50%', marginTop: '8%' }}
							variant='contained'
							color='default'
							size='large'
							className={classes.button}
							startIcon={<Print />}
						>
							Print
						</Button>
					</Grid>
				</Grid>

				<Grid item xs={12} sm={12}>
					<Paper
						style={{
							padding: 10,
						}}
					>
						<>
							{session}
							<MaterialTable
								title=''
								columns={viewOrderState.columns}
								data={viewOrderState.data}
								className={classes.tableSpacing}
								style={{ boxShadow: 'none', padding: '10', width: '100%' }}
							/>
						</>
					</Paper>
				</Grid>
			</Grid>
		</>
	)
}

export default Items
