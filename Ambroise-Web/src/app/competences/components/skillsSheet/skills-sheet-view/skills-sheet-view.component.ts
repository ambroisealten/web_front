import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { SkillsFormComponent } from '../skills-form/skills-form.component';
import { Subscription } from 'rxjs';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { SubMenu } from 'src/app/header/models/menu';
import { SkillsSheet } from 'src/app/competences/models/skillsSheet';
import { Skills } from 'src/app/competences/models/skills';
import { Person } from 'src/app/competences/models/person';

@Component({
  selector: 'app-skills-sheet-view',
  templateUrl: './skills-sheet-view.component.html',
  styleUrls: ['./skills-sheet-view.component.scss']
})
export class SkillsSheetViewComponent implements OnInit, OnDestroy {

  @ViewChild('skillsSheetHost', { read: ViewContainerRef }) entry: ViewContainerRef;
  componentRef: any;

  skillsFormComponent: ComponentRef<SkillsFormComponent>;

  //information contains in the path
  name: string;
  version: number;

  //subscription
  skillsSubscription;

  constructor(private skillsService: SkillsService,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService,
    private router: Router,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private subMenusService: SubMenusService) { }

  /**
   * @author Quentin Della-Pasqua
   */
  ngOnInit() {
    if (window.sessionStorage.getItem('person') != null) {
      let person: Person = JSON.parse(window.sessionStorage.getItem('person'))
      if (window.sessionStorage.getItem('skills') == null) {
        this.skillsSheetService.getSkillsSheetsByMail(person.mail).subscribe(skillsSheets => {
          window.sessionStorage.setItem('skills', JSON.stringify(skillsSheets));
          this.setSkillsFormComponent();
        });
      } else {
        this.setSkillsFormComponent();
      }
    } else {
      this.skillsSubscription = this.skillsService.skillsObservable.subscribe(skills => this.initializeStorage(skills));
    }
  }

  /**
   * Unsubscribe the subscription 
   * @author Quentin Della-Pasqua
   */
  ngOnDestroy() {
    if (this.skillsSubscription != undefined) {
      this.skillsSubscription.unsubscribe();
    }
  }

  /**
   * Create skillsFormComponent and bind to component
   * @author Quentin Della-Pasqua
   */
  setSkillsFormComponent() {
    try {
      this.componentRef.destroy();
    } catch (e) {

    }
    this.entry.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SkillsFormComponent);
    this.componentRef = this.entry.createComponent(componentFactory);
    const subPdf: Subscription = this.componentRef.instance.pdf.subscribe(event => this.createPDFComponent());
    this.componentRef.onDestroy(() => subPdf.unsubscribe());
  }

  /**
   * Store data in the sessionStorage
   * @param skills 
   * @author Quentin Della-Pasqua
   */
  initializeStorage(skills: Skills) {
    if (skills == undefined) {
      this.router.navigate(['skills']);
    } else {
      window.sessionStorage.setItem('person', JSON.stringify(skills.person));
      this.skillsSheetService.getSkillsSheetsByMail(skills.person.mail).subscribe(skillsSheets => {
        window.sessionStorage.setItem('skills', JSON.stringify(skillsSheets));
        this.setSkillsFormComponent();
      });
    }
  }

  /**
   * Create and bind to the pdf component
   * @author Quentin Della-Pasqua
   */
  createPDFComponent() {
    try {
      this.componentRef.destroy();
    } catch (e) {

    }
  }

}
