import React,{useState,useEffect,useRef} from "react";
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import {
	Button,
	Typography
} from "@material-ui/core"
import {Print} from "@material-ui/icons"
import axios from "axios";
import {URL} from "../../../index";
import ItemsTable from "./DailyItemsTable";
import ReactToPrint from "react-to-print";


export default ()=>{


	const [date,setDate] = useState(new Date());
	const [data,setData] = useState({
		fn:{},
		an:{},
		evening:{}
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
		axios.get(`${URL}/hotel/vieworder/items/`,{params:{date}})
		.then(({data})=>setData({fn:data.fn,an:data.an,evening:data.evening}))
		.catch(err=>console.log(err))
	},[date])

	return(
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
			<div style={{marginTop:"1.5rem"}}>
				<ReactToPrint
					style={{margin:"0 auto"}}
					trigger={() => PrintMorning}
					content={() => fn.current}
				/>
				<Typography variant="h6" style={{color:"#00C853"}}>Morning</Typography>
				<ItemsTable data={data.fn} ref={fn}/>
			</div>
			<div style={{marginTop:"1.5rem"}}>
				<ReactToPrint
					trigger={() => PrintAfterNoon}
					content={() => an.current}
				/>
				<Typography variant="h6" style={{color:"#00C853"}}>Afternoon</Typography>
				<ItemsTable data={data.an} ref={an}/>
			</div>
			<div style={{marginTop:"1.5rem"}}>
				<ReactToPrint
					trigger={() => PrintEvening}
					content={() => evening.current}
				/>
				<Typography variant="h6" style={{color:"#00C853"}}>Evening</Typography>
				<ItemsTable data={data.evening} ref={evening}/>
			</div>
		</div>
	);
}

