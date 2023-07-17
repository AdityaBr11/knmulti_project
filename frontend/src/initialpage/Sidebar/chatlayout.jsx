/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

// router service
import chatService from "../../router_service/chatservice";

import Header from './header';
import Chatsidebar from './chatsidebar';

const chatlayout = (props) => {
		const { match } = props;
		return (
			<>
				<Header/>
				<div>
					{chatService && chatService.map((route,key)=>
						<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
					)}
				</div>				
				<Chatsidebar/>
			</>
		);
	
}
export default withRouter(chatlayout);