import MaterialTable from 'material-table'
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

const Table = propsy => {

	const [state, setState] = useState({
		columns: [
			{
				title: 'item',
				field: 'item',
				editComponent: props => (
					<Autocomplete
						options={propsy.list}
						getOptionLabel={option => option.title}
						style={{ width: 300 }}
						onChange={(e, v) => {
							props.onChange(v.title)
						}}
						renderInput={params => (
							<TextField
								{...params}
								label='Combo box'
								variant='outlined'
								fullWidth
							/>
						)}
					/>
				),
			},
			{ title: 'Qty', field: 'quantity', type: 'numeric' },
			{ title: 'Rate', field: 'rate', type: 'numeric', editable: 'never' },
			{ title: 'Amount', field: 'amount', type: 'numeric', editable: 'never' },
		],
		data: [],
		total: 0,
	})

	return (
		<>
		
		<MaterialTable
			title='Add Orders'
			columns={state.columns}
			data={state.data}
			style={{ width: '90%' }}
			{...propsy}
			editable={{
				onRowAdd: newData =>
					new Promise(resolve => {
						setTimeout(() => {
							resolve()
							setState(prevState => {
								var index = 0
								propsy.list.forEach((e, i) => {
									if (e.title == newData.item) index = i
								})

								console.log(propsy.list[index]);
								

								const newlist = {
									...newData,
									rate: propsy.list[index].rate,
									amount: propsy.list[index].rate * newData.quantity,
									unique_id: propsy.list[index].unique_id
								}
								// console.log('---------')

								// console.log(propsy.list[index])
								// console.log(newData.quantity)

								// console.log('---------')
								const data = [...prevState.data, newlist]
								var total = 0
								data.forEach(e => {
									total += e.amount
								})
								propsy.seth(total, data)

								return {
									...prevState,
									data,
									total,
								}
							})
						}, 600)
					}),
				onRowUpdate: (newData, oldData) =>
					new Promise(resolve => {
						setTimeout(() => {
							resolve()
							if (oldData) {
								setState(prevState => {
									var index = 0
									propsy.list.forEach((e, i) => {
										if (e.title == newData.item) index = i
									})

									const newlist = {
										...newData,
										rate: propsy.list[index].rate,
										amount: propsy.list[index].rate * newData.quantity,
									}
									const plist = [...prevState.data]
									const newplist = plist.filter(e => e.item != oldData.item)
									const data = [...newplist, newlist]

									console.log(propsy.list[index])
									console.log(newData.quantity)
									console.log()

									var total = 0
									data.forEach(e => {
										total += e.amount
									})
									propsy.seth(total, {
										list: propsy.list[index],
										qty: newData.quantity,
										type: 'update',
									})
									return {
										...prevState,
										data,
										total,
									}
								})
							}
						}, 600)
					}),
				onRowDelete: oldData =>
					new Promise(resolve => {
						setTimeout(() => {
							resolve()
							setState(prevState => {
								const data = [...prevState.data]
								data.splice(data.indexOf(oldData), 1)
								var total = 0
								data.forEach(e => {
									total += e.amount
								})
								console.log(oldData)

								propsy.seth(total, { title: oldData.item, type: 'delete' })

								return { ...prevState, data }
							})
						}, 600)
					}),
			}}
		/>
		</>
	)
}

export default Table
