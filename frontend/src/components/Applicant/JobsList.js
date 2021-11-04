import React, {Component} from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Link } from "react-router-dom";

import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";
import Fuse from 'fuse.js';

class JobsList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userdetails: [],
            jobs: [],
            extraJobs: [], 
            applications: [],
            sortName:true, 
            recruiterName: "",
            showform: false,
            editing: "",
            enteredsop: "",
            sopError: "",
            sortbysalary:true,
            sortbyduration:true,
            sortbyrating:true,
            searchval: "",
            jobTypeFilterVal: "",
            salaryFilterMinVal: "",
            salaryFilterMaxVal: "",
            durationFilterVal: ""
        };
        this.renderSalaryIcon = this.renderSalaryIcon.bind(this);
        this.renderDurationIcon = this.renderDurationIcon.bind(this);
        this.renderRatingIcon = this.renderRatingIcon.bind(this);
        this.sortBySalary = this.sortBySalary.bind(this);
        this.sortByDuration = this.sortByDuration.bind(this);
        this.sortByRating = this.sortByRating.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.apply = this.apply.bind(this);
        this.onSOPsubmit = this.onSOPsubmit.bind(this);
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onFilter = e => {
        let jobTypeVal = this.state.jobTypeFilterVal;
        let salaryMinVal = this.state.salaryFilterMinVal;
        let salaryMaxVal = this.state.salaryFilterMaxVal;
        let durationVal = "";
        if(this.state.durationFilterVal !== "")
        {
            durationVal = parseInt(this.state.durationFilterVal);
        }
        let filteredJobs = this.state.extraJobs;
        if(jobTypeVal !== "" && jobTypeVal !== undefined)
        {
            filteredJobs = filteredJobs.filter(item => item.type === jobTypeVal);
        }
        if(salaryMinVal !== "" && salaryMinVal !== undefined)
        {
            filteredJobs = filteredJobs.filter(item => item.salary >= salaryMinVal);
        }
        if(salaryMaxVal !== "" && salaryMaxVal !== undefined)
        {
            filteredJobs = filteredJobs.filter(item => item.salary < salaryMaxVal);
        }
        if(durationVal !== "" && durationVal !== undefined)
        {
            filteredJobs = filteredJobs.filter(item => item.duration < durationVal);
        }
        this.setState({ jobs: filteredJobs });
    };

    onSearch = e => {
        this.setState({ searchval : e.target.value });
        let sval = this.state.searchval;
        if(sval === "" || sval === undefined)
        {
            this.setState({ jobs : this.state.extraJobs });
        }
        else
        {
            const options = {
                keys: ["title"]
            };
            const fuse = new Fuse(this.state.jobs, options);
            let result = fuse.search(sval);
            
            
            let n = result.length;
            let i = 0;
            let res = [];
            for( i = 0; i < n; i++) {
                res.push(result[i].item);
            }
            
            this.setState({ jobs : res });
            
            
        }
    };

    componentDidMount() {
        const { user } = this.props.auth;
        this.setState({ showform : false });
        axios.get('http://localhost:4000/user/'+ user.id)
                .then(response => {
                    this.setState({userdetails: response.data});
                })
                .catch(function(error) {
                    console.log(error);
                })
        axios.get('http://localhost:4000/job/get_jobs')
            .then(response => {
                this.setState({jobs: response.data, extraJobs:response.data});
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

    sortBySalary(){
        var array = this.state.jobs;
        var flag = this.state.sortbysalary;
        array.sort(function(a, b) {
            if(a.salary !== undefined && b.salary !== undefined){
                return (1 - +flag*2) * (+a.salary - +b.salary);
            }
            else{
                return 1;
            }
          });
        this.setState({
            jobs:array,
            sortbysalary:!this.state.sortbysalary,
        })
    }

    sortByDuration(){
        var array = this.state.jobs;
        var flag = this.state.sortbyduration;
        array.sort(function(a, b) {
            if(a.duration !== undefined && b.duration !== undefined){
                return (1 - +flag*2) * (+a.duration - +b.duration);
            }
            else{
                return 1;
            }
          });
        this.setState({
            jobs:array,
            sortbyduration:!this.state.sortbyduration,
        })
    }

    sortByRating(){
        var array = this.state.jobs;
        var flag = this.state.sortbyrating;
        array.sort(function(a, b) {
            if(a.rating !== undefined && b.rating !== undefined){
                return (1 - +flag*2) * (+a.rating - +b.rating);
            }
            else{
                return 1;
            }
          });
        this.setState({
            jobs:array,
            sortbyrating:!this.state.sortbyrating,
        })
    }

    renderSalaryIcon(){
        if(this.state.sortbysalary){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    renderDurationIcon(){
        if(this.state.sortbyduration){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    renderRatingIcon(){
        if(this.state.sortbyrating){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

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
            this.props.history.push('/jobsList');
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
            this.props.history.push('/jobsList');
            this.props.history.push('/');
            this.props.history.goBack();
        }
        else {
            alert("SOP cannot have more than 250 words.");
        }
    }
    
//////////////////////////////////////
  accept(application) {
        let job = this.getjob(application.jobId);
        if(job.numpos === job.posmax)
        {
            alert("All positions are filled!");
            return;
        }
        else if(job.numpos === job.posmax - 1)
        {
            this.state.applications.filter(item => item.applicantId !== application.applicantId && item.jobId === application.jobId && item.status !== "Deleted" && item.status !== "Accepted").forEach(
                function(appli)
                {
                    // let temp = job;
                    const tempAppli = {
                        status: "Rejected"
                    }
                    // let newNumApp = +temp.numapp - 1;
                    // if(newNumApp < 0) newNumApp = 0;
                    // const tempJob = {
                    //     numapp: newNumApp
                    // }
                    axios
                        .put('http://localhost:4000/application/edit_application/' + appli._id, tempAppli)
                        .then(response => {
                            console.log(tempAppli);
                        })
                        .catch(function(error) {
                            console.log(error);
                        })
                    // axios
                    //     .put('http://localhost:4000/job/edit_job/' + temp._id, tempJob)
                    //     .then(response => {
                    //         console.log(tempJob);
                    //     })
                    //     .catch(function(error) {
                    //         console.log(error);
                    //     })
                })
        }
        let nnumpos = +job.numpos + 1;

        const editApplicant = {
            working: true,
            numapp: 0
        };

        const editJob = {
            numpos: nnumpos
        };

        const editApplication = {
            status: "Accepted",
            doj: new Date()
        };

        axios
            .put('http://localhost:4000/job/edit_job/' + job._id, editJob)
            .then(response => {
                console.log(editJob);
            })
            .catch(function(error) {
                console.log(error);
            })

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })
        
        axios
            .put('http://localhost:4000/user/edit_profile/' + application.applicantId, editApplicant)
            .then(response => {
                console.log(editApplicant);
            })
            .catch(function(error) {
                console.log(error);
            })
        let alljobs = this.state.jobs;
        this.state.applications.filter(item => item.applicantId === application.applicantId && item._id !== application._id && item.status !== "Deleted").forEach(
            function(appli)
            {
                // let appliJob = alljobs.filter(item => item._id === appli.jobId)[0];
                const editAppli = {
                    status: "Rejected"
                }
                // let napp = +appliJob.numapp - 1;
                // if(napp < 0) napp = 0;
                // const editAppliJob = {
                //     numapp: napp
                // }
                axios
                    .put('http://localhost:4000/application/edit_application/' + appli._id, editAppli)
                    .then(response => {
                        console.log(editAppli);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
                // axios
                //     .put('http://localhost:4000/job/edit_job/' + appliJob._id, editAppliJob)
                //     .then(response => {
                //         console.log(editAppliJob);
                //     })
                //     .catch(function(error) {
                //         console.log(error);
                //     })
            })

        this.props.history.push('/appList');
        this.props.history.push('/');
        this.props.history.goBack();
    }

    reject(application) {
        // const { user } = this.props.auth;
        // let job = this.getjob(application.jobId);
        let applicant = this.getapplicant(application.applicantId);
        // let job = this.getjob(application.jobId);
        let nnumapp = +applicant.numapp - 1;
        // let jnumapp = +job.numapp - 1;

        if(nnumapp < 0) nnumapp = 0;
        // if(jnumapp < 0) jnumapp = 0;

        const editApplicant = {
            numapp: nnumapp
        };

        const editApplication = {
            status: "Rejected"
        };

        // const editJob = {
        //     numapp: jnumapp
        // };

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })

        // axios
        //     .put('http://localhost:4000/job/edit_job/' + job._id, editJob)
        //     .then(response => {
        //         console.log(editJob);
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //     })
        
        axios
            .put('http://localhost:4000/user/edit_profile/' + application.applicantId, editApplicant)
            .then(response => {
                console.log(editApplicant);
            })
            .catch(function(error) {
                console.log(error);
            })

        this.props.history.push('/appList');
        this.props.history.push('/appList');
        this.props.history.goBack();;
    }
/////////////////////////////////////////
    render() 
    {
        const { user } = this.props.auth;
        const userRole = this.state.userdetails.role;
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        let AllJobs;
        
            AllJobs =
            <div>
                <Grid container>
                <Grid item xs={12} md={12} lg={12}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h3>Active training</h3>
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
                                            <TableCell>Type</TableCell>
                                            <TableCell><Button onClick={this.sortBySalary}>{this.renderSalaryIcon()}</Button>Salary (per month)</TableCell>
                                            <TableCell><Button onClick={this.sortByDuration}>{this.renderDurationIcon()}</Button>Duration(months): 0 for Indefinite</TableCell>
                                            <TableCell>Date of posting</TableCell>
                                            <TableCell>Deadline</TableCell>
                                            
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.jobs.filter(item => (new Date()).getTime() <= (new Date(item.deadline.substring(0,10))).getTime()).map((job,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.type === "partTime"? "Part-Time": ""}
                                            {job.type === "fullTime"? "Full-Time": ""}
                                            {job.type === "wfh"? "Work from Home": ""}</TableCell>
                                            <TableCell>{job.salary}</TableCell>
                                            <TableCell>{job.duration}</TableCell>
                                            <TableCell>Day-{new Date(job.dateOfPost).getDate()}, Month-{monthNames[new Date(job.dateOfPost).getMonth()]}, Year-{new Date(job.dateOfPost).getFullYear()}</TableCell>
                                            <TableCell>{job.deadline.substring(0,10)}</TableCell>
                                    
                                            <Link
                                                    to={{
                                                        pathname: "/appList",
                                                        state: job._id // data array of objects
                                                    }}
                                                    >View applications</Link>
                                          
                                        </TableRow> 
                                ))}
                                </TableBody>
                            </Table>
                        </Paper>               
                    </Grid>    
                </Grid>            
            </div>
        
        return (
            <div style={{ height: "75vh" }} className="valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Text>
                                    {AllJobs}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

JobsList.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
)(JobsList);