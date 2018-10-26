require('dotenv').config({ path: `${__dirname}/../.env.local` });

const cron = require('cron');
const firebaseAdmin = require('firebase-admin');
const _ = require('lodash');
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_FILENAME);
const mailgunJs = require('mailgun-js');

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
	databaseURL: 'https://checkins-607b8.firebaseio.com'
});

firebaseAdmin.firestore().settings({ timestampsInSnapshots: true });

const mailgunKey = process.env.MAILGUN_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const fromAddress = process.env.FROM_ADDRESS;
const checkinsUrl = process.env.CHECKINS_URL;

const mailgun = mailgunJs({ apiKey: mailgunKey, domain: mailgunDomain });

async function sendEmail({ time, email }) {
	const emailBody = `
		<h3>What did you work on today?</h3>
		<p>
			Hi! You asked for a checkin at ${time}. Click the link below to check in.
		</p>
		<p>
			<a href="${checkinsUrl}">
				${checkinsUrl}
			</a>
		</p>
	`;

	try {
		await mailgun.messages().send({
			from: fromAddress,
			to: email,
			subject: 'Checkins - What did you work on today?',
			html: emailBody
		});

		console.log(new Date().toLocaleTimeString(), `Sent a checkin to ${email}`);
	} catch (err) {
		console.error(err);
		return;
	}
}

async function sendCheckins() {
	console.log(new Date().toLocaleString(), 'Starting job');

	const querySnapshot = await firebaseAdmin
		.firestore()
		.collection('users')
		.get();

	querySnapshot.forEach(doc => {
		const {
			settings: { checkins, email }
		} = doc.data();

		const jobs = checkins.map(({ time }) => {
			const [hours, minutes = 0, seconds = 0] = time.split(':');
			const targetDate = new Date();

			console.log(
				new Date().toLocaleString(),
				`Setting up checkin for ${email} at ${time}`
			);

			targetDate.setHours(hours, _.toNumber(minutes), _.toNumber(seconds));
			return cron.job(
				targetDate,
				() => sendEmail({ time, email }),
				null,
				false,
				'America/Vancouver'
			);
		});

		jobs.forEach(j => {
			j.start();
		});
	});
}

const job = cron.job(
	'0 0 0 * * *',
	sendCheckins,
	null,
	true,
	'America/Vancouver'
);

job.start();

// sendCheckins();
