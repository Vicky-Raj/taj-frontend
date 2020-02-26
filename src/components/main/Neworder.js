import React, { useState, useEffect } from "react";
import {
	Typography,
	TextField,
	Select,
	MenuItem,
	InputLabel
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
	const [orderedItems, setOrderItems] = useState([
		[
			{ value: "Name", readOnly: true, width: "400px", className: "header" },
			{ value: "Price", readOnly: true, width: "400px", className: "header" },
			{ value: "Quantity", readOnly: true, width: "400px", className: "header" },
			{ value: "Total", readOnly: true, width: "400px", className: "header" },
		],
		[
			{ value: "", width: "400px" },
			{ value: null, width: "400px" },
			{ value: null, width: "400px" },
			{ value: null, width: "400px" },
		],
		[
			{ value: "Total Amount", colSpan: 3, width: "400px", readOnly: true },
			{ value: 0, width: "400px" }
		]
	]);
	useEffect(() => {
		axios.get(`${URL}/hotel/items/`)
			.then(({ data }) => {
				setOptions(data.map(item => ({
					label: item.name,
					id: item.unique_id,
					price: item.price
				})))
			})
	}, [])
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
				<ReactDataSheet
					data={orderedItems}
					valueRenderer={cell => cell.value}
					dataEditor={props => {
						if (props.col === 0)
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
												{ value: item.label, width: "400px" },
												{ value: item.price, width: "400px" },
												{ value: 1, width: "400px" },
												{ value: item.price, width: "400px" },
											]

											for (let i = 1; i < items.length - 1; i++)total += Number(items[i][3].value)
											items[items.length - 1][1].value = total;

											if (items[items.length - 2][0].value !== "")
												items.splice(items.length - 1, 0, [
													{ value: "", width: "400px" },
													{ value: null, width: "400px" },
													{ value: null, width: "400px" },
													{ value: null, width: "400px" },
												])

											return [...items];
										})
										props.onCommit();
									}}
									options={options}
								/>)
						else
							return (
								<input type="number" autoFocus onKeyDown={e => {
									if (e.keyCode === 27) props.onRevert()
									if (e.keyCode === 13) {
										if (e.target.value !== "" && orderedItems[props.row][props.col].value) {
											setOrderItems(items => {
												items[props.row][props.col].value = e.target.value;
												if(props.row !== items.length - 1){
													if (props.col === 1 || props.col === 2) {
														items[props.row][3].value = Number(items[props.row][1].value) * Number(items[props.row][2].value);
													}
													let total = 0;
													for (let i = 1; i < items.length - 1; i++)total += Number(items[i][3].value)
													items[items.length - 1][1].value = total;
												}	
												return [...items];
											});
										}
										props.onCommit()
									}
								}} defaultValue={props.value} required style={{ height: "100%", width: "100%", textAlign: "left", border: "none" }}>
								</input>
							);
					}}
				// onCellsChanged={data=>console.log(data)}
				/>
			</div>
		</div>
	);
}