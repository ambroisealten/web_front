import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/components/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router, NavigationExtras } from '@angular/router';
import { PersonRole, Person } from 'src/app/models/person';
import { SkillsSheetService } from 'src/app/services/skillsSheet.service';

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
