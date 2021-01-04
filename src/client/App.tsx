import React, { useState, useContext } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import { UserContext } from './utils/userContext'
import Landing from './pages/Landing'
import GamesList from './pages/GamesList'
import Game from './pages/Game'
import './App.css'

function PrivateRoute({ children, path, exact }: { children: React.ReactNode, path: string, exact?: boolean }) {
  const user = useContext(UserContext)

  if (!user.id)
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    )
  else
    return (
      <Route
        path={path}
        exact={exact}
        render={() => children}
      />
    )
}

function App() {

  const [user, setUser] = useState({
    username: '',
    id: ''
  })

  return (
    <UserContext.Provider value={user}>
      <Router >
        <Switch>

          <PrivateRoute exact path="/games">
            <GamesList />
          </PrivateRoute>

          <PrivateRoute path="/game">
            <Game />
          </PrivateRoute>
          
          <Route path="/">
            <Landing setUser={setUser} />
          </Route>

        </Switch>
      </Router>
    </UserContext.Provider>
  )
}

export default App