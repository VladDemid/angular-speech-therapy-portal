import { Injectable, OnInit } from '@angular/core';
import { environment, telegramConfig } from 'src/environments/environment';
import { ClientFeedbackObj, SpecialistFeedbackObj } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TelegramBotService implements OnInit{

  constructor() { }

  ngOnInit() {

  }
  
  sendMessage() {
    const message = "message from web"
    const chatId = telegramConfig.logobotChatId
    let url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${chatId}&text=${message}`
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", url, true)
    xhttp.send()
  }

  telegramNotifCreateMeeting() {
    const message = "message from web #testDebug"
    let url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${telegramConfig.logobotChatId}&text=${message}`
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", url, true)
    xhttp.send()
  }

  telegramNotifConfirmMeeting(eventLesson) {
    const message = `Специалист 👨‍⚕️*${eventLesson.doctorName}* (\`${eventLesson.doctorId}\`):%0A ✅*подтвердил* занятие :%0A на 📅${eventLesson.date.day}.${eventLesson.date.month}.${eventLesson.date.year}:%0A с 🗣*${eventLesson.patientName}* (\`${eventLesson.patientId}\`)`
    let url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${telegramConfig.logobotChatId}&text=${message}&parse_mode=markdown`
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", url, true)
    xhttp.send()
  }


  sendNewLessonMessage(eventLesson) {
  
    const message = `🗣*${eventLesson.patientName}* (\`${eventLesson.patientId}\`):%0A *записался* на занятие к 👨‍⚕️*${eventLesson.doctorName}* (\`${eventLesson.doctorId}\`):%0A с проблемой "${eventLesson.problemDescription}":%0A на 📅 *${eventLesson.date.day}.${eventLesson.date.month}.${eventLesson.date.year}*`
    const chatId = telegramConfig.logobotChatId
    let url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=markdown`
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", url, true)
    xhttp.send()
  }

  sendClientFeedback(values: ClientFeedbackObj) {
    console.log(values)

    const message = `*форма обратной связи КЛИЕНТ*:%0A - ${values.name} ${values.surname} %0A - ${values.email} %0A - ${values.phone} %0A ${values.question}`
    const chatId = telegramConfig.logobotChatId
    let url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=markdown`
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", url, true)
    xhttp.send()
  }

  sendSpecialistFeedback(values: SpecialistFeedbackObj) {
    console.log(values)

    const message = `*форма обратной связи СПЕЦИАЛИСТ*:%0A - ${values.name} %0A ${values.specialisation} %0A - ${values.email} %0A - ${values.phone} %0A ${values.description}`
    const chatId = telegramConfig.logobotChatId
    let url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=markdown`
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", url, true)
    xhttp.send()
    return 
  }

}
