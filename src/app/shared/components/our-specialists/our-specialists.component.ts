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

  selectedSpecialisation: string = ""
  selectedProblem: string = ""

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
    {title: "логопед", value: "speech-therapist"},
    {title: "логопед (ранний возраст)", value: "speech-therapist-early-age"},
    {title: "учитель-дефектолог", value: "teacher-defectologist"},
    {title: "специалист по РАС", value: "asd-specialist"},
    {title: "специалист по запуску речи", value: "speech-start-spec"},
    {title: "сурдопедагог", value: "deaf-teacher"},
    {title: "нейропсихолог", value: "neuropsychologist"},
    {title: "дошкольный психолог", value: "preschool-psychologist"},
    {title: "психолог", value: "psychologist"},
    {title: "семейный психолог", value: "family-psychologist"},
    {title: "детский психолог", value: ""},
    {title: "арт-терапевт", value: ""},
    {title: "психоаналитик", value: ""},
    {title: "гештальт-терапевт", value: ""},
    {title: "тифлопедагог", value: ""},
  ]

    

  problems: ProfessionOptions[] = [
    {title: "нарушение звукопроизношения", value: ""},
    {title: "отсутствие речи", value: ""},
    {title: "ОНР", value: ""},
    {title: "дизартрия", value: ""},
    {title: "заикание", value: ""},
    {title: "расщелина неба", value: ""},
    {title: "алалия", value: ""},
    {title: "задержка психо-моторного развития", value: ""},
    {title: "ДЦП", value: ""},
    {title: "задержка познавательного (психического) развития", value: ""},
    {title: "нарушение слуха", value: ""},
    {title: "кохлеарная имплантация", value: ""},
    {title: "нарушение зрения", value: ""},
    {title: "РАС", value: ""},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  // onSpecializationChange(selector) {
  //   this.selectedSpecialisation = selector.value
  // }

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
