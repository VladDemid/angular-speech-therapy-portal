export const environment = { //*PROD
  production: true,
  apiKey: "AIzaSyDZgKMaO0pCmO8AuLmwfmjEduV-p0tJ3E4",
  FbDbUrl: "https://verbaland.firebaseio.com/",
  defaultAvatarUrl: "https://firebasestorage.googleapis.com/v0/b/inclusive-test.appspot.com/o/users%2Fdefault%2Fdefault-user-avatar.png?alt=media&token=5ae4b7c5-c579-4050-910d-942bbb3c7bba"
};

export const firebaseConfig = { //*PROD
  apiKey: "AIzaSyDZgKMaO0pCmO8AuLmwfmjEduV-p0tJ3E4",
  authDomain: "verbaland.firebaseapp.com",
  databaseURL: "https://verbaland.firebaseio.com",
  projectId: "verbaland",
  storageBucket: "verbaland.appspot.com",
  messagingSenderId: "725914811248",
  appId: "1:725914811248:web:aed51fdbbd11a5558fedb5"
};

// export const environment = { //! DEV
//   production: false,
//   apiKey: "AIzaSyACtKsTQZUkp9Xp3zv7E3BNoiyK8AAWXas",
//   FbDbUrl: "https://inclusive-test.firebaseio.com/",
//   defaultAvatarUrl: "https://firebasestorage.googleapis.com/v0/b/inclusive-test.appspot.com/o/users%2Fdefault%2Fdefault-user-avatar.png?alt=media&token=5ae4b7c5-c579-4050-910d-942bbb3c7bba"
// };

// export const firebaseConfig = { //! DEV
//   apiKey: "AIzaSyACtKsTQZUkp9Xp3zv7E3BNoiyK8AAWXas",
//   authDomain: "inclusive-test.firebaseapp.com",
//   databaseURL: "https://inclusive-test.firebaseio.com",
//   projectId: "inclusive-test",
//   storageBucket: "inclusive-test.appspot.com",
//   messagingSenderId: "441293072662",
//   appId: "1:441293072662:web:679ec4fe7378d9b9c04837"
// }

export const environmentOther = {
  emailDefault: "",
  passwordDefault: "",
  name: "",
  surname: "",
  dob: "",
  emailClient: "",
  emailSpec: "",
  phone: '',
  question: "",
  specialization: ""
}

export const emailConfig = {
  fromEmailAdress: "vlatidos@gmail.com",
  EMAIL_TEMPLATES: {
    FIRST: "d-0214f1135b054334abbdcfad5446a077",
    MAIN_PAGE_FEEDBACK: "d-12e143596ebc45238b23660164a13ca4"
 
 }
}

export const telegramConfig = {
  botToken: "5073623051:AAE7hs3R5jy7jwN6W9p1P1owKhBlunK4wJg",
  logobotChatId: "-632966989"
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