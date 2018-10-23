const cron = require('cron');
const firebaseAdmin = require('firebase-admin');
const _ = require('lodash');

const serviceAccount = require('../checkins-607b8-firebase-adminsdk-lxe9u-8bcc69cc18.json');

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
	databaseURL: 'https://checkins-607b8.firebaseio.com'
});

firebaseAdmin.firestore().settings({ timestampsInSnapshots: true });

async function sendEmail() {
	console.log(new Date().toLocaleTimeString(), 'This will send an email');
}

async function sendCheckins() {
	const querySnapshot = await firebaseAdmin
		.firestore()
		.collection('users')
		.get();

	querySnapshot.forEach(doc => {
		const {
			settings: { checkins }
		} = doc.data();

		const jobs = checkins.map(({ time }) => {
			const [hours, minutes = 0, seconds = 0] = time.split(':');
			const targetDate = new Date();
			targetDate.setHours(hours, _.toNumber(minutes), _.toNumber(seconds));
			return cron.job(targetDate, sendEmail, null, false, 'America/Vancouver');
		});

		jobs.forEach(j => {
			j.start();
		});
	});
}

// const job = cron.job(
// 	'0 0 0 * * * *',
// 	sendCheckins,
// 	null,
// 	true,
// 	'America/Vancouver'
// );

sendCheckins();
