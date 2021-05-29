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
   childDiagnosis?: string
   //doctor keys
   weeklySchedule?: []
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
   daysShedule?: any
   eventsDates?: Object
   events?: any
   lessons?: any
   emailVerified?: boolean
   specializations?: string[]
   mainSpecialization?: string
   aboutMe?: string
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
}

export interface Event {
   date: {
      year: number,
      month: number,
      day: number
   },
   time: number
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

