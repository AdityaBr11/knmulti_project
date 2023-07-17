/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

// router service
import emailService from "../../router_service/emailService";

import Header from './header';
import EmailSidebar from './emailsidebar';

const Emaillayout = (props) => {
	const { match } = props;
	return (
		<>
			<Header/>
			<div>
				{emailService && emailService.map((route,key)=>
					<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
				)}
			</div>				
			<EmailSidebar/>
		</>
	);
	
}
export default withRouter(Emaillayout);