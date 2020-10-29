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
   description: string
   //client keys
   childDiagnosis?: string
   babyLessons?: any[]
   email?: string
   //doctor keys
   university?: string
   faculty?: string
   year?: number
   experience?: string
   workPlace?: string
   patientLessons?: any[]
   sertificatesLinks?: any[]
   sertificatesNames?: any[]
   avatarUrl?: string
   //service keys
   id?: string
   daysShedule?: any
   lessons?: any
   emailVerified?: boolean
}

export interface UserClient {
   name: string
   surname: string
   patronymic: string
   userType: "client"
   description: string
   childDiagnosis: string
   babyLessons: any[]
}

export interface UserDoctor {
   name: string
   surname: string
   patronymic: string
   userType: "doctor"
   description: string
   university: string
   faculty: string
   yearOfIssue: number
   experience: string
   placeOfWork: string
   patientLessons: any[]
   avatarUrl?: string
   specialization?: string
   daysShedule?: object
}