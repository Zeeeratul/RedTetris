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

import { useTheme, ThemeContext } from './utils/useTheme'
import './styles/App.css'

type PrivateRouteProps = { children: React.ReactNode, path: string }

// Route accessible only with a token
function PrivateRoute({ children, path }: PrivateRouteProps) {
  const token = localStorage.getItem('red_tetris_token')

  return (
    <Route
        path={path}
        render={({ location }) =>
            token ? (
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


const useSocket = () => {
  const socket = io('/', {
    // reconnection: false
  })

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })
    socket.on('disconnect', () => {
      console.log('disconnect')
    })
  }, [socket])

  const subscribeToEvent = (eventName: string, cb: (response: any) => any) => {
    if (socket)
      socket.on(eventName, (response: any) => {
        console.log(`Websocket event: '${eventName}' received!`)
        return cb(response)
      })
  }
  const emitToEvent = (eventName: string, data = {}, cb = null) => {
    if (socket) {
      if (cb) {
        socket.emit(eventName, data, cb)
      }
      else {
        socket.emit(eventName, data)
      }
    }
  }

  return {
    subscribeToEvent,
    emitToEvent
  }
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
          <Route exact path="/test">
            <p>test</p>
          </Route>
          <PrivateRoute path="/games-list">
            <GamesList />
          </PrivateRoute>
          <PrivateRoute path="/">
            <Game />
          </PrivateRoute>
        </Switch>
      </Router>
    </ThemeContext.Provider>
  )
}

export default App