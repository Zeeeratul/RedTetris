import * as React from 'react'
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
import { useTheme, ThemeContext } from './utils/useTheme'

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
            pathname: "/landing",
            state: { from: location }
            }}
          />
        )
      }
    />
  )
}

function App() {

  const value = useTheme()

  return (
    <ThemeContext.Provider value={value}>
      <Router >
        <Switch>
          <Route exact path="/landing">
            <Landing />
          </Route>

          <Route exact path="/games">
          {/* <PrivateRoute path="/games"> */}
            <GamesList />
          {/* </PrivateRoute> */}
          </Route>
          <PrivateRoute path="/">
            <Game />
          </PrivateRoute>
        </Switch>
      </Router>
    </ThemeContext.Provider>
  )
}

export default App