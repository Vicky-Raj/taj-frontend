import React,{ useEffect,useState,useRef } from 'react'
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
import axios from 'axios'
import Moment from 'moment'
import {URL} from "../../../index";
import ToTable from "./CustomerandItemsPrint";
import ReactToPrint from "react-to-print";

const CustomerAndItems = () => {
	const [date,setDate] = useState(new Date());
	const [data,setData] = useState({
		fn:[],
		an:[],
		evening:[]
	})

	const fn = useRef();
	const an = useRef();
	const evening = useRef();

	const PrintMorning = <Button
	startIcon={<Print/>}
	variant="contained"
	style={{backgroundColor:'#00C853',color:"#fff"}}
	>print morning
	</Button>

	const PrintAfterNoon = <Button
	startIcon={<Print/>}
	variant="contained"
	style={{backgroundColor:'#00C853',color:"#fff"}}
	>print afternoon
	</Button>

	const PrintEvening = <Button
	startIcon={<Print/>}
	variant="contained"
	style={{backgroundColor:'#00C853',color:"#fff"}}
	>print evening
	</Button>

	useEffect(()=>{
		axios.get(`${URL}/hotel/vieworder/customer_items/`,{params:{date}})
		.then(({data})=>setData({
			fn:data.fn,
			an:data.an,
			evening:data.evening
		}))
		.catch(err=>console.log(err))
	},[date])

	return (
		<div>
			<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<KeyboardDatePicker
						disableToolbar
						variant='inline'
						format='dd/MM/yyyy'
						margin='normal'
						id='date-picker-inline'
						label='Date'
						value={date}
						onChange={date=>setDate(date)}
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
						style={{ margin: 0 }}
						/>
				</MuiPickersUtilsProvider>

				<Button
				startIcon={<Print/>}
				variant="contained"
				style={{backgroundColor:'#00C853',color:"#fff"}}
				>print
				</Button>
			</div>
			<div>
			<h2>Morning</h2>
				<ReactToPrint
					style={{margin:"0 auto"}}
					trigger={() => PrintMorning}
					content={() => fn.current}
				/>
				<ToTable data={data.fn} ref={fn}/>
			</div>
			<div>
			<h2>Afternoon</h2>
				<ReactToPrint
					trigger={() => PrintAfterNoon}
					content={() => an.current}
				/>
				<ToTable data={data.an} ref={an}/>
			</div>
			<div>
			<h2>Evening</h2>
				<ReactToPrint
					trigger={() => PrintEvening}
					content={() => evening.current}
				/>
				<ToTable data={data.evening} ref={evening}/>
			</div>
		</div>
	)
}

export default CustomerAndItems
