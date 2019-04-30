import { Component, OnInit } from '@angular/core';
import { File } from '../../models/File';
import { AdminService } from '../../services/admin.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LoggerService, LogLevel } from '../../../services/logger.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataFileDialogComponent } from '../data-file-dialog/data-file-dialog.component';

@Component({
  selector: 'app-admin-document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.scss']
})
export class AdminDocumentComponent implements OnInit {

  files = [new File('id54dfs54dgfs54dg5sg', '/forum/2019/global/', 'png', '1555511830668', 'Logo ALTEN'), new File('id546dgs546gs7546fqe8', '/global/2019/', 'pdf', '1555511830716', 'Cahier de test'), new File('iddvs546375g', '/forum/2015/global/', 'docx', '1555511874438', 'Login Documentation'), new File('id4d4hf754874', '/forum/2019/global/', 'pdf', '1555511830668', 'Presentation ALTEN'), new File('id5468546gfh4dh', '/forum/2019/global/', 'png', '1555511830667', 'Bienvenue à ALTEN')];
  filesForForum = [];
  filesForum = [new File('id4d4hf754874', '/forum/2019/global/', 'pdf', '1555511830668', 'Presentation ALTEN'), new File('id5468546gfh4dh', '/forum/2019/global/', 'png', '1555511830667', 'Bienvenue à ALTEN')];
  allFilesIdForum = ['id4d4hf754874', 'id5468546gfh4dh'];
  allSets = { '/2019/global/': this.filesForum };
  currentSet = '';

  constructor(private adminService: AdminService, private dialog: MatDialog) {
    const currentYear = new Date().getFullYear().toString();
    this.currentSet = '/' + currentYear + '/global/';
    for (const file of this.files) {
      const filePath = file.getPath();
      if (filePath.startsWith('/forum/') && !this.allFilesIdForum.includes(file.get_id())) {
        this.filesForForum.push(file);
      }
    }
    LoggerService.log(this.filesForForum, LogLevel.DEBUG);
  }

  ngOnInit() {

  }

  getDocuments() {
    return this.files;
  }

  removeDocument(document: File) {
    const params = {
      _id: document.get_id(),
      extension: document.getExtension(),
    };
    this.adminService.deleteFile(params, null);
  }

  editDocument(document: File) {

    const dialogDocument = this.openDialogDocument(document);

    dialogDocument.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const oldPath = document.getPath();
          document.setPath(data.path);
          document.setDisplayName(data.displayName);
          const postParams = {
            oldPath,
            newPath: document.getPath(),
            displayName: document.getDisplayName(),
            _id: document.get_id(),
            extension: document.getExtension()
          };
          this.adminService.makeRequest('file', 'put', postParams, '');
        }
      });
  }

  openDialogDocument(document: File) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'Document edition',
      description: 'Document edition',
      path: document.getPath(),
      displayName: document.getDisplayName()
    };

    return this.dialog.open(DataFileDialogComponent, dialogConfig);
  }


  visualize(uri: string) {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  submitListForum() {
    const finalList = [];
    const dropList = document.getElementsByClassName('cdk-drop-list')[1];
    let order = 0;
    for (let i = 0; i < dropList.childNodes.length; i++) {
      const child = dropList.childNodes[i];
      if (child.nodeName === 'DIV') {
        order++;
        const childObject = {};
        childObject['id'] = child.childNodes[1].textContent;
        childObject['order'] = order;
        finalList.push(childObject);
      }
    }
    if (finalList.length === 0) {
      const test = confirm('Êtes-vous sûr de ne mettre aucun documents ?');
      if (test) {
        // Update request
      } else {
        // Nothing (?)
      }
    }
    LoggerService.log(finalList, LogLevel.DEBUG);
  }
}
