import React, {Component} from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";



class MyActiveJobs extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            enteredsop: "",
            userdetails: [],
            users: [],
            applications: [],
            jobs: [],
            sortedJobs: [], 
            sortName:true, 
            showform: false,
            posmax: -1,
            appmax: -1,
            title: "",
            description: "",
            type: "",
            typeError: "",
            duration: -1,
            durationError: "",
            durationstr: "",
            salary: -1,
            salaryError: "",
            posmax: 1,
            appmax: 10,
            appmaxError: "",
            numpos: 0,
            numapp: 0,
            app: 0,
            address: "",
            addressError: "",
            skills: [],
            skillstr: "",
            rating: 0,
            deadline: new Date(),
            editing: ""
        };
        this.deljob = this.deljob.bind(this);
        this.editJob = this.editJob.bind(this);
        this.editJobSubmit = this.editJobSubmit.bind(this);
        this.apply = this.apply.bind(this);
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    

    componentDidMount() {
        const { user } = this.props.auth;
        axios.get('http://localhost:4000/user/'+ user.id)
                .then(response => {
                    this.setState({userdetails: response.data});
                })
                .catch(function(error) {
                    console.log(error);
                })
        axios.get('http://localhost:4000/job/get_jobs')
            .then(response => {
                this.setState({jobs: response.data, sortedJobs:response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/user/')
            .then(response => {
                this.setState({users: response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/application/get_applications')
            .then(response => {
                this.setState({applications: response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
            errors: nextProps.errors
            });
        }
    }

    getjob(jobId)
    {
        let job = this.state.jobs.filter(item => item._id === jobId)[0];
        return job;
    }

    deljob(id) {
        let applicationsArray = this.state.applications;
        let usersArray = this.state.users;
        axios
            .delete('http://localhost:4000/job/del_job/' + id)
            .then(response => {
                alert("training deleted successfully.");
            })
            .catch(function(error) {
                console.log(error);
            })

        applicationsArray.filter(item => item.jobId === id && item.status === "Accepted").forEach(
            function(appli) 
            {
                const editEmployee = {
                    working: false
                }
                axios
                    .put('http://localhost:4000/user/edit_profile/' + appli.applicantId, editEmployee)
                    .then(response => {
                        console.log(editEmployee);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            })
    
        applicationsArray.filter(item => item.jobId === id).forEach(
            function(appli) 
            {
                let applicant = usersArray.filter(item => item._id === appli.applicantId)[0];
                let nnumapp = +applicant.numapp;

                if(applicant.working === false)
                {
                    nnumapp = +nnumapp - 1;
                    if(nnumapp < 0) nnumapp = 0;
                }

                const editApplicant = {
                    numapp: nnumapp
                };

                axios
                    .put('http://localhost:4000/user/edit_profile/' + appli.applicantId, editApplicant)
                    .then(response => {
                        console.log(editApplicant);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })

                const editAppli = {
                    status: "Deleted"
                }

                axios
                    .put('http://localhost:4000/application/edit_application/' + appli._id, editAppli)
                    .then(response => {
                        console.log(editAppli);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            })

        
        // to refresh
        this.props.history.push('/viewMyActiveJobs');
        this.props.history.push('/viewMyActiveJobs');
        this.props.history.goBack();
        window.location.reload();
        
    }

    editJob(job) {
        let show = !this.state.showform;
        this.setState({ showform: show});
        this.setState({ editing: job._id });
        console.log(this.state.showform);
        this.setState({ title: job.title });
        this.setState({ description: job.description });
        this.setState({ type: job.type });
        this.setState({ salary: job.salary });
        this.setState({ durationstr: job.durationstr });
        this.setState({ address: job.address });
        this.setState({ skillstr: job.skillstr });
        this.setState({ appmax: job.appmax });
        this.setState({ posmax: job.posmax });
        if(job.deadline)
        {
            job.deadline = job.deadline.toString();
            job.deadline = job.deadline.substring(0,10);
            this.setState({ deadline: job.deadline });
        }
        // to refresh
        // this.props.history.push('/viewMyActiveJobs');
    }

    onBack() {
        let show = !this.state.showform;
        this.setState({ showform: show});
        this.setState({ editing: "" });
        
        // to refresh
        this.props.history.push('/viewMyActiveJobs');
    }

   //onSubmit= e => {
   //    e.preventDefault();
   //    let euser = this.state;
   //    
   //    const { job } = this.props.auth;
   //    //euser.skills = this.state.skillstr.split(',');
   //    

   //    const editJob = {
   //        recruiter: this.state.userdetails,
   //        recruiterName: this.state.userdetails.name,
   //        title: euser.title,
   //        
   //    };
   //    
   //    
   //        axios
   //            .put('http://localhost:4000/job/edit_job/' + job._id, editJob)

   //            .then(response => {
   //                console.log(editJob);
   //                alert("Job added successfully!");
   //                // to refresh
   //                this.props.history.push("/viewMyActiveJobs");
   //                this.props.history.goBack();
   //            })
   //            .catch(function(error) {
   //                console.log(error);
   //                alert("Job NOT added successfully!");
   //            })
   //    
   //};

   editJobSubmit(job) {
    const idToChange = job._id;
    const euser = this.state;
    const upJob = {
        recruiter: this.state.userdetails,
        recruiterName: this.state.userdetails.name,
        title: euser.title,
    }
        axios
            .put('http://localhost:4000/job/edit_job/' + idToChange, upJob)
            .then(response => {
                console.log(upJob);
                alert("training added successfully!");
                this.props.history.push("/viewMyActiveJobs");
                this.props.history.goBack();
            })
            .catch(function(error) {
                alert("training couldn't be updated!");
                console.log(error);
            })
    
    // to refresh
    
    let show = !this.state.showform;
    this.setState({ showform: show});
    // window.location.reload();
}

///////////////////////////////////////////////apply

applied(job) {
    const { user } = this.props.auth;
    let num = 0;
    let arr = this.state.applications.filter(item => item.jobId === job._id && item.applicantId === user.id && (item.status === "Applied" || item.status === "Shortlisted" || item.status === "Accepted"));
    num = arr.length;
    if(num>0) return true;
    else return false;
}

apply(job)
{
    if(this.state.userdetails.numapp >= 10)
    {
        alert("Maximum open applications of 10 reached. Take a break!");
    }
    else if(this.state.userdetails.working === true)
    {
        alert("You are already accepted into one of the jobs you applied for. Check My Applications page.");
    }
    else
    {
        let show = !this.state.showform;
        this.setState({ showform : show });
        let editid = job._id;
        this.setState({ editing : editid });
        console.log(this.state.showform);
        this.props.history.push('/');
        this.props.history.goBack();
    }
}

onSOPsubmit(job)
{
    const { user } = this.props.auth;
    const newApplication = {
        jobId: job._id,
        applicantId: user.id,
        recruiterId:job.recruiter,
        stage: 0,
        status: "Applied",
        sop: this.state.enteredsop,
        salary: job.salary,
        recruiterName: job.recruiterName,
        rating: -1,
        title: job.title
    };

    let nnumapp = +job.numapp + 1;

    const editJob = {
        numapp: nnumapp 
    }

    let appnumapp = +this.state.userdetails.numapp + 1;

    const editApplicant = {
        numapp:  appnumapp
    }

    let num = this.state.enteredsop.split(' ').length;

    let soperror = "";
    if(num>250)
    {
        soperror = "Maximum 250 words allowed.";
        this.setState({sopError: soperror});
    }

    if(num <= 250 && this.state.userdetails.numapp <= 10)
    {
        axios
            .post('http://localhost:4000/application/add_application', newApplication)
            .then(response => {
                console.log(newApplication);
                alert("Application sent successfully!");
            })
            .catch(function(error) {
                console.log(error);
                alert("Application could not be sent.");
            })
        axios
            .put('http://localhost:4000/job/edit_job/' + job._id, editJob)
            .then(response => {
                console.log(editJob);
            })
            .catch(function(error) {
                console.log(error);
            })
        axios
            .put('http://localhost:4000/user/edit_profile/' + user.id, editApplicant)
            .then(response => {
                console.log(editApplicant);
            })
            .catch(function(error) {
                console.log(error);
            })
            this.setState({ editting : "" });
        
        this.props.history.push('/');
        this.props.history.goBack();
    }
    else {
        alert("SOP cannot have more than 250 words.");
    }
}

/////////////////////////////////////////////////////////////
    render() 
    {
        let Applications;
        const userRole = this.state.userdetails.role;
        const userid = this.state.userdetails._id;
        let MyActiveJobs;
        if(userRole === "applicant") {
            MyActiveJobs =
            <div>
                <Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h3> Training Listing </h3>
                            <Tooltip title="Add Job" aria-label="added">
                            <Link style={{ color: '#009900', weight: 'bold' }} to="/addJob"><i className="material-icons"><h2> add</h2></i></Link>
                            </Tooltip>
                        </ListItem>
                    </List>
                </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Date of posting</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Duration</TableCell>
                                            <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.jobs.filter(item => item.recruiter === userid && item.numpos < item.posmax).map((job,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.dateOfPost.substring(0,10)}</TableCell>
                                            <TableCell>{job.type}</TableCell>
                                            <TableCell>{job.duration}</TableCell>
                                            



                                    
                                
                                            
                                            {!this.applied(job) && job._id !== this.state.editing && !(job.numpos >= job.posmax || job.numapp >= job.appmax)?
                                             <TableCell>
                                                <Tooltip title="Apply for this job" aria-label="apply">
                                                    <button
                                                        className="btn btn-primary btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.apply(job)}>
                                                        Apply
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <div></div>

                                            }
                                            {this.applied(job)?
                                            
                                            <TableCell>
                                                <Tooltip title="Applied for this job" aria-label="applied">
                                                    <button
                                                        className="btn btn-secondary btn-sm waves-effect waves-light hoverable blue accent-3">
                                                        Applied
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            : <div></div>

                                            }
                                            {(job.numpos >= job.posmax || job.numapp >= job.appmax) && !this.applied(job)?
                                            
                                            <TableCell>
                                                <Tooltip title="No vacancy" aria-label="full">
                                                    <button
                                                        className="btn btn-danger disabled btn-sm waves-effect waves-light hoverable blue accent-3">
                                                        Full
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :
                                                <div></div>

                                            }

                                            {this.state.showform === true && job._id === this.state.editing?
                                            <TableCell>
                                                <div>
                                               
                                                    <button
                                                        className="btn btn-primary btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.onSOPsubmit(job)}>
                                                        Apply
                                                    </button>
                                                </div>                                    
                                            </TableCell>
                                            : <TableCell></TableCell>
                                            }

                                        
                            
                                



                                 

                                            <TableCell>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary"/>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>
                                                            <Tooltip title="Delete Job" aria-label="delete">
                                                                <button
                                                                    className="btn waves-effect waves-light hoverable blue accent-3" 
                                                                    onClick={() => this.deljob(job._id)}>
                                                                    <i 
                                                                    style={{
                                                                        color: "#FF0000",
                                                                        }}
                                                                        className="material-icons">delete</i> Delete
                                                                </button> 
                                                            </Tooltip>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Tooltip title="Edit Job" aria-label="edit">
                                                                <button
                                                                    className="btn waves-effect waves-light hoverable blue accent-3" 
                                                                    onClick={() => this.editJob(job)}>
                                                                    <i 
                                                                    style={{
                                                                        color: "#0000FF",
                                                                        }}
                                                                        className="material-icons">edit</i>Edit
                                                                </button>
                                                            </Tooltip>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                 
                                            </TableCell>
                                            <TableCell>                   
                                            <div>
                                            { !this.state.showform || this.state.editing !== job._id ? 
                                                <div></div>
                                            : 
                                                <div>
                                                    <br></br>
                                                    <form noValidate onSubmit={this.onSubmit}>

                                                    <div className="input-field col s12">
                                                            <label htmlFor="title">Title</label><br></br>
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.state.title}
                                                                id="title"
                                                                type="text"
                                                                min="0"
                                                            />
                                                        </div>

                                                        <div className="input-field col s12">
                    <label htmlFor="description">Description</label><br></br>
                    <input
                        onChange={this.onChange}
                        value={this.state.description}
                        id="description"
                        type="text"
                    />
                </div>
                <div className="input-field col s12">
                    <label htmlFor="type">Type</label><br></br>
                    <input
                        value={this.state.type} 
                        onChange={this.onChange}
                        id="type"
                        type="text"
                    />
                    <select 
                        value={this.state.type} 
                        onChange={this.onChange}
                        id="type"
                    >
                        <option value="">Select type</option>
                        <option value="fullTime">Full-time</option>
                        <option value="partTime">Part-time</option>
                    </select>
                    <div style={{ fontSize: 12, color: "red" }}>
                        {this.state.typeError}
                    </div>
                </div> 
                <div className="input-field col s12">
                    <label htmlFor="salary">Salary</label><br></br>
                    <input
                        onChange={this.onChange}
                        value={this.state.salary}
                        id="salary"
                        type="number"
                        min="-1"
                    />
                    <div style={{ fontSize: 12, color: "red" }}>
                        {this.state.salaryError}
                    </div>
                </div>
                <div className="input-field col s12">
                    <label htmlFor="durationstr">Duration</label><br></br>
                    <input
                       value={this.state.durationstr} 
                       onChange={this.onChange}
                       id="type"
                    />
                    <select 
                        value={this.state.durationstr} 
                        onChange={this.onChange}
                        id="durationstr"
                        
                    >
                        <option value="">Select duration</option>
                        <option value = "0" >Indefinite</option>
                        <option value="1">1 month</option>
                        <option value="2">2 months</option>
                        <option value="3">3 months</option>
                        <option value="4">4 months</option>
                        <option value="5">5 months</option>
                        <option value="6">6 months</option>
                    </select>
                    <div style={{ fontSize: 12, color: "red" }}>
                        {this.state.durationError}
                    </div>
                </div> 
                <div className="input-field col s12">
                    <label htmlFor="address">Address</label><br></br>
                    <input
                        onChange={this.onChange}
                        value={this.state.address}
                        id="address"
                        type="text"
                    />
                    <div style={{ fontSize: 12, color: "red" }}>
                        {this.state.addressError}
                    </div>
                </div>
                <div className="input-field col s12">
                    <label htmlFor="skillstr">Skills</label><br></br>
                    <input
                        onChange={this.onChange}
                        value={this.state.skillstr}
                        id="skillstr"
                        type="text"
                    />
                </div>
                                                        <div className="input-field col s12">
                                                            <label htmlFor="deadline">Deadline for application</label><br></br>
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.state.deadline}
                                                                id="deadline"
                                                                type="date"
                                                            />
                                                        </div>
                                                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                                        <button
                                                        style={{
                                                            color: "#0000FF",
                                                            }}
                                                            className="btn btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                            onClick={() => this.onBack()}>
                                                            <b>Back</b>
                                                        </button>
                                                        <button
                                                        style={{
                                                            color: "#009900",
                                                            }}
                                                            className="btn btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                            onClick={() => this.editJobSubmit(job)}
															
                                                            >
                                                            <b>Save</b>
                                                        </button>
                                                        </div>
                                                    </form>
                                                </div>  
                                            }
                                            </div>
                                            </TableCell>
                                        </TableRow> 
                                ))}
                                </TableBody>
                            </Table>
                        </Paper>               
                    </Grid>    
                </Grid>            
            </div>
        }
        return (
            <div style={{ height: "75vh" }} className="valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Text>
                                    {MyActiveJobs}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

MyActiveJobs.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
)(MyActiveJobs);