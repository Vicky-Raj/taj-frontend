import React, { useEffect,useState,useRef } from 'react'
import MaterialTable from 'material-table'
import Print from '@material-ui/icons/Print'
import Paid from '@material-ui/icons/AttachMoney'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import NativeSelect from '@material-ui/core/NativeSelect'
import axios from 'axios'
import Checkbox from '@material-ui/core/Checkbox'
import {URL} from "../../../index";
import moment from "moment";
import ToPrint from "../../helpers/ToPrint";
import ReactToPrint from "react-to-print";

const useStyles = makeStyles(theme => ({
	button: {
		margin: theme.spacing(1),
	},
	input: {
		display: 'none',
	},
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}))

const RangeOrder = () => {
	const [gst,setGst] = useState(false)
	const classes = useStyles()
	const componentRef = useRef();
	const format = {
		"Invoice No":"invoice",
		"Name":"name",
		"Session":"session",
		"Ph.no":"phoneno",
		"gst":"gst",
		"Vessel":"vessel",
		"Date Placed":"placed_date",
		"Delivery Date":"delivery_date",
		"Amount":"amount"
	}
	const PrintButton = <Button
	style={{ marginLeft: '50%', marginTop: '8%' }}
	variant='contained'
	color='default'
	size='large'
	className={classes.button}
	startIcon={<Print />}
	>
	Print
	</Button>
	
	const columns = [
		{ title: 'S.No', field: 'sno' },
		{ title: 'Invoice No', field: 'invoice' },
		{ title: 'GST No', field: 'gst',hidden:!gst},
		{ title: 'Name', field: 'name' },
		{ title: 'Session', field: 'session' },
		{
			title: 'Ph. no',
			field: 'phoneno',
		},
		{
			title: 'vessel',
			field: 'vessel',
		},
		{ title: 'placed date', field: 'placed_date' },
		{
			title: 'delivery date',
			field: 'delivery_date',
		},
		{ title: 'Amount', field: 'amount' },
	];
	const handleGst = event => {
		setGst(event.target.checked);
	}
	const [orderState, setOrderState] = useState([]);
	const today = new Date()
	const [from,setFrom] = useState(new Date());
	const [to,setTo] = useState(new Date());

	useEffect(()=>{
		axios.get(`${URL}/hotel/history/range_order/`,{params:{from,to,gst}})
		.then(({data})=>setOrderState(
				data.map((data,index)=>({
				sno: index + 1,
				name: data.name,
				invoice: data.invoice_no,
				session: data.session,
				gst:data.gst,
				phoneno: data.phone_num,
				placed_date: moment(data.date_placed).format("DD-MM-YYYY"),
				delivery_date: moment(data.date_of_delivery).format("DD-MM-YYYY"),
				amount: data.paid ? 'paid' : 'not paid',
				vessel: data.returned_vessel ? 'returned' : 'not returned',
			})),
		))
		.catch(err=>console.log(err))		
	},[from,to,gst])

	return (
		<div>
			<div style={{ margin: 'auto', marginBottom: '2rem',display: 'flex',justifyContent: 'space-evenly',alignItems: 'center' }}>
				<div>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='date-picker-inline'
							label='From'
							value={from}
							onChange={from=>setFrom(from)}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
				</div>
				
				<div>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='date-picker-inline'
							label='To'
							value={to}
							onChange={to=>setTo(to)}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
				</div>
				
				<div><Checkbox 
					onChange = {handleGst}
					value = "primary"
					inputProps = {{'aria-label':'primary checkbox'}}
				/> GST </div>
				<div>
					<ReactToPrint
						trigger={() => PrintButton}
						content={() => componentRef.current}
					/>
				</div>
				
			</div>

			<MaterialTable
				title=''
				columns={columns}
				data={orderState}
			/>
			<div style={{display:"none"}}>
			<ToPrint data={orderState} ref={componentRef} format={format}/>
			</div>
		</div>
	)
}

export default RangeOrder;

