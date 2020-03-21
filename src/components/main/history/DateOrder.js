import React, { useEffect,useState,useRef} from 'react'
import MaterialTable from 'material-table'
import Print from '@material-ui/icons/Print'
import Paid from '@material-ui/icons/AttachMoney'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import Checkbox from '@material-ui/core/Checkbox'
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
import ToPrint from  "../../helpers/ToPrint";
import {URL} from "../../../index";
import moment from "moment";
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



const DateOrder = () => {
	const [gst,setGst] = useState(false)
	const classes = useStyles();
	const [date,setDate] = useState(new Date());
	const componentRef = useRef();
	const format = {
		"Invoice No":"invoice_no",
		"Name":"name",
		"Ph.no":"phone_num",
		"gst":"gst",
		"Date Placed":"placed_date",
		"Delivery Date":"delivery_date",
	}
	const PrintButton = <Button
	style={{ marginLeft: '50%', marginTop: '8%' }}
	variant='contained'
	color='default'
	size='large'
	className={classes.button}
	startIcon={<Print />}>
	Print
	</Button>
	const columns = [
			{ title: 'S.No', field: 'sno' },
			{ title: 'Invoice No', field: 'invoice' },
			{ title: 'GST No', field: 'gst',hidden:!gst},
			{ title: 'Name', field: 'name' },

			{
				title: 'Ph. no',
				field: 'phoneno',
			},

			{ title: 'placed date', field: 'placed_date' },
			{
				title: 'delivery date',
				field: 'delivery_date',
			},
	];
	const [orderState, setOrderState] = useState([]);
	const handleGst = event => {
		setGst(event.target.checked);
	}
	useEffect(()=>{
		axios.get(`${URL}/hotel/history/date_order/`,{params:{date,gst}})
		.then(({data})=>{
			setOrderState(data.map((order,index)=>({
				sno:index+1,
				invoice:order.invoice_no,
				name:order.name,
				gst:order.gst,
				phoneno:order.phone_num,
				placed_date:moment(order.placed_date).format("DD-MM-YYYY"),
				delivery_date:moment(order.delivery_date).format("DD-MM-YYYY")
			})))
		})
		.catch(err=>console.log(err));
	},[date,gst])


	return (
		<div>
			<div className='row' style={{ margin: 'auto', marginBottom: '2rem',display:'flex',justifyContent:'space-evenly',alignItems: 'center' }}>
				<div>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='date-picker-inline'
							label='Date'
							value={date}
							onChange={date=>setDate(date)}
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

export default DateOrder

