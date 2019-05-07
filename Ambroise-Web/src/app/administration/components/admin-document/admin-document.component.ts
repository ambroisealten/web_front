import { Component, OnInit } from '@angular/core';
import { File } from '../../models/File';
import { AdminService } from '../../services/admin.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataFileDialogComponent } from '../data-file-dialog/data-file-dialog.component';
import { DocumentSet } from '../../models/DocumentSet';


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

  HEX_CHARS = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
  ];


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


  visualize() {
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
    this.allSet.forEach(set => {
      if (set.name === event.value) {
        this.currentSet = set;
      }
    });
    this.currentSet = event.value;
  }

  searchFiles() {
    this.adminService.getFiles().subscribe((filesList: File[]) => {
      if (filesList !== undefined) {
        filesList.forEach(file => {
          file._id = this.toHexString(file);
          console.log(file._id.valueOf());
        });
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
    this.adminService.getFile(fileName).subscribe((file: File) => {
      if (file !== undefined) {
        // file._id = fileName;
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

  toHexString(file: File) {
    const char: string[] = []
    for (const b of this.toByteArray(file._id.timestamp, file._id.machineIdentifier, file._id.processIdentifier, file._id.counter)) {
      char.push(this.HEX_CHARS[b >> 4 & 0xF]);
      char.push(this.HEX_CHARS[b & 0xF]);
    }
    return char.join('');
  }

  toByteArray(timestamp: number, machineIdentifier: number, processIdentifier: number, counter: number) {
    const buffer: number[] = [];
    buffer.push(this.int3(timestamp));
    buffer.push(this.int2(timestamp));
    buffer.push(this.int1(timestamp));
    buffer.push(this.int0(timestamp));
    buffer.push(this.int2(machineIdentifier));
    buffer.push(this.int1(machineIdentifier));
    buffer.push(this.int0(machineIdentifier));
    buffer.push(this.short1(processIdentifier));
    buffer.push(this.short0(processIdentifier));
    buffer.push(this.int2(counter));
    buffer.push(this.int1(counter));
    buffer.push(this.int0(counter));
    return buffer;
  }

  int3(x: number) {
    return x >> 24;
  }

  int2(x: number) {
    return x >> 16;
  }

  int1(x: number) {
    return x >> 8;
  }

  int0(x: number) {
    return x;
  }

  short1(x: number) {
    return x >> 8;
  }

  short0(x: number) {
    return x;
  }
}
