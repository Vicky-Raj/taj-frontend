import React, { useEffect } from 'react'
import MaterialTable from 'material-table'
import Axios from 'axios'

export default function MaterialTableDemo() {
	const [customerState, setCustomerState] = React.useState({
		columns: [
			{ title: 'Name', field: 'name' },
			{ title: 'Phone Number ', field: 'phoneNumber' },
			{ title: 'Email Address', field: 'emailAddress', type: 'email' },
			{
				title: 'BillID ',
				field: 'bill',
			},
			{
				title: 'Address',
				field: 'address',
			},
		],
		data: [
			{
				name: 'Santhosh',
				phoneNumber: 5557575757575,
				emailAddress: 's@gmail.com',
				bill: '63333',
				address: 'Kovaipudur',
			},
			{
				name: 'Vishnu',
				phoneNumber: 555757575752,
				emailAddress: 'v@gmail.com',
				bill: '63332',
				address: 'Gandhipuram',
			},
		],
	})

	useEffect(() => {
		const getCustomers = async () => {
			let res = await Axios.get('http://127.0.0.1:8000/hotel/customers')
			console.log(res.data)

			let customers = res.data.map(el => ({
				name: el.name,
				phoneNumber: el.phone_number,
				emailAddress: el.email,
				bill: el.u_id,
				address: el.address,
			}))

			setCustomerState(state => ({
				...customerState,
				data: customers,
			}))
		}
		console.log('component mounted')

		getCustomers()
	}, [])
	return (
		<MaterialTable
			title='Customer data'
			columns={customerState.columns}
			data={customerState.data}
		/>
	)
}
