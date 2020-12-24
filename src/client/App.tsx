import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import Landing from './pages/Landing'
import GamesList from './pages/GamesList'
import Game from './pages/Game'
import { checkSocketConnection } from './middlewares/socket'
import { UserContext } from './utils/userContext'
import './App.css'

type PrivateRouteProps = { children: React.ReactNode, path: string }

function PrivateRoute({ children, path }: PrivateRouteProps) {
  const connected = checkSocketConnection()

  return (
    <Route
      path={path}
      render={({ location }) =>
        connected ? (
          children
        ) : (
          <Redirect
            to={{
            pathname: "/",
            state: { from: location }
            }}
          />
        )
      }
    />
  )
}

function App() {

  const [user, setUser] = React.useState({
    username: '',
    id: ''
  })

  return (
    <UserContext.Provider value={user}>
      <Router >
        <Switch>
      
          {/* <PrivateRoute path="/games"> */}

          <Route exact path="/games">
            <GamesList />
          </Route>
          {/* </PrivateRoute> */}

          {/* <PrivateRoute path="/game"> */}
          <Route path="/game">
            <Game />
          </Route>
          {/* </PrivateRoute> */}
          
          <Route path="/">
            <Landing setUser={setUser} />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  )
}

export default App