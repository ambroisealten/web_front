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

/**
 * Thomas Decamp
 */
export class ModalDeleteSkillsSheetComponent implements OnInit {

  name: string;
  errorMessage : string;
  replaceName : string;
  replaceVersion : number;

  currentPerson: Person;
  currentSkillsSheet: SkillsSheet;

  isDeleted: boolean = false;

  tmpSkillsSheets: any[];

  constructor(private dialogRef: MatDialogRef<ModalDeleteSkillsSheetComponent>,
    private toastrService: ToastrService,
    private subMenusService: SubMenusService,
    private skillsSheetService: SkillsSheetService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data) {
    this.currentPerson = data.person;
    this.currentSkillsSheet = data.skillsSheet;
    this.errorMessage = "";
    this.replaceName = data.replaceSheet;
    this.replaceVersion = data.replaceSheetVersion;
  }

  ngOnInit() {
    this.tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
  }

  deleteFiche() {
    const deleteSkillsSheet = this.currentSkillsSheet;
    this.skillsSheetService.deleteSkillsSheet(deleteSkillsSheet).subscribe(httpResponse => {
      if (httpResponse['stackTrace'][0]['lineNumber'] === 200) {
        this.isDeleted = true;
        const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
        tmpSkillsSheets.forEach(sheet => {
          if (sheet.name === deleteSkillsSheet.name)
            tmpSkillsSheets.splice(tmpSkillsSheets.indexOf(sheet),1);
        });
        window.sessionStorage.setItem('skills', JSON.stringify(tmpSkillsSheets));
        this.router.navigate(['skills/skillsheet/' + this.replaceName + '/' + this.replaceVersion]);
        this.subMenusService.notifyMenuAction('');
        this.toastrService.info('Fiche de compétence supprimée avec succès !', '', { positionClass: 'toast-bottom-full-width', timeOut: 1850, closeButton: true });
        this.dialogRef.close();
      }
    });
  }

}
