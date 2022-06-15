export const environment = { //*DEV
  production: false,
  adminId: "XUuNLsPankPqmDKLBb8ZS4X1dq12",
  apiKey: "AIzaSyACtKsTQZUkp9Xp3zv7E3BNoiyK8AAWXas",
  FbDbUrl: "https://inclusive-test.firebaseio.com/",
  defaultAvatarUrl: "https://firebasestorage.googleapis.com/v0/b/inclusive-test.appspot.com/o/users%2Fdefault-user-avatar.png?alt=media&token=59fe0397-e8df-467e-82cf-e7dc3aa3b60b"
}

export const firebaseConfig = { //*DEV
  apiKey: "AIzaSyACtKsTQZUkp9Xp3zv7E3BNoiyK8AAWXas",
  authDomain: "inclusive-test.firebaseapp.com",
  databaseURL: "https://inclusive-test.firebaseio.com",
  projectId: "inclusive-test",
  storageBucket: "inclusive-test.appspot.com",
  messagingSenderId: "441293072662",
  appId: "1:441293072662:web:679ec4fe7378d9b9c04837",
  BASE_FUNCTIONS_URL: "https://us-central1-inclusive-test.cloudfunctions.net"
  
}


export const environmentOther = {
  emailDefault: "test5@gmail.com",
  passwordDefault: "123456",
  name: "Имя",
  surname: "Фамилия",
  dob: "1995-12-30",
  emailClient: "mr.zgot@yandex.ru",
  emailSpec: "mr.zgot@yandex.ru",
  phone: '',
  question: "один два три",
  specialization: "Инженер-проектировщик",
}

export const emailConfig = {
  fromEmailAdress: "info@logogo.online",
  EMAIL_TEMPLATES: {
    FIRST: "d-0214f1135b054334abbdcfad5446a077",
    MAIN_PAGE_FEEDBACK: "d-12e143596ebc45238b23660164a13ca4",
    CLIENT_MADE_AN_APPOINTMENT: "d-006ae47f70c74c949e486cf9f63b694e",
  }
}

export const telegramConfig = {
  botToken: "1872651080:AAEw6lNr2WaRKXo_00Zn2WoXnxxODnUMIqI",
  logobotChatId: "-554014625"
}

export const zoomConfig = {
  signatureEndpoint: 'https://logogo2.herokuapp.com/',
  apiKey: 'dWazcIapThSCK7BxnBZrKg',
  meetingNumber: "9560652469",
  password: '3UFsKR',
  role: 0,
  leaveUrl: 'http://localhost:4200/profile/calendar',
  userName: 'webClient',
  userEmail: 'test@gmail.com',
  apiSecret: '6jXY6iy8J6ieMwwgqtMLTWFUDwMJo68gkZal',
  JWTToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InNTWXp5UjNUU0JXTV9FR3k3ejNxY3ciLCJleHAiOjE2MjExMDEyMjQsImlhdCI6MTYyMTA5NTgzOH0.1WnrB8C-Nsd8WpK7yhGlAKCCnPRWOMe7-CSCNoPcfFI',
  allTimeMeetingLink: "https://us04web.zoom.us/j/9560652469?pwd=ODdONGhHYzkwanRCaUs4WS9YNW5qdz09",
  allTimeMeetingId: "9560652469",
  allTimeMeetingPass: "3UFsKR"
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
