import React from 'react'
import Canvas from './components/Canvas'
import Navbar from './components/Navbar'
import Settingsbar from './components/Settingsbar'
import Toolbar from './components/Toolbar'
import { Switch, Route, Redirect } from "react-router-dom";

const App = () => {
	return (
		<div>
			<Switch>
				<Route path='/:id'>
					<Navbar/>
					<Toolbar/>
					<Settingsbar/>
					<Canvas/>
				</Route>
				<Redirect to={`/f${(+new Date).toString(16)}`} />
			</Switch>
		</div>
	)
}

export default App
