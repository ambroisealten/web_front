import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router, NavigationExtras } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { PersonRole } from 'src/app/competences/models/person';

@Component({
  selector: 'app-page-skills-home',
  templateUrl: './page-skills-home.component.html',
  styleUrls: ['./page-skills-home.component.scss']
})
export class PageSkillsHomeComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router, private skillsSheetService: SkillsSheetService) { }

  ngOnInit() {
  }

  /**
  * Create a new applicant with his skillsSheet
  * Temporary function here, will be in header menu or home page
  */
  createCandidateModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ModalSkillsCandidateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(newPersonData => {
      if(newPersonData != undefined) {
        let newPersonMail = newPersonData.mail;
        let isApplicant = newPersonData.role === PersonRole.APPLICANT;
        this.skillsSheetService.checkPersonExistence(newPersonMail, isApplicant);
        this.skillsSheetService.personObservable.subscribe((person: Object) => {
              if(person != undefined) {
                this.skillsSheetService.resetPersonInformation(); // reset observable value
                this.redirectToSkillsSheet();
              }
            })
      }
    });
  }

  redirectToSkillsSheet() {
    this.router.navigate(['skillsSheet']);
  }

}
