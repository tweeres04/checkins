import React from 'react';
import ReactDOM from 'react-dom';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import 'bulma/css/bulma.css';
import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const config = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

firebase.firestore().settings({ timestampsInSnapshots: true });

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
