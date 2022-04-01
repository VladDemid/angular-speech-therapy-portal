const functions = require("firebase-functions");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const admin = require("firebase-admin");

const app = !admin.apps.length ? admin.initializeApp() : admin.app();
const db = admin.database();
let defaultPayment;

exports.pay = functions.https.onRequest(async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).end();
  }

  functions.logger.debug(
    "request.body",
    JSON.stringify(request.body, null, "  ")
  );
  const orderId = request.body.id;
  functions.logger.debug("orderId:", orderId);

  const payment = await createPayment(orderId);

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
      const orderRef = db.ref(`events/${orderId}`);
      orderRef.update({
        state: "AwaitingPayment",
        externalPaymentId: alfaResponse.data.orderId,
      });

      response.send({ formUrl: alfaResponse.data.formUrl });
    }
  } catch (e) {
    functions.logger.error("Alfa Bank API error: ", e);
    response.status(500).send({
      errorCode: 1,
      errorMessage: "Возникла непредвиденная ошибка. Пожалуйста, повторите попытку позже",
    });
  }
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

    const orderRef = db.ref(`events/${orderId}`);

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

exports.rejectPayment = functions.https.onRequest(async (request, response) => {
  functions.logger.info(
    "Alfa Bank API payment rejection: ",
    request.url,
    request.params,
    request.query
  );
  response.status(200).end();
});

async function createPayment(orderId) {
  const token = uuidv4();
  const orderRef = db.ref(`events/${orderId}`); //! поменять на orders/
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
    orderNumber: token, //! вместо shortId добавить token
    // TODO: поменять на страницу подтверждения заказа в UI
    returnUrl: `${process.env.BASE_FUNCTIONS_URL}/orders-confirmPayment?token=${token}`,
    // TODO: поменять на страницу отмены заказа в UI
    failUrl: `${process.env.BASE_FUNCTIONS_URL}/orders-rejectPayment?token=${token}`,
    dynamicCallbackUrl: `${process.env.BASE_FUNCTIONS_URL}/orders-callback?token=${token}`,
  };
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
