import * as functions from "firebase-functions";
import axios from 'axios';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const  BASE_URL = 'https://web.rbsuat.com/ab_by/rest/register.do';
export const payOrder =   functions.https.onRequest( async (request, response) => {
  functions.logger.info("payOrder request", request);

  const url =  new URL(BASE_URL);
  for(let key in request.body) {
      url.searchParams.append(key, request.body[key]);
  }

  console.log(url.toString())
  

  const alfaResponse = axios.post(url.toString(),undefined, {
      headers: {
          'Content-type': 'application/x-www-form-urlencoded'
      }
  });

  response.send(alfaResponse);
});
