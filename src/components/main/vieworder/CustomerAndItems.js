import React,{ useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Print from '@material-ui/icons/Print'
import Axios from 'axios'
import Moment from 'moment'

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},
	button: {
		margin: theme.spacing(1)
	}
}))

const stylesy = {
	paper: {
		padding: 10
	}
}

const CustomerAndItems = () => {
	const [allData, setAllData] = React.useState([])
	const classes = useStyles()
	const [session, setsession] = React.useState('All')
	const handleChange = event => {
		switch(event.target.value){
			case 'All':
				console.log(allData)
				setViewOrderState(state => ({
					...state,
					data: allData['allData'],
				}))
				
				console.log('all')
				console.log(allData)
				break;
			case 'Morning':
				console.log(allData)
				setViewOrderState((state) => ({
					...state,
					data: allData['allData'].filter(d => d.session == 'FN')
				}))
				console.log('morning')
				console.log(allData)
				break;
			case 'Afternoon':
				console.log(allData)
				setViewOrderState((state) => ({
					...state,
					data: allData['allData'].filter(d => d.session == 'Afternoon')
				}))
				console.log('afternoon')
				console.log(allData)
				break;
			case 'Evening':
				console.log(allData)
				setViewOrderState((state) => ({
					...state,
					data: allData['allData'].filter(d => d.session == 'Evening')
				}))
				console.log('evening')
				console.log(allData)
				break;
			default:
				console.log('default')
				break;
		}
		setsession(event.target.value)
	}
	const [selectedDate, setSelectedDate] = React.useState(
		new Date()
	)
	const handleDateChange = date => {
		console.log(Moment(date).format('YYYY-MM-DD'))
		let updatedDate = Moment(date).format('YYYY-MM-DD')
		Axios.get('http://127.0.0.1:8000/hotel/order/').then(res => {
			const changedData = res.data.filter(d => d.date_of_delivery.slice(0, 10) === updatedDate).map((el) => ({
				customerName: el.name,
				session: el.session,
				items: el.ordered_items.map((subel) => ({
					name: subel.name,
					quantity: subel.total_price / subel.price
				}))
			}))
			let subres = res.data[0]
			console.log(changedData)
			// console.log(updatedDate == subres['date_of_delivery'].slice(0,10))
			// console.log(res)
			setAllData(state => ({
				...state,
				allData: changedData,
			}))
			setViewOrderState(state => ({
				...state,
				data: changedData,
			}))
		})
		setSelectedDate(date)
		setsession('All')
	}

	const [viewOrderState, setViewOrderState] = React.useState({
		data: []
	})

	useEffect(() => {
		
		const getData = async () => {
			console.log(allData)
			const today = Moment(Date()).format('YYYY-MM-DD')
			let res = await Axios.get('http://127.0.0.1:8000/hotel/order/')
			let subres = res.data[0]
			// console.log(today)
			// console.log(subres['date_of_delivery'].slice(0,10))
			// console.log(subres['date_of_delivery'].slice(0,10) == today)
			// console.log(res.data.filter(d => d.date_of_delivery.slice(0,10) === '2019-12-05'))

			// const a = res.data.filter(aa => aa.date_of_delivery.slice(0,10) != 0)
			// console.log(a)

			const data = res.data.filter(d => d.date_of_delivery.slice(0,10) === today).map((el) => ({
				customerName: el.name,
				session: el.session,
				items: el.ordered_items.map((subel) => ({
					name: subel.name,
					quantity: subel.total_price / subel.price
				}))
			}))

			console.log("allData")
			
			setAllData((state) => ({
				...state,
				allData: data,
			}))
			console.log(allData)
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
									'aria-label': 'change date'
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

				{viewOrderState.data.map((item, i) => {
					return (
						<Grid item xs={8} sm={4}>
							<Paper style={stylesy.paper}>
								<h3 style={{ fontFamily: 'Lato' }}> {item.customerName}</h3>
								<br></br>
								{item.items.map((item, i) => {
									return (
										<Container>{item.name + '-' + item.quantity}</Container>
									)
								})}
							</Paper>
						</Grid>
					)
				})}
			</Grid>
		</>
	)
}

export default CustomerAndItems
