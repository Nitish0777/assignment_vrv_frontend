import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Details from './Details';
import AdminControl from './AdminControl';
import PrivateRoute from './PrivateRoute';
import Reset from './Reset';
import  SetPassword from './SetPassword'
import ShowData from './ShowData';
import four  from './four'

const isAuthenticated = () =>  !!sessionStorage.getItem('auth-token');

const Routes = () => {
    return (
        <>
                    <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login">
                {isAuthenticated() ? <Redirect to="/" /> : <Login />}
            </Route>
            <Route exact path="/signup">
                {isAuthenticated() ? <Redirect to="/" /> : <Signup />}
            </Route>
            <PrivateRoute exact path="/all-details" component={AdminControl} />
            <Route exact path="/reset" component={Reset} />
            <Route exact path="/set-password/:token" component={SetPassword} />
            <PrivateRoute exact path="/showdata" component={ShowData} />
            <Route path="*" component={four} />
        </Switch>

        </>
    )
}
export default Routes;