import React from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import Sidenav from './components/includes/Sidenav'
import Header from './components/includes/Header'

import Neworder from './components/main/Neworder'
import History from './components/main/History'
import Vieworder from './components/main/Vieworder'
import Info from './components/main/Info'
import Login from './components/auth/Login'
import OrderDetails from './components/main/vieworder/OrderDetails'
import Print from './components/helpers/Print'


const App = () => {
	return (
		<Router>
			<div className='App' style={{marginTop:"5rem"}}>
				<Header />
				<Grid container spacing={3} style={{ padding: 20 }}>
					<Grid item xs={2}>
						<Sidenav />
					</Grid>
					<Grid item xs={10}>
						<Switch>
							<Route path='/' exact component={Login} />
							<Paper>
								<Route path='/neworder' exact component={Neworder} />
								<Route path="/order/:id" exact>
									<OrderDetails/>
								</Route>
								<Route path='/print' exact component={Print} />
								<Route path='/vieworder' exact component={Vieworder} />
								<Route path='/history' exact component={History} />
								<Route path='/info' exact component={Info} />
							</Paper>
						</Switch>
					</Grid>
				</Grid>
			</div>
		</Router>
	)
}

export default App
