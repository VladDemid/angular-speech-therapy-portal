const functions = require('firebase-functions');
const admin = require('firebase-admin');
// import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

const sgMail = require('@sendgrid/mail');
// import * as sgMail from '@sendgrid/mail'

const API_KEY = "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";
const TEMPLATE_ID = "d-0214f1135b054334abbdcfad5446a077";
sgMail.setApiKey(API_KEY);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.testEmail = functions.https.onCall(async (data, context) => {
   if (!context.auth && !context.auth.token.email) {
      throw new functions.https.HttpsError('failed-preconfition', 'Must be logged with an email address')
   }

   const msg = {
      to: context.auth.token.email,
      from: 'hello@fireship.io',
      temlateId: TEMPLATE_ID,
      dynamic_template_data: {
         subject: data.subject,
         text: data.text,
      }
   }

   await sgMail.send(msg)
   
   return { success: true }
});

exports.randomNumber = functions.https.onRequest((request, responce) => {
   const number = Math.round(Math.random() * 100);
   console.log(number)
   responce.send(number.toString());

});



exports.addMessage = functions.https.onRequest(async (req, res) => {
   const original = req.query.text; // Grab the text parameter.
   // Push the new message into Firestore using the Firebase Admin SDK.
   const writeResult = await admin.firestore().collection('messages').add({original: original});
   // Send back a message that we've successfully written the message
   res.json({result: `Message with ID: ${writeResult.id} added.`});
 });