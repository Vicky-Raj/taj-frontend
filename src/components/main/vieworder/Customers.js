import React,{useState,useEffect} from "react";
import DateFnsUtils from '@date-io/date-fns'
import {useHistory} from  "react-router-dom";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import {
	InputLabel,
	Select,
	MenuItem,
	Button
} from "@material-ui/core"
import MaterialTable from 'material-table'
import {Print} from "@material-ui/icons"
import axios from "axios";
import {URL} from "../../../index";

export default ()=>{

	const history = useHistory();

	const [date,setDate] = useState(new Date());
	const [session,setSession] = useState("FN");
	const [orders,setOrders] = useState([]);
	const [confirmed,setConfirmed] = useState(true);

	useEffect(()=>{
		axios.get(`${URL}/hotel/vieworder/customer/`,{params:{date,session,confirmed}})
		.then(({data})=>{
			setOrders(data)
		})
		.catch(err=>console.log(err))
	},[date,session,confirmed])

	return(
		<div>
			<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
				<div>
				<InputLabel id="demo-simple-select-label" style={{marginTop:"20px"}}>Session</InputLabel>
				<Select
				style={{width:"8rem"}}
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={session}
				onChange={e=>setSession(e.target.value)}
				>
					<MenuItem value="FN">FN</MenuItem>
					<MenuItem value="AN">AN</MenuItem>
					<MenuItem value="EVENING">EVENING</MenuItem>
					<MenuItem value="ALL">ALL</MenuItem>
				</Select>
				</div>

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
				
				<div>
				<InputLabel id="demo-simple-select-label" style={{marginTop:"20px"}}>Order Status</InputLabel>
				<Select
				style={{width:"8rem"}}
				labelId="demsetSession(e.target.value)o-simple-select-label"
				id="demo-simple-select"
				value={confirmed}
				onChange={e=>setConfirmed(e.target.value)}
				>
					<MenuItem value={true}>CONFIRMED</MenuItem>
					<MenuItem value={false}>NOT CONFIRMED</MenuItem>
				</Select>
				</div>

				<Button
				startIcon={<Print/>}
				variant="contained"
				style={{backgroundColor:'#00C853',color:"#fff"}}
				>print
				</Button>
			</div>
		<MaterialTable style={{margin:"2rem 2rem"}}
			actions={[
				{
				  icon: 'person',
				  tooltip: 'See Details',
				  onClick: (event, rowData) => {
					history.push(`/order/${rowData.invoiceNo}`)
				  }
				}
			]}
        	columns={[
			{ title: 'Name', field: 'name'},
			{ title: 'PhoneNo', field: 'phoneNo'},
			{ title: 'Session', field: 'session'},
			{ title: 'Invoice No', field: 'invoiceNo'}
		  	]}
		  	title="Ordered Items"
		  	data={orders}
		  	options={{
			// rowStyle: {
			//   backgroundColor: '#C6F6D5',
			//   color:"0",
			// },
				pageSize:10,
				pageSizeOptions:[10,20,40]
		  }}
		
		/>
		</div>
	);
}

