import { Injectable, OnInit } from '@angular/core';
import { environment, telegramConfig } from 'src/environments/environment';

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


  sendNewLessonMessage(eventLesson) {
  
    const message = `Пользователь ${eventLesson.patientName} (${eventLesson.patientId}) записался на занятие к ${eventLesson.doctorName} (${eventLesson.doctorId}) с проблемой "${eventLesson.problemDescription}" на ${eventLesson.date.day}.${eventLesson.date.month}.${eventLesson.date.year}`
    const chatId = telegramConfig.logobotChatId
    let url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage?chat_id=${chatId}&text=${message}`
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", url, true)
    xhttp.send()
  }

}
