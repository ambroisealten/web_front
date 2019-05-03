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

  files: File[] = [];
  filesForForum: File[] = [];
  filesSet: File[] = [];
  allFilesIdForum = ['id4d4hf754874', 'id5468546gfh4dh'];
  currentSet = 'Forum';


  constructor(private adminService: AdminService, private dialog: MatDialog) { }

  ngOnInit() {
    this.searchFiles();
  }

  onFilesChange() {
    for (const file of this.files) {
      const filePath = file.path;
      if (filePath.startsWith('/forum/') && !this.allFilesIdForum.includes(file._id)) {
        this.filesForForum.push(file);
      }
    }
  }

  getDocuments() {
    return this.files;
  }

  removeDocument(document: File) {
    const params = {
      _id: document._id,
      extension: document.extension,
      path: document.path,
    };
    this.adminService.deleteFile(params, null);
  }

  editDocument(document: File) {

    const dialogDocument = this.openDialogDocument(document);

    dialogDocument.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const oldPath = document.path;
          document.path = data.path;
          document.displayName = data.displayName;
          const postParams = {
            oldPath,
            newPath: document.path,
            displayName: document.displayName,
            _id: document._id,
            extension: document.extension
          };
          this.adminService.updateFile(postParams, '');
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
      path: document.path,
      displayName: document.displayName
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
      const ok = confirm('Êtes-vous sûr de ne vouloir mettre aucun documents dans l\'ensemble ' + this.currentSet + '?');
      if (!ok) {
        return;
      }
    }
    const postParams = {
      oldName: this.currentSet,
      name: this.currentSet,
      files: finalList,
    };
    this.adminService.makeRequest('admin/documentset', 'put', postParams, '');
  }

  setSelected(event) {
    this.currentSet = event.value;
  }

  searchFiles() {
    this.adminService.getFiles().subscribe((filesList: File[]) => {
      LoggerService.log(filesList, LogLevel.DEBUG);
      if (filesList !== undefined) {
        this.files = filesList;
      }
      // notify that file list is changed
      this.onFilesChange();
    });
  }

}
