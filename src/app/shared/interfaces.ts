export interface SpecialistCard {
   name: string
   specialization: string
   experience: string
   img?: string
}

export interface TabContent {
   title: string
   description: string
}

export interface ProfessionOptions {
   title: string
   value: string
}

export interface User {
   email: string
   password: string
   returnSecureToken?: boolean
}

export interface FbAuthResponce {
   localId: string
   idToken: string
   expiresIn: string
}

export class Environment {
   production: boolean
   apiKey: string
}

export interface AnyUser {
   userType: "client" | "doctor"
   name: string
}

export interface UserDbInfo {
   name: string
   surname: string
   patronymic: string
   userType: "client" | "doctor"
   email?: string
   description?: string
   //client keys
   childDiagnosis?: string //будет писаться в тикете к занятию
   //doctor keys
   weeklySchedule?: []
   schedule?: []
   educationsCount?: number
   university?: string
   faculty?: string
   year?: number
   university2?: string
   faculty2?: string
   year2?: number
   university3?: string
   faculty3?: string
   year3?: number
   experience?: string
   workPlace?: string
   patientLessons?: any[]
   sertificatesLinks?: any[]
   sertificatesNames?: any[]
   avatarUrl?: string
   //service keys
   id?: string
   daysShedule?: any //не используется. не помню зачем оно
   eventsDates?: Object
   events?: Object
   orders?: Object
   ordersArr?: Array<string>
   ordersFuture?: Object
   ordersFutureIds?: Array<string>
   lessons?: any
   emailVerified?: boolean
   specializations?: string[]
   mainSpecialization?: string
   aboutMe?: string,
   zoomLink?: string,
   currentTime?: string,

}

export interface UserClient {
   name: string
   surname: string
   patronymic: string
   userType: "client"
   description: string
   childDiagnosis: string
}

export interface UserDoctor {
   name: string
   surname: string
   patronymic: string
   userType: "doctor"
   weeklySchedule?: []
   description: string
   university: string
   faculty: string
   year?: number
   university2: string
   faculty2: string
   year2?: number
   university3: string
   faculty3: string
   year3?: number
   educationsCount?: number
   yearOfIssue: number
   experience: string
   placeOfWork: string
   patientLessons: any[]
   avatarUrl?: string
   mainSpecialization?: string
   specializations?: string[]
   daysShedule?: object
   aboutMe?: string
   events?: object
   sertificatesLinks?: string[],
   zoomLink?: string,
   shortId: string
}

export interface UserCredentials {
   uid: string,
   email: string,
   emailVerified: boolean,
}

export interface Event {
   date?: {
      year: number,
      month: number,
      day: number,
      time: number,
   },
   time?: number,
   doctorsConfirmation?: boolean
}

export interface Signature {
   signature: string
}

export interface ZoomInfo {
   date?: object
   daysLeft?: number
   doctorId?: string
   doctorName?: string
   doctorsConfirmation?: boolean
   patientId?: string
   patientName?: string
   problemDescription?: string
   time?: number
   zoom?: {
      id?: string
      link?: string
      password?: string
   }
}

export interface ClientFeedbackObj {
   name: string,
   surname: string,
   dob: string,
   email: string,
   phone: string,
   question: string,
}

export interface SpecialistFeedbackObj {
   name: string,
   specialization: string,
   email: string,
   phone: string,
   description: string,
}

export interface EmailData {
   to: string,
   from: string,
   templateId: string,
   dynamicTemplateData: object
}


export interface allCookies {
   acceptCookie?: boolean,
   
}

export interface alfaRegistrationResp {
   formUrl: string,
}





