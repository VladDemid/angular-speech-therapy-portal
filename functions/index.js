const functions = require('firebase-functions');
const admin = require('firebase-admin');
const https = require('https');
const request = require('request');
const axios = require("axios")
const cors = require("cors")({ origin: true });
const rp = require('request-promise');
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

exports.queryTest = functions.https.onRequest((req, res) => {
   cors(req, res, () => {
      if (req.method !== 'GET') {
         res.status(400).send('Bad request, this endpoint only accepts POST requests');
      }

      let idToken = null
      if (req.body) {
         idToken = req.body.uid
      }
      res.status(200).send({idToken: idToken})
      
   })
})

exports.alfaAllReq = functions.https.onRequest((req, res) => {
   cors(req, res, () => {

      if (req.method !== 'GET') {
         res.status(400).send('Bad request, this endpoint only accepts POST requests');
         return
      }

      const querys = req.query
      const mode = querys.prod ? "alfa_prod" : "alfa_test"
      const alfaTest_creds = functions.config()[mode]
      const actionUrl = querys.actionUrl
      const acqUrl = `https://web.rbsuat.com/ab_by/rest/${actionUrl}`
      const transRegData = {
         userName: alfaTest_creds.user_name,
         password: alfaTest_creds.password,
         size: 10,
         from: 20220201000000,
         to: 20220301000000,
         transactionStates: "CREATED, APPROVED, DEPOSITED, DECLINED, REVERSED, REFUNDED",
         merchants: "",
      }

      const urlReq = `${acqUrl}?userName=${transRegData.userName}&size=${transRegData.size}&from=${transRegData.from}&to=${transRegData.to}&transactionStates=${transRegData.transactionStates}&merchants=${transRegData.merchants}`
      
      // res.status(200).json({options: urlReq})
      
      const options = {
         method: 'POST',
         uri: urlReq,
         qs: {format: 'json'},
         body: {},
         headers: {
            'User-Agent': 'Request-Promise',
            'Connection': 'keep-alive'
         },
         json: true // Automatically stringifies the body to JSON
      };
      

      return rp(options)
         .then(data => {
            console.log(data)
            res.status(200).json(data)
         })
         .catch(err => {
            console.log(err)
            res.status(500).json(err)
         })


   })
})

exports.alfaReq = functions.https.onRequest((req, res) => {
   
   cors(req, res, () => {

      if (req.method !== 'GET') {
         res.status(400).send('Bad request, this endpoint only accepts POST requests');
         return
      }
      const querys = req.query
      const mode = querys.prod ? "alfa_prod" : "alfa_test"
      const alfaTest_creds = functions.config()[mode]
      const actionUrl = querys.actionUrl
      const acqUrl = `https://web.rbsuat.com/ab_by/rest/${actionUrl}`
      const orderId = querys.orderId
      const transRegData = {
         userName: alfaTest_creds.user_name,
         password: alfaTest_creds.password,
         orderNumber: querys.orderId,
         // orderNumber2: orderId, // n <= 36 symbols
         amount: "1000",
         returnUrl: "http://localhost:4200/profile/payment-success",
         failUrl: "http://localhost:4200/profile/payment-fail",
      }

      // res.status(200).json({test: null, orderId: transRegData.orderNumber})

      const urlReq = `${acqUrl}?userName=${transRegData.userName}&password=${transRegData.password}&orderNumber=${transRegData.orderNumber}&amount=1000&returnUrl=${transRegData.returnUrl}&failUrl=${transRegData.failUrl}`
      // res.status(200).json({url: urlReq})
      // const query = req.query.test

      if( req.method !== "GET" ) {
         return res.status(401).json({
            message: "Not allowed"
         });
      }

      const options = {
         method: 'POST',
         uri: urlReq,
         qs: {format: 'json'},
         body: {},
         headers: {
            'User-Agent': 'Request-Promise',
            'Connection': 'keep-alive'
         },
         json: true // Automatically stringifies the body to JSON
      };


      return rp(options)
         .then(data => {
            console.log(data)
            res.status(200).json(data)
         })
         .catch(err => {
            console.log(err)
            res.status(500).json(err)
         })

	})   

 });

// exports.alfaTest2 = functions.https.onCall((request, responce) => {
//    const url = "https://web.rbsuat.com/ab_by/rest/register.do"
//    const data = {
//       userName: "logogo.online-api",
//       password: "HnnlT8Et",
//       orderNumber: "2021_6_16_18_dawRBLNTpDV5gep3mG9TyGAACrE3",
//       amount: "1000",
//       returnUrl: "https://logogo.online"
//    }
//    return this.axios.post(url, {})
    
// });

// exports.alfaTest = functions.https.onCall((request, responce) => {
//    alfaTestUrl = "web.rbsuat.com/ab_by/rest/"
//    pathName = "register.do"
//    data = {
//       userName: "logogo.online-api",
//       password: "HnnlT8Et",
//       orderNumber: "2021_6_16_18_dawRBLNTpDV5gep3mG9TyGAACrE3",
//       amount: "1000", //10рублей?
//       returnUrl: "https://logogo.online"
//    }

//    const req = https.get(`https://${alfaTestUrl}${pathname}`, (res) => {
//       res.on('data', (d) => {
//             data += d;
//       });
//       res.on('end', resolve);
//    });
//    req.on('error', reject);

//    // return fetch(`${alfaTestUrl}/register.do`)
//       // .then((resp) => {
//       //    console.log("альфа: " ,resp)
//       // })
//       // .catch((err) => {
//       //    console.log("ERROR альфа:", err)
//       // })

//    // const number = Math.round(Math.random() * 100);
//    // console.log(number)
//    // // responce.send(number.toString());
//    // return number
// });

exports.alfaCall = functions.https.onCall((data, context) => {
   const acqUrl = `https://web.rbsuat.com/ab_by/rest/${data.urlEnd}`
   let orderId = "2021_6_16_18_dawRBLNTpDV5gep3mG9TyGAACrE3".substr(0, 36)
   const transRegData = {
      userName: "logogo.online-api",
      password: "HnnlT8Et",
      orderNumber: "2021_6_16_18_dawRBLNTpDV5gep3mG9TyGAACrE3",
      orderNumber2: orderId, // n <= 36 symbols
      amount: "1000",
      returnUrl: "https://logogo.online",
      failUrl: "https://logogo.online/terms-of-use",
   }
   const urlReq = `${acqUrl}?userName=${transRegData.userName}&password=${transRegData.password}&amount=1000&orderNumber=${transRegData.orderNumber2}&returnUrl=https://logogo.online&failUrl=${transRegData.failUrl}`
   // const uid = context.auth.uid
   
   // cors(req, res, () => {
      
      // if( req.method !== "GET" ) {
      //    return res.status(401).json({
      //       message: "Not allowed"
      //    });
      // }

   const options = {
      method: 'POST',
      uri: this.urlReq,
      qs: {
         format: 'json'
      },
      body: {},
      headers: {
         'User-Agent': 'Request-Promise',
         'Connection': 'keep-alive'
      },
      json: true // Automatically stringifies the body to JSON
   };
   
   // return urlReq

   
   
      
   // rp(options)
   // .then(data => {
   //    console.log(data)
   //    // es.status(200).json(data)
   //    return data
   // })
   // .catch(err => {
   //    console.log(err)
   //    // res.status(500).json(err)
   //    return err
   // })

	// }) 


 });

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
