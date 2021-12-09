const functions = require('firebase-functions');
const admin = require('firebase-admin');
// import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

const sgMail = require('@sendgrid/mail');
// import * as sgMail from '@sendgrid/mail'

//firebase functions:config:set someservice.key="THE API KEY"

// const API_KEY = "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";
const API_KEY = functions.config().sendgrid.key;

const TEMPLATE_ID = "d-0214f1135b054334abbdcfad5446a077";
sgMail.setApiKey(API_KEY);



exports.randomNumberCall = functions.https.onCall((request, responce) => {
      const number = Math.round(Math.random() * 100);
      console.log(number)
      // responce.send(number.toString());
      return number
});


exports.fireHttpEmail = functions.https.onCall((data, context) => {
   // console.log("data: ",data, "context: ", context)
   const msg = { //может можно просто data отправлять хз
      to: data.to,
      from: data.from,
      templateId: data.templateId,
      dynamicTemplateData: data.dynamicTemplateData,
   }
   // const msg = {
   //    to: "mr.zgot@yandex.ru",
   //    from: "vlatidos@gmail.com",
   //    templateId: TEMPLATE_ID,
   //    dynamicTemplateData: {
   //       text: "тут текст",
   //       subject: "Тема письма",
   //       name: 'кастомноеИмя'
   //    }
   // }

   
   // responce.send(number.toString());
   sgMail.send(msg)
      .then((resp) => {
         console.log("письмо отправлено") 
      })
      .catch((err) => {
         console.log("Ошибка отправки письма: ", err)
      })

   // return request
});
