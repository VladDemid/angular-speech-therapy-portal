import { Component, OnInit, Input } from '@angular/core';
import { ProfessionOptions, UserDbInfo } from '../../interfaces';

@Component({
  selector: 'app-our-specialists',
  templateUrl: './our-specialists.component.html',
  styleUrls: ['./our-specialists.component.sass']
})
export class OurSpecialistsComponent implements OnInit {
  @Input() firebaseDoctors: UserDbInfo[]
  @Input() isProfileModule: boolean

  activeSpecialists: string = ""
  activeProblems: string = ""

  specialist_selector = {
    active: false,
    selected: "Специализация",
    selectedIndex: -1
  }

  problem_selector = {
    active: false,
    selected: "Проблема",
    selectedIndex: -1
  }

  diagnose: ProfessionOptions[] = [
    {title: "Логопед", value: "speech-therapist"},
    {title: "Логопед (ранний возраст)", value: "speech-therapist-early-age"},
    {title: "Учитель-дефектолог", value: "teacher-defectologist"},
    {title: "Специалист по РАС", value: "asd-specialist"},
    {title: "Специалист по запуску речи", value: "speech-start-spec"},
    {title: "Сурдопедагог", value: "deaf-teacher"},
    {title: "Нейропсихолог", value: "neuropsychologist"},
    {title: "Дошкольный психолог", value: "preschool-psychologist"},
    {title: "Психолог", value: "psychologist"},
    {title: "Семейный психолог", value: "family-psychologist"},
    {title: "Детский психолог", value: ""},
    {title: "Арт-терапевт", value: ""},
    {title: "Психоаналитик", value: ""},
    {title: "Гештальт-терапевт", value: ""},
    {title: "Тифлопедагог", value: ""},
  ]

    

  problems: ProfessionOptions[] = [
    {title: "Нарушение звукопроизношения", value: ""},
    {title: "Отсутствие речи", value: ""},
    {title: "ОНР", value: ""},
    {title: "Дизартрия", value: ""},
    {title: "Заикание", value: ""},
    {title: "Расщелина неба", value: ""},
    {title: "Алалия", value: ""},
    {title: "Задержка психо-моторного развития", value: ""},
    {title: "ДЦП", value: ""},
    {title: "Задержка познавательного (психического) развития", value: ""},
    {title: "Нарушение слуха", value: ""},
    {title: "Кохлеарная имплантация", value: ""},
    {title: "Нарушение зрения", value: ""},
    {title: "РАС", value: ""},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSpecializationChange(selector) {
    this.activeSpecialists = selector.value
  }

  toggleSpecialistSelector() {
    this.specialist_selector.active = !this.specialist_selector.active
  }
  
  chooseSpecialisation(specialisation, i) {
    console.log(specialisation, i);
    this.specialist_selector.selected = specialisation
    this.specialist_selector.selectedIndex = i
  }
  
  toggleProblemSelector() {
    this.problem_selector.active = !this.problem_selector.active
  }
  
  chooseProblem(problem, i) {
    console.log(problem, i);
    this.problem_selector.selected = problem
    this.problem_selector.selectedIndex = i
  }

  closeLists() {
    this.specialist_selector.active ? this.specialist_selector.active = !this.specialist_selector.active : true
    this.problem_selector.active ? this.problem_selector.active = !this.problem_selector.active : true
  }

}
