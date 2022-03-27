const functions = require('firebase-functions');
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');

exports.payOrder = functions.https.onRequest(async (request, response) => {

   if (request.method !== 'POST') {
      response.status(405).end();
   }

   functions.logger.debug("request.body", JSON.stringify(request.body, null, "  "));
   const orderId = request.body.id;
   functions.logger.debug("orderId:", orderId);

   const token = uuidv4();

   const parameters = {
      orderNumber: orderId,
      userName: 'logogo.online-api',
      password: 'HnnlT8Et',
      amount: 1000,
      currency: 810,
      // TODO: поменять на страницу подтверждения заказа в UI
      returnUrl: `${process.env.BASE_LOGOGO_FUNCTIONS_URL}/orders-confirmPayment?token=${token}`,
      // TODO: поменять на страницу отмены заказа в UI
      failUrl: `${process.env.BASE_LOGOGO_FUNCTIONS_URL}/orders-rejectPayment?token=${token}`,
      dynamicCallbackUrl: `${process.env.BASE_LOGOGO_FUNCTIONS_URL}/orders-callback?token=${token}`,
    }

   functions.logger.debug("parameters: ", JSON.stringify(parameters, null, "  "));

   const url =  new URL(process.env.BASE_ACQUIRING_API_URL);
   for(let key in parameters) {
         url.searchParams.append(key, parameters[key]);
   }

   functions.logger.debug('Alfa Bank API url: ', url.toString())
      try {
         const alfaResponse = await axios.post(url.toString(),undefined, {
            headers: {
               'Content-type': 'application/x-www-form-urlencoded'
            }
         });

         functions.logger.debug("Alfa Bank API response.data: ", alfaResponse.data);
         response.send(alfaResponse.data);
   }
   catch (e) {
      functions.logger.error("Alfa Bank API error: ", e);
      response.status(500).send("Unexpected error occurred. Please try later");
   }

});

exports.callback = functions.https.onRequest(async (request, response) => {
  try {
    functions.logger.info("Alfa Bank API payment callback: ", request.url, request.params);
    response.status(200).end()
   }
   catch (e) {
    functions.logger.error("Alfa Bank API payment callback error: ", e);
    response.status(200).end()
    //response.status(500).send("Unexpected error occurred. Please try later");
   }
});

exports.confirmPayment = functions.https.onRequest(async (request, response) => {
   functions.logger.info("Alfa Bank API payment confirmation: ", request.url, request.params, request.query);
   response.status(200).end()
});

exports.rejectPayment = functions.https.onRequest(async (request, response) => {
   functions.logger.info("Alfa Bank API payment rejection: ", request.url, request.params, request.query);
   response.status(200).end()
});

exports.test = functions.https.onRequest(async (request, response) => {
   try {
    // response.status(200).send(JSON.stringify(request.query, null, "  "))
     response.status(200).send(`${process.env.BASE_ACQUIRING_API_URL}`)
    }
    catch (e) {
     response.status(500).send("Unexpected error occurred. Please try later");
    }
 });