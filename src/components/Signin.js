import React, { Component } from 'react';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';

import 'firebaseui/dist/firebaseui.css';

import title from '../title';

export default class Signin extends Component {
	componentDidMount() {
		document.title = title('Sign in');
		const uiConfig = {
			signInOptions: [
				firebase.auth.FacebookAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID
			],
			credentialHelper: false
		};

		var ui = new firebaseui.auth.AuthUI(firebase.auth());
		ui.start('#firebaseui', uiConfig);
	}
	render() {
		return <div id="firebaseui" />;
	}
}
