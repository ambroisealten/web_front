import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Skill, SkillGraduated } from 'src/app/competences/models/skillsSheet';
import { SkillsListService } from '../../../services/skillsList.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-array-skills',
  templateUrl: './array-skills.component.html',
  styleUrls: ['./array-skills.component.scss']
})
/**
* Component containing an array with skills or soft skills and their grades
*/
export class ArraySkillsComponent implements OnInit, OnDestroy {

  @Input() displayedColumns: string[]; // names of columns to display
  @Input() dataSourceArray: any[]; // data array
  @Input() removeBtnHidden: boolean; // is remove button hidden in rows
  @Input() searchBarHidden: boolean; // is search bar hidden
  @Input() dataSource: MatTableDataSource<SkillGraduated[]>; // data as MatTableDataSource

  @Output() skillsEvent = new EventEmitter<SkillGraduated[]>();

  // Tableau contenant toutes les options (compétences) pour l'auto-complétion
  options: string[];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  // Subscription ;
  skillsSubscription;


  constructor(private skillsListService: SkillsListService, private toastr: ToastrService) {
  }

  /**
   * Inits dataSource of array : skills or soft skills
   */
  ngOnInit() {
    this.getSkillsList();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      map(value => this._filter(value))
    );
  }

  ngOnDestroy() {
  }

  /**
   * Checks input of grade and sets to 1 if empty or invalid
   * @param  $event input grade
   */
  setToOneIfEmptyOrInvalid($event) {
    const grade: string = $event.target.value;
    const pattern = '^([1-3]([\\.|,]5)?)$|^4$'; // number between 1 and 4 (step 0,5) or 0
    if (!grade.match(pattern) || $event.target.value === '') {
      $event.target.value = 1;
    }
  }

  /**
 * Cherche toutes les compétences en base
 * @author Lucas Royackkers
 */
  getSkillsList() {
    this.skillsListService.getAllTechSkills().subscribe(skillsList => {
      this.options = (skillsList as Skill[]).map(skill => skill.name);
    });
  }

  /**
 * Filtre toutes les options qui correspondent à l'input user
 * 
 * @param value la valeur renseignée par l'utilisateur
 * @author Lucas Royackkers
 */
  private _filter(value: string): string[] {
    if (value.length !== 0) {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.toLowerCase().startsWith(filterValue));
    }
    else {
      return [];
    }
  }

  /**
  * Adds a skill into the array
  * @param  event skillName from input
  */
  addSkill(event) {
    if (this.dataSourceArray.length >= 24) {
      this.toastr.info('Vous ne pouvez pas mettre plus de 24 compétences par fiche de compétence', '', { positionClass: 'toast-bottom-full-width', closeButton: true })
      return null;
    }
    if (event.target.value.trim() !== '') {
      const skillName = event.target.value;

      // if skillname not already in array : add it
      if (this.dataSourceArray.findIndex(skillGraduated => skillGraduated.skill.name.toLowerCase().trim() === skillName.toLowerCase().trim()) === -1) {

        this.dataSourceArray.push(new SkillGraduated(new Skill(skillName), 1));
        this.dataSource = new MatTableDataSource(this.dataSourceArray);

        this.updateDataSourceInService();
      }
      event.target.value = '';
    }
  }

  /**
  * Removes a skill from the array
  * @param  event button clicked in skill row
  */
  removeSkill(event) {
    const skillName = event.target.closest('tr').childNodes[1].innerText; // get skillName from row
    const skillIndex = this.dataSourceArray.findIndex(skillGraduated => skillGraduated.skill.name === skillName);

    this.dataSourceArray.splice(skillIndex, 1);
    this.dataSource = new MatTableDataSource(this.dataSourceArray);

    this.updateDataSourceInService();
  }

  /**
  * Handles the stepUp() and stepDown() functions for the grades in the array.
  * @param  event grade value from input
  */
  updateGradeEvent(event) {
    const skillName = event.target.closest('tr').childNodes[1].innerText; // get skillName from same row as modified grade
    const grade = event.target.parentElement.childNodes[1].value;

    this.dataSourceArray.forEach(skillGraduated => {
      if (skillGraduated.skill.name === skillName) {
        if (grade == 1.5 && event.target.className === 'incrementButton') {
          skillGraduated.grade = 2;
        } else if (grade == 1.5 && event.target.className === 'decrementButton') {
          skillGraduated.grade = 1;
        } else {
          skillGraduated.grade = +grade;
        }
      }
    });
    this.updateDataSourceInService();
  }

  /**
    * Updates skills or softSkills array in skills service
    */
  updateDataSourceInService() {
    this.checkGradeValues();
    this.skillsEvent.emit(this.dataSourceArray);
  }

  /**
   * Check if every grade is valid before sending to service
   * If grade invalid, set to 1
   */
  checkGradeValues() {
    const pattern = '^([1-3]([\\.|,]5)?)$|^4$'; // number between 1 and 4 (step 0,5) or 0

    this.dataSourceArray.forEach(skillGraduated => {
      if (!skillGraduated.grade.toString().match(pattern)) {
        skillGraduated.grade = 1;
      }
    });
  }
}
