import * as React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from "react-router-dom"
import Landing from './pages/Landing'
import GamesList from './pages/GamesList'
import Game from './pages/Game'
// import { ErrorBoundary } from 'react-error-boundary'

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

// function ErrorFallback({error, resetErrorBoundary}) {
//   return (
//     <div role="alert">
//       <p>Something went wrong:</p>
//       <pre>{error.message}</pre>
//       <button onClick={resetErrorBoundary}>Try again</button>
//     </div>
//   )
// }

function App() {

  const history = useHistory()

  return (
    // <Router history={history}>
    <Router >
      <Switch>
        <Route exact path="/landing">
          <Landing />
        </Route>
          <PrivateRoute path="/games-list">
        {/* <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // reset the state of your app so the error doesn't happen again
            localStorage.removeItem('red_tetris_token')
            window.location = '/landing'
          }}
        > */}
            <GamesList />
        {/* </ErrorBoundary> */}
          </PrivateRoute>
          <PrivateRoute path="/">
            <Game />
          </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default App