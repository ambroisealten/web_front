import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Person } from 'src/app/competences/models/person';
import { SkillsSheet } from 'src/app/competences/models/skillsSheet';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { PageSkillsHomeComponent } from '../../accueil/page-skills-home/page-skills-home.component';

@Component({
  selector: 'app-modal-delete-skills-sheet',
  templateUrl: './modal-delete-skills-sheet.component.html',
  styleUrls: ['./modal-delete-skills-sheet.component.scss']
})
export class ModalDeleteSkillsSheetComponent implements OnInit {

  name: string;
  errorMessage : string;

  currentPerson: Person;
  currentSkillsSheet: SkillsSheet;
  newSkillsSheet: PageSkillsHomeComponent;

  valide: boolean = true;

  tmpSkillsSheets: any[];

  constructor(private dialogRef: MatDialogRef<ModalDeleteSkillsSheetComponent>,
    private toastrService: ToastrService,
    private subMenusService: SubMenusService,
    private skillsSheetService: SkillsSheetService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data) {
    this.currentPerson = data.person;
    this.errorMessage = "";
  }

  ngOnInit() {
    this.tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];

  }

  onChange() {
    if (this.name == ""){
      this.valide = true;
      this.errorMessage = "Veuillez entrer un nom valide pour la fiche";
    }
    else if(this.tmpSkillsSheets.find(skillsSheet => skillsSheet.name === this.name) !== undefined) {
      this.valide = true;
      this.errorMessage = "Cette fiche existe déjà";
    }
    else {
      this.errorMessage = "";
      this.valide = false;
    }
  }

  saveName() {
    const newSkillsSheet = new SkillsSheet(this.name, this.currentPerson);
    this.skillsSheetService.createNewSkillsSheet(newSkillsSheet).subscribe(httpResponse => {
      if (httpResponse['stackTrace'][0]['lineNumber'] === 201) {
        let createdSkillsSheet = JSON.parse(httpResponse['message']) as SkillsSheet;
        const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
        tmpSkillsSheets.push(createdSkillsSheet);
        window.sessionStorage.setItem('skills', JSON.stringify(tmpSkillsSheets));
        this.router.navigate(['skills/skillsheet/' + this.name + '/1']);
        this.subMenusService.notifyMenuAction('');
        this.toastrService.info('Fiche de compétence créée avec succès !', '', { positionClass: 'toast-bottom-full-width', timeOut: 1850, closeButton: true });
        this.dialogRef.close();
      }
    });
  }

}
