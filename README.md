# Logogo (внутренняя документация)

Чем занимается портал:
онлайн консультации комплексная диагностика индивидуальные занятия со специалистами:
логопеды, психологи, сурдопедагоги, тифлопедагоги, специалисты по РАС, специалисты по двигательной реабилитации детей с ДЦП

Технологии: 
- Angular 13.1.1
- Firebase 8.10.0 (namespaced, not modular)

Дополнительные сервисы:
- Telegram bot
- Sendgrid - email sending service
- Alfa bank acquiring (in dev..)

## Архитектура приложения

3 модуля angular:
- "app" - основной (все первичное, чтобы ознакомиться с порталом)
   > 
   - Главная страница 
   - Регистрация
   - пользовательское соглашение. 
   >
   routing -> app-routing.module 
   
- "profile" - для для страниц /profile/.. - личный кабинет пользователя
   >
   - поиск специалистов
   - календарь
   - редактирование своих данных
   >
   routing в модуле

- "admin" - админская панель 
   >
   - ручная регистрация одобренных спецов 
   - ручное изменение пользователей в БД firebase
   - другие функции по необходимости (in dev..)
   >
   routing в модуле

## Services

Сервисы из папки `shared/services`

- firebase
   > 
   - Доступ к функционалу firebase посредством REST и SDK
   - firebase SDK инициализируется используя environment.firebaseConfig 
   ### База данных + storage (.jpg)
   - REST запросы кроме "GET" должны дополняться токеном. Пример: `link....json?auth=${authToken}`. Присутствуют функции с запросами без токенов. Это старые функции, возможно нигде уже не используемые
   - SDK запросы выполняются посредством внутренних методов `firebase.storage()` , `firebase.database()`
   ### Запуск firebase functions
   - Приватные функции: `.httpsCallable('funcName')` запуск через внутренний SDK. Соответственно функция .`onCall()` 
   - Публичные функции `.onRequest()`. Доступные по `"GET"` запросу

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
