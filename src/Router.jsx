import React from 'react'
import { Switch, Route } from 'react-router-dom'

const LoadGame = React.lazy(() => import('./screens/Auth/LoadGame'))
const NotFoundPage = React.lazy(() => import('./screens/Error/NotFoundPage'))
const LoadQuiz = React.lazy(() => import('./screens/Quiz/LoadQuiz'))

export default function Router(props) {
    return (
        <Switch>
            <Route path="/" exact component={LoadGame} />
            <Route path="/quiz/:quizId" exact component={LoadQuiz} />
            { /* 404 not found page */ }
            <Route component={NotFoundPage} />
        </Switch>
    )
}