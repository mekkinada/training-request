import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import UsersList from './components/Users/UsersList'
import Home from './components/Common/Home'
import Register from './components/Common/Register'
import Login from './components/Common/Login'
import Navbar from './components/templates/Navbar'
import Profile from './components/Users/Profile'
import EditProfile from './components/Users/EditProfile'
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/Users/Dashboard";
import AddEducation from "./components/Applicant/AddEducation";
import JobsList from "./components/Applicant/JobsList";
import MyApplications from "./components/Applicant/MyApplications";
import CreateJob from "./components/Recruiter/CreateJob";
import MyActiveJobs from "./components/Recruiter/MyActiveJobs";
import AppList from "./components/Recruiter/AppList";
import Employees from "./components/Recruiter/Employees";



if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000; 
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
 
    window.location.href = "./login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Navbar/>
          <br/>
          <Route path="/" exact component={Home}/>
          <Route path="/users" exact component={UsersList}/>
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login} />
          <Switch>
              <PrivateRoute path="/dashboard" exact component={Dashboard} />
              <PrivateRoute path="/profile" exact component={Profile} />
              <PrivateRoute path="/editprofile" exact component={EditProfile} />
              <PrivateRoute path="/addeducation" exact component={AddEducation} />
              <PrivateRoute path="/addJob" exact component={CreateJob} />
              <PrivateRoute path="/viewMyActiveJobs" exact component={MyActiveJobs} />
              <PrivateRoute path="/employees" exact component={Employees} />
              <PrivateRoute path="/jobsList" exact component={JobsList} />
              <PrivateRoute path="/myApplications" exact component={MyApplications} />
              <PrivateRoute path="/appList" exact component={AppList} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
