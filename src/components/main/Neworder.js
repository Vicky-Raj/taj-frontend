import React,{useState,useEffect,useRef} from "react";
import {useParams} from "react-router-dom";
import MaterialTable from 'material-table'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {TextField,
	Select,
	TextareaAutosize,
	Typography,
	MenuItem,
	InputLabel,
	Snackbar,
	SnackbarContent,
	Button
} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'
import axios from "axios";
import {URL} from "../../index";
import {Error,ShoppingCart,Print} from "@material-ui/icons";
import {red,deepPurple} from "@material-ui/core/colors"

export default ()=>{
	console.log(useParams());
	const name = useRef();
	const email = useRef();
	const phoneNo = useRef();
	const address = useRef();
	const [date,setDate] = useState(new Date());
	const [session,setSession] = useState("FN");

	const [total,setTotal] = useState(0);
	const [advance,setAdvance] = useState(0);

	const [items,setItems] = useState([]);
	const [subItems,setSubItems] = useState([]);

	const [orderedItems,setOrderedItems] = useState([]);
	const [orderedSubItems,setOrderedSubItems] = useState([]);


	const [error,setError] = useState(false);

	useEffect(()=>{
		axios.get(`${URL}/hotel/items`)
		.then(({data})=>{
			setItems(data.items);
			setSubItems(data.subitems);
		})
		.catch(err=>console.log(err))

		// axios.get(`${URL}/hotel/order/`,{params:{id}})
		// .then(({data})=>{
		// 	console.log(data);
		// })
		// .catch(err=>console.log(err))
	},[])

	const addSubItems = item=>{
		item.subitems.forEach(subItemName=>{
			const subitem = subItems.filter(subItem=>subItem.name === subItemName)[0];
			setOrderedSubItems(subItems=>[...subItems,{
				item:subitem,
				quantity:1,
				rate:subitem.price,
				amount:subitem.price
			}])
		})
	}

	useEffect(()=>{
		let total = 0;
		total = orderedItems.reduce((acc,current)=>acc + +current.amount,0);
		total += orderedSubItems.reduce((acc,current)=>acc + +current.amount,0);
		setTotal(total);
	},[orderedSubItems,orderedItems])

	const validate = ()=>{
		return(name.current.value.trim().length !== 0 &&
		email.current.value.trim().length !== 0 &&
		phoneNo.current.value.trim().length !== 0 && 
		address.current.value.trim().length !== 0 &&
		orderedItems.length !== 0
		);

	}

	const sendData = ()=>{
		const allItems = orderedItems.map(item=>({
			...item.item,
			quantity:item.quantity,
			amount:item.amount
		}));
		const allSubItems = orderedSubItems.map(item=>({
			...item.item,
			quantity:item.quantity,
			amount:item.amount
		}));
		const customer = {
			name:name.current.value,
			email:email.current.value,
			phoneNo:phoneNo.current.value,
			address:address.current.value,
			date,
			session
		}
		axios.post(`${URL}/hotel/order/`,{items:allItems,subItems:allSubItems,customer,total,advance,balance:total-advance})
		.then()
		.catch()
	}

	const placeAndSave = ()=>{
		if(validate()){
			sendData();
		}else setError(true)
	}

	const printAndSave = ()=>{
		if(validate()){

		}else setError(true)
	}

	return (
		<div style={{ maxWidth: '100%' }}>
		<div style={{display:"flex",height:"280px",padding:"1.5rem",boxSizing:"border-box"}}>
			<div style={{display:"flex",flexDirection:"column",justifyContent:"space-around",flex:"2"}}>
				<Typography variant="h6" style={{color:"#00C853"}}>Customer Details</Typography>
				<TextField
				label="Name"
				inputRef={name}
				/>
				<TextField
				label="Email"
				inputRef={email}
				/>
				<TextField
				label="PhoneNo"
				inputRef={phoneNo}
				/>
			</div>


			<div style={{flex:"3"}}></div>

	
			<div style={{display:"flex",flexDirection:"column",flex:"2",justifyContent:"space-around"}}>

			{/* Date Picker */}

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

			<InputLabel id="demo-simple-select-label" style={{marginTop:"20px"}}>Session</InputLabel>
			<Select 
			labelId="demo-simple-select-label"
			id="demo-simple-select"
			value={session}
			onChange={e=>setSession(e.target.value)}
			>
				<MenuItem value="FN">FN</MenuItem>
				<MenuItem value="AN">AN</MenuItem>
				<MenuItem value="EVENING">EVENING</MenuItem>
			</Select>

			<TextareaAutosize 
			rows={6} 
			cols={12} 
			placeholder="Address" 
			style={{marginTop:"25px"}}
			ref={address}
			/>
			</div>
		</div>
		<hr/>

			{/* Item Table */}
			
		<MaterialTable style={{margin:"3rem 3rem"}}
          columns={[
			{
				title: 'item',
				field: 'item',
				editComponent: props => (
					<Autocomplete
						value={props.value}
						options={items}
						getOptionLabel={option => option.name}
						style={{ width: 300 }}
						onChange={(e, value) => {
							props.onChange(value);
						}}
						renderInput={params => (
							<TextField
								{...params}
								label='Item Name'
								variant="standard"
								fullWidth
							/>
						)}
					/>
				),
				render:rowData=>rowData.item.name
			},
			{ title: 'Qty', field: 'quantity',initialEditValue:1,type:"numeric"},
			{ title: 'Rate', field: 'rate', type: 'numeric', editable: 'never' },
			{ title: 'Amount', field: 'amount', type: 'numeric', editable: 'never' }
		  ]}
		  title="Ordered Items"
		  data={orderedItems}
		  options={{
			rowStyle: {
			  backgroundColor: '#C6F6D5',
			  color:"0",
			},
			pageSize:10,
			pageSizeOptions:[10,20,40]
		  }}
		
    	editable={{
        onRowAdd: async (data)=>{
			if(data.item){
				const quantity = Number(data.quantity);
				const price = Number(data.item.price);
				setOrderedItems(state=>[...state,{
					item:data.item,
					quantity,
					rate:price,
					amount:quantity * price
				}])
				addSubItems(data.item);
			}
		},
        onRowUpdate: async (data,oldData) =>{
			if(data.item){
				const quantity = Number(data.quantity);
				const price = Number(data.item.price);
				setOrderedItems(state=>{
					state[oldData.tableData.id] ={
						item:data.item,
						quantity,
						rate:price,
						amount:quantity*price
					}
					return [...state];
				})
			}
		},
        onRowDelete: async oldData =>{
			setOrderedItems(state=>{
				state.splice(oldData.tableData.id,1);
				return [...state];
			})
		}
    	}}
	/>

		{/* SubItem Table */}

	<MaterialTable style={{margin:"3rem 3rem"}}
          columns={[
			{
				title: 'item',
				field: 'item',
				editComponent: props => (
					<Autocomplete
						value={props.value}
						options={subItems}
						getOptionLabel={option => option.name}
						style={{ width: 300 }}
						onChange={(e, value) => {
							props.onChange(value);
						}}
						renderInput={params => (
							<TextField
								{...params}
								label='Item Name'
								variant="standard"
								fullWidth
							/>
						)}
					/>
				),
				render:rowData=>rowData.item.name
			},
			{ title: 'Qty', field: 'quantity', type: 'numeric',initialEditValue:1},
			{ title: 'Rate', field: 'rate', type: 'numeric', editable: 'never' },
			{ title: 'Amount', field: 'amount', type: 'numeric', editable: 'never' }
          ]}
		  title="Ordered SubItems"
		  data={orderedSubItems}
		  options={{
			rowStyle: {
			  backgroundColor: '#C6F6D5',
			  color:"0",
			},
			pageSize:10,
			pageSizeOptions:[10,20,40]
		  }}
		
    	editable={{
        onRowAdd: async data =>{
			console.log(data);
			if(data.item){
				const quantity = Number(data.quantity);
				const price = Number(data.item.price);
				setOrderedSubItems(state=>[...state,{
					item:data.item,
					quantity,
					rate:price,
					amount:quantity * price
				}])
			}
		},
        onRowUpdate: async (data, oldData) =>{
			if(data.item){
				const quantity = Number(data.quantity);
				const price = Number(data.item.price);
				setOrderedSubItems(state=>{
					state[oldData.tableData.id] ={
						item:data.item,
						quantity,
						rate:price,
						amount:quantity*price
					}
					return [...state];
				})
			}
		},
        onRowDelete: async oldData =>{
			setOrderedSubItems(state=>{
				state.splice(oldData.tableData.id,1);
				return [...state];
			})
		}
    	}}
	/>
	<Snackbar
        anchorOrigin={{vertical:"top",horizontal:"center"}}
        open={error}
        autoHideDuration={5000}
        onClose={()=>setError(false)}>
        <SnackbarContent
        style={{backgroundColor:red[400]}}
        message={
            <span style={{display:"flex",alignItems:"center"}}>
                <Error style={{fontSize:20,marginRight:"1rem"}}/>
                Please Fill All The Fields
            </span>
        }
    />
	</Snackbar>
	<div style={{display:"flex",justifyContent:"space-around",height:"50px",fontFamily:"Roboto",fontSize:"1.3rem",color:"#4C51BF",fontWeight:"bold"}}>
		<div>
			T0TAL:
			<span style={{marginLeft:"10px"}}>₹{total}</span>
		</div>
		<div>
			ADVANCE:
			 <TextField value={advance} onChange={e=>setAdvance(e.target.value)} type="number" style={{marginLeft:"10px",paddingBottom:"20px"}}/>
		</div>
		<div>
			AMOUNT:
			<span style={{marginLeft:"10px"}}>₹{total-advance}</span>
		</div>
	</div>
	<div style={{display:"flex",justifyContent:"flex-end",padding:"1rem 2rem"}}>
	<Button
	variant="contained"
	startIcon={<ShoppingCart/>}
	style={{background:deepPurple[600],color:"#fff"}}
	onClick={placeAndSave}
	>
	Place And Save
	</Button>
	<div style={{margin:"0 10px"}}></div>
	<Button
	variant="contained"
	startIcon={<Print/>}
	style={{background:deepPurple[600],color:"#fff"}}
	onClick={printAndSave}
	>
		Print and save
	</Button>
	</div>
      </div>
	);
}