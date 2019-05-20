import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Person } from 'src/app/competences/models/person';
import { PageSkillsHomeComponent } from '../../accueil/page-skills-home/page-skills-home.component';
import { SkillsSheet } from 'src/app/competences/models/skillsSheet';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-new-skills-sheet',
  templateUrl: './modal-new-skills-sheet.component.html',
  styleUrls: ['./modal-new-skills-sheet.component.scss']
})
export class ModalNewSkillsSheetComponent implements OnInit {

  name: string;

  currentPerson: Person;
  currentSkillsSheet: SkillsSheet;
  newSkillsSheet: PageSkillsHomeComponent;

  valide: boolean = true;

  tmpSkillsSheets: any[];

  constructor(private dialogRef: MatDialogRef<ModalNewSkillsSheetComponent>,
    private toastrService: ToastrService,
    private subMenusService: SubMenusService,
    private skillsSheetService: SkillsSheetService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data) {
    this.currentPerson = data.person;
  }

  ngOnInit() {
    this.tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];

  }

  onChange() {
    if (this.name == "" || this.tmpSkillsSheets.find(skillsSheet => skillsSheet.name === this.name) !== undefined) {
      this.valide = true;
    }
    else {
      this.valide = false;
    }
  }

  saveName() {
    const newSkillsSheet = new SkillsSheet(this.name, this.currentPerson);
    this.skillsSheetService.createNewSkillsSheet(newSkillsSheet).subscribe(httpResponse => {
      if (httpResponse['stackTrace'][0]['lineNumber'] === 201) {
        const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
        tmpSkillsSheets.push(newSkillsSheet);
        window.sessionStorage.setItem('skills', JSON.stringify(tmpSkillsSheets));
        this.router.navigate(['skills/skillsheet/' + this.name + '/1']);
        this.subMenusService.notifyMenuAction('');
        this.toastrService.info('Fiche de compétence créée avec succès !', '', { positionClass: 'toast-bottom-full-width', timeOut: 1850, closeButton: true });
        this.dialogRef.close();
      }
    });
  }

}
