import { Component, OnInit } from '@angular/core';
import { File } from '../../models/File';
import { AdminService } from '../../services/admin.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataFileDialogComponent } from '../data-file-dialog/data-file-dialog.component';
import { DocumentSet } from '../../models/DocumentSet';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Component({
  selector: 'app-admin-document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.scss']
})
export class AdminDocumentComponent implements OnInit {

  files: File[] = [];
  filesForForum: File[] = [];
  filesSet: File[] = [];
  allSet: DocumentSet[] = [];
  currentSet: DocumentSet;


  constructor(private adminService: AdminService, private dialog: MatDialog) { }

  ngOnInit() {
    this.searchFiles();
    this.fetchAllSet();
  }

  onFilesChange() {
    for (const file of this.files) {
      const filePath = file.path;
      if (filePath.startsWith('/Forum/') && !this.filesSet.includes(file)) {
        this.filesForForum.push(file);
      }
    }
  }

  getAllSets() {
    return this.allSet;
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
    debugger;
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
      const ok = confirm('Êtes-vous sûr de ne vouloir mettre aucun documents dans l\'ensemble ' + this.currentSet.name + '?');
      if (!ok) {
        return;
      }
    }
    const postParams = {
      oldName: this.currentSet.name,
      name: this.currentSet.name,
      files: finalList,
    };
    this.adminService.saveSet(postParams);
  }

  setSelected(event) {
    LoggerService.log(this.currentSet, LogLevel.DEBUG);
    this.allSet.forEach(set => {
      if (set.name === event.value) {
        this.currentSet = set;
      }
    });
    this.currentSet = event.value;
    LoggerService.log(this.currentSet, LogLevel.DEBUG);
  }

  searchFiles() {
    this.adminService.getFiles().subscribe((filesList: File[]) => {
      if (filesList !== undefined) {
        this.files = filesList;
      }
      // notify that file list is changed
      this.onFilesChange();
    });
  }

  fetchCurrentSet() {
    this.adminService.getSetFiles(this.currentSet.name).subscribe((set: DocumentSet) => {
      if (set !== undefined) {
        this.currentSet = set;
        this.filesSet = [];
        set.mobileDocs.forEach(mobileDoc => {
          this.fetchFile(mobileDoc.name);
        });
      }
    });
  }

  fetchFile(fileName: string) {
    console.log(fileName);
    this.adminService.getFile(fileName).subscribe((file: File) => {
      if (file !== undefined) {
        this.filesSet.push(file);
      }
    });
  }

  fetchAllSet() {
    this.adminService.getAllSet().subscribe((setList: DocumentSet[]) => {
      if (setList !== undefined) {
        this.allSet = setList;
      }
      this.currentSet = this.allSet[0];
      this.fetchCurrentSet();
    });
  }
}
