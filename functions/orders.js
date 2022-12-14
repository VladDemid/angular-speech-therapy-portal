const functions = require("firebase-functions");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const app = !admin.apps.length ? admin.initializeApp() : admin.app();
const db = admin.database();
let defaultPayment;

const sgMail = require('@sendgrid/mail');
// const API_KEY = process.env.SENDGRID_KEY
const API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(API_KEY);

exports.alfaTest = functions
  .runWith({memory: "128MB"})
  .https.onRequest(async (request, response) => {
    const orderData = {
      userName: "logogo.online-api",
      password: "HnnlT8Et",
      orderNumber: 820,
      price: 10,
      returnUrl: "http://localhost:4200/profile/payment?token=1234&paySuccess=true",
      failUrl: "http://localhost:4200/profile/payment?token=1234&paySuccess=false"
    }

    const url = "https://web.rbsuat.com/ab_by/rest/register.do"
    cors(request, response, async () => {
      const alfaResponse = axios.post(url, orderData, {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })

      response.send({ formUrl: alfaResponse.data.formUrl });
    })
})

exports.prodTest = functions
  .runWith({memory: "128MB"})
  .https.onRequest((req, res) => {

    // const prod = req.body.prod
    // // const path = prod ? ".env.prod" : ".env.dev"
    // const path2 = ".env"
    // const env = require("dotenv").config({ path: path2 })
    
    cors(req, res, ()  => {
       

      const data = {
        PRODUCTION: process.env.PRODUCTION,
        needProd: true,
        BASE_LOGOGO_URL: process.env.BASE_LOGOGO_URL,
        // returnUrl: `${process.env.BASE_LOGOGO_URL}/profile/payment?token=${token}&paySuccess=true`,
        // failUrl: `${process.env.BASE_LOGOGO_URL}/profile/payment?token=${token}&paySuccess=true`,
        // dynamicCallbackUrl: `${process.env.BASE_FUNCTIONS_URL}/orders-callback?token=${token}`,
      }

       
       res.status(200).send(data)
    })
 })











exports.payTest2 = functions
  .runWith({memory: "128MB"})
  .https.onRequest(async (request, response) => {

    const prod = request.body.prod
    const path = prod ? ".env.prod" : ".env.dev"
    const env = require("dotenv").config({ path: path })

    functions.logger.info("pay INFO: ", "start")
    const var1 = "testTEST"
    cors(request, response, async () => {
      if (request.method !== "POST") {
        response.status(405).end();
      } 
      // response.status(200).send('success')
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(
        {
          true: request.body.true,
          prod: request.body.prod,
          path: path,
          body: request.body,
          url: `${process.env.BASE_LOGOGO_URL}`,
        }
      ));
    })

})

//    ????--------????

exports.checkOrderStatus = functions
  .runWith({memory: "128MB"})
  .https.onRequest( (request, response) => {
    cors(request, response, async () => {

      const prod = request.body.prod
      const path = prod ? ".env.prod" : ".env.dev"
      const env = require("dotenv").config({ path: path })
      
      orderToken = request.body.token

      const paymentRef = db.ref(`payments/${orderToken}`);
      const paymentSnapshot = await paymentRef.once("value");
      const orderId = paymentSnapshot.val();

      const ordersRef = db.ref(`orders/${orderId}`)
      const ordersSnapshot = await ordersRef.once("value");
      orderState = ordersSnapshot.val().state


      response.send({orderState: orderState});

      // response.send({ 
      //   orderId: orderId,
      //   path: `payments/${orderToken}`
      // });
    })

})


exports.pay = functions.https.onRequest(async (request, response) => {

  const prod = request.body.prod
  const path = prod ? ".env.prod" : ".env.dev"
  const env = require("dotenv").config({ path: path })
  
  cors(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).end();
    }
    functions.logger.info("--------- pay func START ---------")
    
    functions.logger.debug(
      "request.body",
      JSON.stringify(request.body, null, "  ")
      );
      const orderId = request.body.id;
      functions.logger.debug("request body:", request.body);
      // functions.logger.debug("orderId:", orderId);
      
      
      // functions.logger.info("pay createPayment START")
      const payment = await createPayment(orderId, prod);
      // functions.logger.info("pay createPayment END", payment)
  
    
  
    try {
      const alfaResponse = await axios.post(getPaymentUrl(payment), undefined, {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      });
      functions.logger.debug("Alfa Bank API response.data: ", alfaResponse.data);
  
      if (alfaResponse.data.errorCode) {
        response.status(400).send({
          errorCode: alfaResponse.data.errorCode + 1000000,
          errorMessage: alfaResponse.data.errorMessage,
        });
      } else {
        // TODO: Обновить состояние заказа на "В ожидании оплаты"
        const orderRef = db.ref(`orders/${orderId}`);
        orderRef.update({
          state: "AwaitingPayment",
          paymentFormUrl: alfaResponse.data.formUrl,
          externalPaymentId: alfaResponse.data.orderId,
          orderCreationTime: Date.now(),
        });
        await sendEmailsFromOrder(orderId)

        response.send({ formUrl: alfaResponse.data.formUrl });
      }
    } catch (e) {
      functions.logger.error("Alfa Bank API error: ", e);
      response.status(500).send({
        errorCode: 1,
        errorMessage: "Возникла непредвиденная ошибка. Пожалуйста, повторите попытку позже",
      });
    }
  })
    
  
});

exports.callback = functions.https.onRequest(async (request, response) => {
  try {
    functions.logger.info("Alfa Bank API payment callback: ", request.url);

    const { operation, status, token } = request.query;

    const paymentRef = db.ref(`payments/${token}`);
    const paymentSnapshot = await paymentRef.once("value");
    const orderId = paymentSnapshot.val();

    if (!orderId) {
      throw new Error(`Payment with token ${token} not found`);
    }

    const orderRef = db.ref(`orders/${orderId}`);

    // TODO: реализовать обработку всех типов операций
    switch (operation) {
      case "approved":
        functions.logger.error(
          `Alfa Bank API payment callback '${operation}' operation not implemented`
        );
        break;
      case "deposited":
        if (status) {
          orderRef.update({ state: "PaymentConfirmed" });
          setTimeout(() => sendEmailsFromOrder(orderId), 10000) //ждать пока обновится
          // sendEmail("mr.zgot@yandex.ru", "d-006ae47f70c74c949e486cf9f63b694e", {})
        } else {
          orderRef.update({ state: "PaymentRejected" });
        }
        break;
      case "reversed":
        functions.logger.error(
          `Alfa Bank API payment callback '${operation}' operation not implemented`
        );
        break;
      case "refunded":
        functions.logger.error(
          `Alfa Bank API payment callback '${operation}' operation not implemented`
        );
        break;
      case "declinedByTimeout":
        if (status) {
          orderRef.update({ state: "PaymentRejected" });
        }
        break;
      default:
        functions.logger.error(
          `Alfa Bank API payment callback '${operation}' operation not implemented`
        );
        break;
    }

    response.status(200).end();
  } catch (e) {
    functions.logger.error("Alfa Bank API payment callback error: ", e);
    response.status(200).end();
  }
});



exports.confirmPayment = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info(
      "Alfa Bank API payment confirmation: ",
      request.url,
      request.params,
      request.query
      );
      response.status(200).end();
  }
);

exports.getEmailsDev = functions
.runWith({memory: "128MB"})
.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // const specData = 
    await sendEmailsFromOrder("2022_5_10_10_E9IKBLSbkTfzEJPXzFimuXeXs1b2")
      .then((resp) => {
        res.status(200).send({emailStatus: "письмо обоим отправлено", resp})
      })
      .catch((err) => {
        res.status(500).send({err: err})
      })
    // res.status(200).send({specData: specData})

  })
})

exports.rejectPayment = functions.https.onRequest(async (request, response) => {
  functions.logger.info(
    "Alfa Bank API payment rejection: ",
    request.url,
    request.params,
    request.query
    );
    response.status(200).end();
});
  
async function createPayment(orderId, prod) {
  const token = uuidv4();
  const orderRef = db.ref(`orders/${orderId}`); //! поменять на orders/
  const paymentsRef = db.ref(`payments/${token}`);
  
  //!start delete
  // const shortIdKey = orderId.substring(orderId.lastIndexOf("_") + 1);
  // functions.logger.debug(`shortIdKey: ${shortIdKey}`);
  
  // const shortIdRef = db.ref(`shortIds/${shortIdKey}`);
  // const shortIdSnapshot = await shortIdRef.once("value");
  // const shortId = shortIdSnapshot.val();
  //!end delete
  
  orderRef.update({
    paymentToken: token,
  });
  
  paymentsRef.set(orderId);
  
  return {
    ...(await getDefaultPayment()),
    orderNumber: token, 
    returnUrl: `${process.env.BASE_LOGOGO_URL}/profile/payment?token=${token}&paySuccess=true`,
    failUrl: `${process.env.BASE_LOGOGO_URL}/profile/payment?token=${token}&paySuccess=true`,
    dynamicCallbackUrl: `${process.env.BASE_FUNCTIONS_URL}/orders-callback?token=${token}`,
  };
}

async function sendEmailsFromOrder(orderId, emailType) { //
  
  const configurationRef = db.ref(`orders/${orderId}`);
  const snapshot = await configurationRef.once("value");
  const orderVal = snapshot.val();
  
  
  const patientId = orderVal.patientId
  const doctorId = orderVal.doctorId
  
  
  const patientRef = db.ref(`users/${patientId}`);
  const patientSnap = await patientRef.once("value");
  const patientVal = patientSnap.val();
  let patientEmail = orderVal.manualOrder ? orderVal.patientEmail : patientVal.email
  
  const doctorRef = db.ref(`users/${doctorId}`);
  const doctorSnap = await doctorRef.once("value");
  const doctorVal = doctorSnap.val();
  let doctorEmail = doctorVal.email
  

  
  functions.logger.info( "======== test: ", patientEmail, doctorEmail, "orderVal: ", orderVal, "emailType:", emailType)
  return sendEmails(patientEmail, doctorEmail, orderVal, emailType)

  // const specData = {
  //   // subject: "Новая запись Logogo",
  //   date: `${orderVal.date.time} часов (МСК) ${orderVal.date.day}-${orderVal.date.month}-${orderVal.date.year}`,
  //   patientName: orderVal.patientName,
  //   token: orderVal.paymentToken
  // }
  // sendEmail(doctorVal.email, process.env.EMAIL_ID_SPEC_NEW_ORDER, specData)
    
}

function sendEmails(patientEmail, doctorEmail, orderData) {
  // cors(req, res, async () => {
    const fromEmail = process.env.LOGOGO_EMAIL
    // const fromEmail = "info@logogo.online"

    let emailType = "order_booking"
    let patientTemplateId = ""
    let specialistTemplateId = ""
    
    switch(emailType) {
      case "order_booking": 
        patientTemplateId = process.env.EMAIL_ID_BOOKING_UNIVERSAL
        specialistTemplateId = process.env.EMAIL_ID_BOOKING_UNIVERSAL
        break;
      case "order_paid": 
        patientTemplateId = process.env.EMAIL_ID_BOOKING_UNIVERSAL
        specialistTemplateId = process.env.EMAIL_ID_BOOKING_UNIVERSAL
        break;
      default:
        patientTemplateId = process.env.EMAIL_ID_TEST
        specialistTemplateId = process.env.EMAIL_ID_TEST
        
    }

    generalData = {
      patientName: orderData.patientName,
      doctorName: orderData.doctorName,
      date: `${orderData.date.day}-${orderData.date.month}-${orderData.date.year} в ${orderData.date.time} по минскому времени`,
      problem: orderData.problem,
      orderId: orderData.orderId,
      paymentStatus: orderData.state === "PaymentConfirmed" ? "Оплата прошла успешно!" : "Бронирование нового занятия (не оплачено)",
      bookingType: !!orderData.manualOrder ? "Специалист записал клиента" : "Клиент записался к специалисту",
      paymentLink: orderData.paymentFormUrl,
    }

    

    const patientData = {
      to: patientEmail,
      templateId: patientTemplateId,
      from: fromEmail,
      dynamicTemplateData: {
        ...generalData
      }
    }

    const doctorData = {
      to: doctorEmail, 
      templateId: specialistTemplateId,
      from: fromEmail,
      dynamicTemplateData: {
        ...generalData
      }
    }

    const messages = [patientData, doctorData]
    

    return sgMail.send(messages)

    
}

async function getDefaultPayment() {
  if (!defaultPayment) {
    const configurationRef = db.ref("configuration");
    const snapshot = await configurationRef.once("value");
    const configuration = snapshot.val();
    functions.logger.info(configuration);
    defaultPayment = {
      amount: configuration.price * 100,
      currency: configuration.currency,
      userName: process.env.ACQUIRING_API_USER_NAME,
      password: process.env.ACQUIRING_API_PASSWORD,
    };
  }

  return defaultPayment;
}

function getPaymentUrl(payment) {
  functions.logger.debug("payment: ", JSON.stringify(payment, null, "  "));
  const url = new URL(process.env.BASE_ACQUIRING_API_URL);

  for (let key in payment) {
    url.searchParams.append(key, payment[key]);
  }

  functions.logger.debug("Alfa Bank API url: ", url.toString());

  return url.toString();
}


