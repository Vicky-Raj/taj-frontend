import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Icon from '@material-ui/core/Icon'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import Table from '../helpers/Table'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'

const Neworder = () => {
	let history = useHistory()

	const [info, setinfo] = useState({
		name: '',
		invoiceNo: '',
		phoneNum: '',
		address: '',
		email: '',
	})

	const classes = useStyles()
	// const list = [
	// 	{ title: 'idli', rate: 5 },
	// 	{ title: 'dosa', rate: 20 },
	// 	{ title: 'pongal', rate: 50 },
	// 	{ title: 'vada', rate: 4 },
	// ]
	// const sublist = [
	// 	{ title: 'idli', rate: 5 },
	// 	{ title: 'dosa', rate: 20 },
	// 	{ title: 'pongal', rate: 50 },
	// 	{ title: 'vada', rate: 4 },
	// ]

	const [list, setlist] = useState([])
	const [sublist, setsublist] = useState([])

	const [adv, setadv] = useState(0)

	const [session, setsession] = React.useState('')
	function formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear()

		if (month.length < 2) month = '0' + month
		if (day.length < 2) day = '0' + day

		return [year, month, day].join('-')
	}

	const [selectedDate, setSelectedDate] = React.useState(formatDate(new Date()))

	const handleDateChange = date => {
		setSelectedDate(formatDate(new Date()))
	}
	const handleChange = event => {
		setsession(event.target.value)
	}

	const [orderlist, setorderlist] = useState({
		list: [],
		total: 0,
	})
	const [sorderlist, setsorderlist] = useState({
		list: [],
		total: 0,
	})

	const amthandler = (val, payload) => {
		console.log(payload)

		setTimeout(() => {
			console.log('add finished')
			//setmoney(money + val)
			setorderlist({
				...orderlist,
				list: payload,
				total: val + orderlist.total,
			})
			//console.log(orderlist)
			//console.log(orderlist);
		}, 1000)
	}

	const samthandler = (val, payload) => {
		console.log(payload)

		setTimeout(() => {
			console.log('add finished')
			//setmoney(money + val)
			setsorderlist({
				...sorderlist,
				list: payload,
				total: val + sorderlist.total,
			})
			//console.log(orderlist)
			//console.log(orderlist);
		}, 1000)
	}

	const onchandler = e => {
		setadv(e.target.value)
	}

	const onhandleinfo = e => {
		setinfo({
			...info,
			[e.target.name]: e.target.value,
		})
	}

	const postData = {
		...info,
		deliveryDate: selectedDate,
		session,
		total: orderlist.total + sorderlist.total,
		adv: adv,
	}

	const printAndSave = () => {
		console.log(postData)

		let formData = new FormData()

		for (var key in postData) {
			formData.append(key, postData[key])
		}
		let t1 = orderlist.list
		console.log(t1)

		formData.append('items', JSON.stringify(orderlist.list))
		formData.append('subitems', JSON.stringify(sorderlist.list)) //formData.append('items', JSON.stringify( [{item:'dosa', qty:5}]))

		fetch('http://localhost:8000/hotel/order/', {
			body: formData,
			contentType: 'application/x-www-form-urlencoded; charset=utf-8', //Default
			processData: true,
			method: 'post',
		}).then(() => {
			console.log('posted')
		})

		Axios({
			method: 'post',
			url: 'http://969de05a.ngrok.io/hotel/order/',
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
			.then(() => {
				console.log('posted')

				// props.router.push({
				// 	pathname: '/print',
				// 	state: {
				// 	  id: 7,
				// 	  color: 'green'
				// 	}
				//   })
			})
			.catch(err => console.log(err))

		history.push('/print', { name: 'souma' })
		window.location.reload()
	}

	const placeAndSave = () => {
		console.log('place')
		console.log(orderlist)
		console.log(sorderlist)
	}

	useEffect( () => async ()=>{
		let tlist = []
		let tsublist = []

		let data = await fetch('http://localhost:8000/hotel/items')
		let res = await data.json()
		let data2 = await fetch('http://localhost:8000/hotel/subitems')
		let res2 = await data2.json()
		//console.log(res)

		res.forEach(element => {
			list.push({
				title: element.name,
				rate: element.price,
				unique_id: element.unique_id,
			})
		})

		res2.forEach(e => {
			sublist.push(e)
		})

		setlist(list)
		setsublist(sublist)
		//console.log(list)
	}, [])

	return (
		<div style={{ padding: 12 }}>
			<Grid container spacing={3} style={{ padding: 20 }}>
				<Grid item xs={12}>
					<Grid item xs={4} className={classes.amt}>
						<Typography style={{ color: '#00c853' }}>
							<h3 style={{ marginBottom: 0 }}>Customer details </h3>{' '}
						</Typography>
					</Grid>
					<Grid container xs={12}>
						<Grid item xs={6}>
							<TextField
								id='standard-required'
								value={info.invoiceNo}
								name='invoiceNo'
								onChange={onhandleinfo}
								label='invoice number'
								className={classes.textField}
								margin='none'
							/>
							<TextField
								id='standard-required'
								label='Name'
								value={info.name}
								name='name'
								onChange={onhandleinfo}
								className={classes.textField}
								margin='none'
							/>
							<TextField
								id='standard-required'
								label='email'
								value={info.email}
								name='email'
								onChange={onhandleinfo}
								className={classes.textField}
								margin='none'
							/>
							<TextField
								id='standard-required'
								label='phoneNum'
								value={info.phoneNum}
								name='phoneNum'
								onChange={onhandleinfo}
								className={classes.textField}
								margin='normal'
							/>
						</Grid>
						<Grid item xs={6}>
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
									style={{ margin: 0 }}
								/>
							</MuiPickersUtilsProvider>

							<FormControl className={classes.formControl}>
								<InputLabel id='demo-simple-select-label'>Session</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={session}
									onChange={handleChange}
								>
									<MenuItem value={'FN'}>FN</MenuItem>
									<MenuItem value={'AN'}>AN</MenuItem>
								</Select>
							</FormControl>

							<p></p>
							<TextareaAutosize
								aria-label='minimum height'
								rows={5}
								cols={70}
								value={info.address}
								name='address'
								onChange={onhandleinfo}
								placeholder='Address'
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid
						item
						xs={4}
						className={classes.amt}
						style={{ marginBottom: 20 }}
					>
						<Typography style={{ color: '#00c853' }}>
							<h3 style={{ marginBottom: 0 }}>Amount details </h3>{' '}
						</Typography>
					</Grid>
					<Grid container xs={12} style={{ justifyContent: 'center' }}>
						<Table list={list} seth={amthandler} />
					</Grid>
					<Grid
						container
						xs={12}
						style={{ justifyContent: 'center', marginTop: 22 }}
					>
						<Table list={sublist} seth={samthandler} />
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid item xs={4} className={classes.amt}>
						<Typography style={{ color: '#00c853' }}>
							<h3 style={{ marginBottom: 0 }}>Amount details </h3>{' '}
						</Typography>
					</Grid>
					<Grid container xs={12} className={classes.amt}>
						<Grid item xs={4} className={classes.amt}>
							<h3 style={{ marginBottom: 0 }}>
								Amount: {orderlist.total + sorderlist.total}
							</h3>
						</Grid>
						<Grid item xs={4} className={classes.amt}>
							<TextField
								id='standard-required'
								label='advance'
								value={adv}
								onChange={onchandler}
								className={classes.ctextField}
								margin='none'
							/>
						</Grid>
						<Grid item xs={4} className={classes.amt}>
							<h3 style={{ marginBottom: 0 }}>
								Balance: {orderlist.total + sorderlist.total - adv}
							</h3>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} style={{ marginTop: 15 }}>
					<Fab
						variant='extended'
						aria-label='like'
						onClick={printAndSave}
						className={classes.fab}
						style={{ backgroundColor: '#00c853' }}
					>
						<Icon
							color='error'
							style={{ fontSize: 30, color: '#fff', marginRight: 8 }}
						>
							print
						</Icon>
						<Typography style={{ color: '#fff' }}>
							print invoice and and save
						</Typography>
					</Fab>
					<Fab

						variant='extended'
						aria-label='like'
						className={classes.fab}
						onClick={placeAndSave}
						style={{ backgroundColor: '#00c853' }}
					>
						<Icon
							color='error'
							style={{ fontSize: 30, color: '#fff', marginRight: 8 }}
						>
							shopping_cart
						</Icon>
						<Typography style={{ color: '#fff' }}>
							place order and save
						</Typography>
					</Fab>
				</Grid>
			</Grid>
		</div>
	)
}

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
	},
	ctextField: {
		marginLeft: theme.spacing(1),
		marginRight: 150,
		width: 200,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		marginTop: 0,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	button: {
		margin: theme.spacing(1),
	},
	input: {
		display: 'none',
	},
	fab: {
		margin: theme.spacing(1),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
}))

export default Neworder
