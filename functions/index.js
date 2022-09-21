const functions = require('firebase-functions');
const admin = require('firebase-admin');
const https = require('https');
// const request = require('request');
const axios = require("axios")
const cors = require("cors")({ origin: true });
const rp = require('request-promise');

admin.initializeApp()
const db = admin.firestore()

const sgMail = require('@sendgrid/mail');
const API_KEY = process.env.SENDGRID_KEY
sgMail.setApiKey(API_KEY);


// const API_KEY = functions.config().sendgrid.key;





exports.queryTest = functions
   .runWith({memory: "128MB"})
   .https.onRequest((req, res) => {

      

      cors(req, res, () => {
         if (req.method !== 'POST') {
            res.status(400).send('Bad request, this endpoint only accepts POST requests', req.method);
         }

         functions.logger.debug("req body:", req.body);
         let idToken = null
         if (req.body) {
            idToken = req.body.uid
         }
         res.status(200).send({idToken: idToken})
         
      })
})

exports.getTime = functions
   .runWith({memory: "128MB"})
   .https.onRequest((req, res) => {
   cors(req, res, () => {
      if (req.method !== 'POST') {
         res.status(400).send('Bad request, this endpoint only accepts POST requests', req.method);
      }
      const currentTime = new Date()
      res.status(200).send({currentTime: currentTime})
      
   })
})

exports.getOrders = functions
   .runWith({memory: "128MB"})
   .https.onRequest((req, res) => {
      cors(req, res, async () => {
         const ordersArr = req.body.ordersArr
         
         const ordersRef = db.ref(`orders`);
         const ordersSnapshot = await ordersRef.once("value")
         const ordersVal = ordersSnapshot.val()

         
         res.status(200).send({ordersVal: ordersVal})
      })
   })




exports.randomNumberCall = functions
   .runWith({memory: "128MB"})
   .https.onCall((request, responce) => {
      const number = Math.round(Math.random() * 100);
      console.log(number)
      // responce.send(number.toString());
      return number
});

exports.emailTest = functions
  .runWith({memory: "128MB"})
  .https.onRequest(async (req, res) => {
     cors(req, res, async () => {

      // const prod = req.body.prod
      // const path = prod ? ".env.prod" : ".env.dev"
      // const env = require("dotenv").config({ path: path })
      
      const msg = { 
         to: req.body.to,
         from: req.body.from,
         templateId: req.body.templateId,
         dynamicTemplateData: req.body.dynamicTemplateData,
      }
      const messages = [
         {
            to: 'mr.zgot@yandex.ru', 
            templateId: "d-006ae47f70c74c949e486cf9f63b694e",
            subject: 'тест1🥓',
            from: req.body.from,
            dynamicTemplateData: req.body.dynamicTemplateData,
          },
          {
             to: 'vlatidos@gmail.com', 
             templateId: "d-006ae47f70c74c949e486cf9f63b694e",
             subject: 'тест2🥓',
             from: req.body.from,
             dynamicTemplateData: req.body.dynamicTemplateData,
          }
      ]
         
      
      // res.status(200).send({...msg, body: req.body})


      sgMail.send(msg)
      .then((resp) => {
         res.status(200).send({emailStatus: "письмо отправлено"})
      })
      .catch((err) => {
         res.status(500).send(err)
      })

      // sgMail.send(msg)
      // .then((resp) => {
      //    res.status(200).send({emailStatus: "письмо отправлено", ...msg})
      // })
      // .catch((err) => {
      //    res.status(500).send(err)
      // })
    })

})

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

exports.testEmail = functions.https.onCall((data, context) => {
   // console.log("data: ",data, "context: ", context)
   const msg = { //может можно просто data отправлять хз
      to: data.to,
      from: data.from,
      templateId: "d-46991a5b503b4f578b6f770eeac9c711",
      dynamicTemplateData: data.dynamicTemplateData,
   }
   
   
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



exports.orders = require('./orders');