import React, { useEffect,useState,useRef} from 'react'
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



const EstimatedOrder = () => {
	const classes = useStyles();
	const [date,setDate] = useState(null);
	const componentRef = useRef();
	const format = {
		"Invoice No":"invoice",
		"Name":"name",
		"Ph.no":"phoneno",
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

	const [orderState, setOrderState] = React.useState({
		columns: [
			{ title: 'S.No', field: 'sno' },
			{ title: 'Invoice No', field: 'invoice' },
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
		],
		data: [],
		store:[]
	})

	useEffect(()=>{
		if(date){
		const selected  = moment(date).format("YYYY-MM-DD");
		setOrderState(state=>({
			...state,
			data:state.store.filter(data=>data.date_of_delivery.trim() === selected)
			.map((data,index)=>(
			{
				sno:index+1,
				name:data.name,
				invoice:data.invoice_no,
				phoneno:data.phone_num,
				placed_date:data.date_placed,
				delivery_date:data.date_of_delivery
			}
			))
		}))		
		}
	},[date])

	useEffect(()=>{
		axios.get(`${URL}/hotel/order/`)
		.then(res=>setOrderState(
			state=>({
				...state,
				data:res.data.map((data,index)=>({
					sno:index+1,
					name:data.name,
					invoice:data.invoice_no,
					phoneno:data.phone_num,
					placed_date:data.date_placed,
					delivery_date:data.date_of_delivery
				})),
				store:res.data
			})
		))
		.catch(err=>console.log(err))		
	},[])

	useEffect(()=>{

	},[orderState])

	return (
		<div>
			<div className='row' style={{ margin: 'auto', marginBottom: '2rem' }}>
				<Grid container spacing={3}>
					<Grid item xs={6} sm={3}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								disableToolbar
								variant='inline'
								format='MM/dd/yyyy'
								margin='normal'
								id='date-picker-inline'
								label='Date picker inline'
								value={date}
								onChange={date=>setDate(date)}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					</Grid>
					<Grid item xs={6} sm={3}></Grid>
					<Grid item xs={6} sm={3}>
					<ReactToPrint
						trigger={() => PrintButton}
						content={() => componentRef.current}
					/>
					</Grid>
				</Grid>
			</div>

			<MaterialTable
				title=''
				columns={orderState.columns}
				data={orderState.data}
			/>
			<div style={{display:"none"}}>
			<ToPrint data={orderState.data} ref={componentRef} format={format}/>
			</div>
		</div>
	)
}

export default EstimatedOrder

