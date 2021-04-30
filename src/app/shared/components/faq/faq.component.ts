import { Component, OnInit } from '@angular/core';
import { TabContent } from '../../interfaces';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass']
})
export class FaqComponent implements OnInit {

  currentFaq: number

  faqTabsContent: TabContent[] = [
    {title: "Сколько длится консультация?", description: "Консультация длится 40 мин. Это время общения с профильным специалистом, который сможет сориентировать вас в этапах формирования речи, познавательной, двигательной сферы ребенка и направлениях коррекционной работы, посоветовать подходящие именно вам способы и приемы взаимодействия в условиях дома и общественных местах и ответит на другие, волнующие вопросы, связанные с детским развитием."},
    {title: "Что я могу получить от онлайн-консультации?", description: "- Первичное или альтернативное мнение ведущих специалистов о состоянии развития вашего ребенка.    - Индивидуальный план работы: перечень и описание заданий и упражнений, подходящих именно вашему ребенку.    - Рекомендации по регуляции детского поведения и организации занятий в домашних условиях.    -  Советы по организации режима питания, занятий, сна и отдыха для вашего ребенка.    - Подсказки для регуляции внутрисемейных отношений при появлении малыша с особенностями.    - Спланировать онлайн-занятия.     - Договориться о заочной форме онлайн-обучения."},
    {title: "Как мне общаться со специалистом, чтобы получить максимальный эффект от консультации?", description: "- Подготовьте к моменту консультации медицинские данные о ребенке: выписку из истории развития (как протекала беременность, с каким весом, ростом и в какой срок родился, какие данные по шкале Апгар, какие диагнозы были выставлены при выписке из родильного отделения, какие заболевания, травмы перенес), справки и заключения узких специалистов, при их наличии.    - Если ребенок плохо идет на контакт и есть вероятность, что он не захочет общаться онлайн, сделайте видеозапись беспокоящих вас моментов и продемонстрируйте специалисту в ходе консультации.    - Составьте перечень вопросов, которые вы бы хотели задать специалисту.     - Постарайтесь предварительно максимально подробно описать беспокоящую вас ситуацию."},
    {title: "Консультация проводится в присутствии ребенка?", description: "Присутствие ребенка желательно. Это позволит специалисту объективно оценить ситуацию и ориентироваться в своих рекомендациях на полученные данные.    В случае, если ребенок не идет на контакт, родителям нужно максимально подробно описать ситуацию и сформировать запрос к специалисту."},
    {title: "А что насчет онлайн-занятий?", description: "Такую форму онлайн взаимодействия мы тоже применяем. Занятия длятся 40 мин., в зависимости от возраста и возможностей ребенка по ценам, указанным в профилях специалистов.     При этом мы хотим, чтобы ваши дети и вы получали максимальный эффект от онлайн-обучения. Поэтому решение о целесообразности таких занятий принимается только после первой консультации и при условии, что ребенок прямо или косвенно (с помощью родителя) идет на контакт со специалистом. Если такой возможности нет, не отчаивайтесь! В этом случае мы предусмотрели заочную форму онлайн-обучения."},
    {title: "Что такое заочная форма онлайн-обучения?", description: "Это прекрасный формат коррекционной помощи для родителей, не имеющих возможность регулярно посещать специалистов с детьми и готовых активно учиться и проводить занятия самостоятельно под опытным руководством.    В условиях заочного онлайн-обучения родители получают от специалиста перечень заданий с подробным описанием приемов работы на определенный промежуток времени.     По истечении указанного срока, родители возвращаются к специалисту за новой консультацией и новым комплексом заданий. Специалист отслеживает динамику развития ребенка и дает новые рекомендации по совершенствованию коррекционного процесса."},
  ]

  constructor() { }

  ngOnInit(): void {
    this.currentFaq = -1
  }

  changeCurrentFaq(newCurrentFaq) {
    if (this.currentFaq != newCurrentFaq) {
      this.currentFaq = newCurrentFaq
    } else {
      this.currentFaq = -1
    }
    // console.log("родитель. currentFaq", this.currentFaq);
  }

}