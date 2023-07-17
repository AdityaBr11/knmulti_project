import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Users from './users';
import Activities from './activities';
import Assets from './assets';
import knowledgebase from './knowledgebase';
import knowledgebaseview from './knowledgebase-view';
import Managedjobs from './Jobs/managejobs';
import AppliedCandidate from './Jobs/appliedcandidate';
import jobdetails from './Jobs/jobdetails';
import AptituedeResults from './Jobs/aptituderesults';
import CandidateList from './Jobs/candidatelist';
import Experiencelevel from './Jobs/experiencelevel';
import Interviewquestion from './Jobs/interviewquestion';
import JobsDashboard from './Jobs/jobs_dashboard';
import ManageResumes from './Jobs/manageresumes';
import Offerapproval from './Jobs/offerapproval';
import ScheduleTimings from './Jobs/scheduletiming';
import ShortlistCandidate from './Jobs/shortlistcandidates';
import UserDashboard from './Jobs/user_dashboard';
import Useralljobs from './Jobs/user_all_jobs';
import Savedjobs from './Jobs/saved_jobs';
import Appliedjobs from './Jobs/applied_jobs';
import Interviewing from './Jobs/interviewing';
import OfferedJobs from './Jobs/offered_jobs';
import Visitedjobs from './Jobs/visited_jobs';
import Archivedjobs from './Jobs/archived_jobs';
import Jobapptitude from './Jobs/job_aptitude';
import Questions from './Jobs/questions';
import Policies from '../HR/policies';
import Locations from './locations';
import LeaveRequest from './leaveRequest';
import DailyReport from '../HR/Reports/dailyreport';
import PayrollItems from '../HR/Payroll/payrollitem';
import SkillDevelopment from './skilldevelopment';
import BenifitManagement from './benifitmanagement';
import PayrollForm from '../HR/Payroll/PayrollForm';
import PayrollView from '../HR/Payroll/PayrollView';

const Uiinterfaceroute = ({ match }) => {
  console.log('match', match);
  return (
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/users`} />
      <Route path={`${match.url}/leave-request`} component={LeaveRequest} />
      <Route path={`${match.url}/users`} component={Users} />
      <Route path={`${match.url}/activities/:id`} component={Activities} />
      <Route path={`${match.url}/assets`} component={Assets} />
      <Route path={`${match.url}/locations`} component={Locations} />
      <Route path={`${match.url}/knowledgebase`} component={knowledgebase} />
      <Route
        path={`${match.url}/knowledgebase-view`}
        component={knowledgebaseview}
      />
      <Route path={`${match.url}/user-dashboard`} component={UserDashboard} />
      <Route path={`${match.url}/user-all-jobs`} component={Useralljobs} />
      <Route path={`${match.url}/saved-jobs`} component={Savedjobs} />
      <Route path={`${match.url}/applied-jobs`} component={Appliedjobs} />
      <Route path={`${match.url}/interviewing`} component={Interviewing} />
      <Route path={`${match.url}/offered-jobs`} component={OfferedJobs} />
      <Route path={`${match.url}/visited-jobs`} component={Visitedjobs} />
      <Route path={`${match.url}/archived-jobs`} component={Archivedjobs} />
      <Route path={`${match.url}/jobs-dashboard`} component={JobsDashboard} />
      <Route path={`${match.url}/jobs`} component={Managedjobs} />
      <Route path={`${match.url}/manage-resumes`} component={ManageResumes} />
      <Route path={`${match.url}/onboarding`} component={ShortlistCandidate} />
      <Route path={`${match.url}/daily-activity`} component={DailyReport} />
      <Route path={`${match.url}/payroll`} component={PayrollItems} />
      <Route path={`${match.url}/payroll-view`} component={PayrollView} />
      <Route path={`${match.url}/payroll-form`} component={PayrollForm} />
      <Route
        path={`${match.url}/skill-development`}
        component={SkillDevelopment}
      />
      <Route
        path={`${match.url}/benefits-management`}
        component={BenifitManagement}
      />
      <Route
        path={`${match.url}/interview-questions`}
        component={Interviewquestion}
      />
      <Route path={`${match.url}/job-details/:id`} component={jobdetails} />
      <Route
        path={`${match.url}/job-applicants`}
        component={AppliedCandidate}
      />
      <Route path={`${match.url}/offer_approvals`} component={Offerapproval} />
      <Route
        path={`${match.url}/experiance-level`}
        component={Experiencelevel}
      />
      <Route path={`${match.url}/candidates`} component={CandidateList} />
      <Route
        path={`${match.url}/schedule-timing`}
        component={ScheduleTimings}
      />
      <Route
        path={`${match.url}/apptitude-result`}
        component={AptituedeResults}
      />
      <Route path={`${match.url}/job-aptitude`} component={Jobapptitude} />
      <Route path={`${match.url}/questions`} component={Questions} />
      <Route path={`${match.url}/policies`} component={Policies} />
    </Switch>
  );
};

export default Uiinterfaceroute;
