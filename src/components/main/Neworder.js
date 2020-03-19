import React, { useState, useEffect } from "react";
import {
	Typography,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	Checkbox,
	Button
} from "@material-ui/core";
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import ReactDataSheet from "react-datasheet";
import Autocomplete from "react-select";
import 'react-datasheet/lib/react-datasheet.css';
import axios from "axios"
import { URL } from "../../index";
import "./table.css";


export default () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNo, setPhoneNo] = useState("");
	const [delDate, setDelDate] = useState(new Date());
	const [address, setAddress] = useState("");
	const [session, setSession] = useState("FN");
	const [options, setOptions] = useState([]);
	const [constItems,setItems] = useState({});
	const [constSubitems,setSubitems] = useState({});
	const [advance,setAdvance] = useState(0);
	const [gstNumber,setGstNumber] = useState("");
	const [gst, setGst] = useState(false);
	const [confirmed, setConfirmed] = useState(true);
	const [orderedSubitems,setOrderSubitems] = useState([
		[
			{ value: "S.No", readOnly: true, width: "100px", className: "header" },
			{ value: "Name", readOnly: true, width: "800px", className: "header" },
			{ value: "Quantity", readOnly: true, width: "800px", className: "header" },
		],
		[
			{ value: "", readOnly: true, width: "100px", className: "header" },
			{ value: "", readOnly: true, width: "800px", className: "header" },
			{ value: "", readOnly: true, width: "800px", className: "header" },
		]
	])
	const [orderedItems, setOrderItems] = useState([
		[
			{ value: "S.No", readOnly: true, width: "100px", className: "header" },
			{ value: "Name", readOnly: true, width: "400px", className: "header" },
			{ value: "Price", readOnly: true, width: "400px", className: "header" },
		 	{ value: "Quantity", readOnly: true, width: "400px", className: "header" },
			{ value: "Total", readOnly: true, width: "400px", className: "header" },
		],
		[	{value:"",width:"100px",readOnly:true},
			{ value: "", width: "400px" },
			{ value: null, width: "400px" },
			{ value: null, width: "400px" },
			{ value: null, width: "400px" },
		],
		[
			{ value: "Total Amount", colSpan: 4, width: "400px", readOnly: true },
			{ value: 0, width: "400px" }
		]
	]);
	const handleGst = event => {
		setGst(event.target.checked);
	}
	const handleConfirmed = event => {
		setConfirmed(event.target.checked)
	}
	useEffect(() => {
		axios.get(`${URL}/hotel/items/`)
			.then(({ data }) => {
				let options = [];
				for(let item in data.items)
					options.push({label:item,price:data.items[item].price})
				for(let subitem in data.subitems)
					options.push({label:subitem,price:data.subitems[subitem].price})
				setItems(data.items);
				setSubitems(data.subitems);
				setOptions(options);
			})
	}, [])

	const send = ()=>{
		const customer = {
			name,
			email,
			phoneNo,
			date:delDate,
			address,
			session
		}
		const items = []
		for(let i=1;i<orderedItems.length-2;i++){
			let unique_id;
			if(constItems.hasOwnProperty(orderedItems[i][1].value)){
				unique_id = constItems[orderedItems[i][1].value].unique_id;
			}
			else{
				unique_id = constSubitems[orderedItems[i][1].value].unique_id;
			}
			const quantity = Number(orderedItems[i][3].value);
			const amount = Number(orderedItems[i][4].value);
			items.push({unique_id,quantity,amount});
		}
		const total = Number(orderedItems[orderedItems.length-1][1].value)
		const balance = total-advance;
		axios.post(`${URL}/hotel/order/`,JSON.stringify({customer,items,total,advance,balance,gst:gstNumber,hasGst:gst,confirm:confirmed}))
		.then(()=>{})		

	}

	return (
		<div>
			<Typography variant="h6" style={{ color: "#00C853", boxSizing: "border-box", paddingLeft: "30px", paddingTop: "30px" }}>
				Customer Details
			</Typography>
			<div style={{ display: "flex", boxSizing: "border-box", padding: "0 30px", marginTop: "10px" }}>
				<div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
					<TextField label="Name" value={name} onChange={e => setName(e.target.value)} />
					<TextField label="Email" style={{ marginTop: "10px" }} value={email} onChange={e => setEmail(e.target.value)} />
					<TextField label="Phone Number" style={{ marginTop: "10px" }} value={phoneNo} onChange={e => setPhoneNo(e.target.value)} />
					<TextField label="Gst Number" style={{marginTop:"10px"}} value={gstNumber} onChange={e=> setGstNumber(e.target.value)} />
				</div>
				<div style={{ flex: "2" }}></div>
				<div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							style={{ marginBottom: "5px" }}
							disableToolbar
							variant="inline"
							format="dd/MM/yyyy"
							label="Delivery Date"
							value={delDate}
							onChange={date => setDelDate(date)}
						/>
					</MuiPickersUtilsProvider>
					<InputLabel shrink id="demo-simple-select-placeholder-label-label">
						Session
        			</InputLabel>
					<Select
						labelId="demo-simple-select-placeholder-label-label"
						id="demo-simple-select-placeholder-label"
						value={session}
						onChange={e => setSession(e.target.value)}
					>
						<MenuItem value="FN">FN</MenuItem>
						<MenuItem value="AN">AN</MenuItem>
						<MenuItem value="EVENING">EVENING</MenuItem>
					</Select>
					<TextField label="Address"
						variant="outlined"
						multiline rows={4}
						style={{ marginTop: "10px" }}
						value={address}
						onChange={e => setAddress(e.target.value)}
					/>
				</div>
			</div>
			<div style={{ boxSizing: "border-box", padding: "0 10px", marginTop: "30px" }}>
				<Typography variant="h6" style={{ color: "#00C853", boxSizing: "border-box", paddingLeft: "30px", paddingTop: "30px",paddingBottom: "20px" }}>
					Items
				</Typography>
				<ReactDataSheet
					data={orderedItems}
					valueRenderer={cell => cell.value}
					dataEditor={props => {
						if (props.col === 1 && props.row !== orderedItems.length-1)
							return (
								<Autocomplete
									onKeyDown={e => {
										if (e.keyCode === 27) props.onRevert()
									}}
									openMenuOnFocus
									autoFocus
									value={""}
									onChange={item => {
										setOrderItems(items => {
											let total = 0;
											items[props.row] = [
												{value: "",width:"100px",readOnly:true},
												{ value: item.label, width: "400px" },
												{ value: item.price, width: "400px" },
												{ value: 1, width: "400px" },
												{ value: item.price, width: "400px" },
											]

											for (let i = 1; i < items.length - 1; i++)total += Number(items[i][4].value)
											items[items.length - 1][1].value = total;

											if (items[items.length - 2][1].value !== "")
												items.splice(items.length - 1, 0, [
													{value: "",width:"100px",readOnly:true},
													{ value: "", width: "400px" },
													{ value: null, width: "400px" },
													{ value: null, width: "400px" },
													{ value: null, width: "400px" },
												])
											const subitems = [];
											let index = 1;
											for(let i=1;i<items.length-2;i++){
												items[i][0].value = i.toString()
												if(constItems.hasOwnProperty(items[i][1].value)){
													for(let subitem of constItems[items[i][1].value].subitems){
														subitems.push([
															{value:index++,width:"100px",readOnly:true},
															{value:subitem,width:"800px",readOnly:true},
															{value:"1",width:"800px",readOnly:true}
														])
													}
												}
											}								
											setOrderSubitems(orderedSubitems=>{
												orderedSubitems = orderedSubitems.splice(0,1);
												orderedSubitems.push(...subitems);
												return [...orderedSubitems];
											})
											return [...items];
										})
										props.onRevert();
									}}
									options={options}
								/>)
						else
							return (
								<input type="number" autoFocus onKeyDown={e => {
									if (e.keyCode === 27) props.onRevert()
									if (e.keyCode === 13) {
										if (e.target.value !== "" && orderedItems[props.row][props.col].value !== null) {
											setOrderItems(items => {
												items[props.row][props.col].value = e.target.value;
												if(props.row !== items.length - 1){
													if (props.col === 2 || props.col === 3) {
														items[props.row][4].value = Number(items[props.row][2].value) * Number(items[props.row][3].value);
													}
													let total = 0;
													for (let i = 1; i < items.length - 1; i++)total += Number(items[i][4].value)
													items[items.length - 1][1].value = total;
												}	
												return [...items];
											});
										}
										props.onRevert();
									}
								}} defaultValue={props.value} required style={{ height: "100%", width: "100%", textAlign: "left", border: "none" }}>
								</input>
							);
					}}
					onCellsChanged={changes=>{
						changes.forEach(change=>{
							if(orderedItems[change.row][1].value !== "" && change.row !== orderedItems.length -1)
							setOrderItems(items=>{
								items.splice(change.row,1);
								let total = 0;
								
								for (let i = 1; i < items.length - 1; i++)total += Number(items[i][4].value)
								items[items.length - 1][1].value = total;

								const subitems = [];
								let index = 1;
								for(let i=1;i<items.length-2;i++){
									items[i][0].value = i.toString()
									if(constItems.hasOwnProperty(items[i][1].value)){
										for(let subitem of constItems[items[i][1].value].subitems){
											subitems.push([
												{value:index++,width:"100px",readOnly:true},
												{value:subitem,width:"800px",readOnly:true},
												{value:"1",width:"800px",readOnly:true}
											])
										}
									}
								}								
								setOrderSubitems(orderedSubitems=>{
									orderedSubitems = orderedSubitems.splice(0,1);
									orderedSubitems.push(...subitems);
									return [...orderedSubitems];
								})
								return [...items];
							})
						})
					}}
				/>
			</div>
			<div style={{ boxSizing: "border-box", padding: "0 10px", marginTop: "30px" }}>
				<Typography variant="h6" style={{ color: "#00C853", boxSizing: "border-box", paddingLeft: "30px", paddingTop: "30px",paddingBottom: "20px" }}>
					Sub Items
				</Typography>
				<ReactDataSheet
					data={orderedSubitems}
					valueRenderer={cell => cell.value}
				/>
			</div>
			<div style={{display:"flex", justifyContent:"space-between", marginTop: "30px",paddingRight:"50px",paddingLeft:"50px" }}>
				<div>
					<Typography variant="button" style={{marginRight:"10px"}}>Advance:</Typography>
					<TextField  value={advance} onChange={e=>setAdvance(Number(e.target.value))}/>
				</div>
				<div>
					<Typography variant="button" style={{marginRight:"10px"}}>Balance:</Typography>
					<Typography variant="button">{Number(orderedItems[orderedItems.length-1][1].value)-advance}</Typography>
				</div>

			</div>
			<div style={{display:"flex",justifyContent:"space-between",padding:"20px"}}>
					<div><Checkbox 
						onChange = {handleGst}
						value = "primary"
						inputProps = {{'aria-label':'primary checkbox'}}
					/> GST </div>
					<div>
						<Checkbox 
							onChange = {handleConfirmed}
							value = "primary"
							inputProps = {{'aria-label':'primary checkbox'}}
						/> Confirm
					</div>
					<div>
						<Button variant="contained" color="primary">
						Print Order
						</Button>
					</div>
					<div>
						<Button variant="contained" color="primary" onClick={send}>
						Place Order
						</Button>
					</div>
			</div>
		</div>
	);
}