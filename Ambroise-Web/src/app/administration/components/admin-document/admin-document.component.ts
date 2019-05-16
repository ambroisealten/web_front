import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { File as Document } from '../../models/File';
import { AdminService } from '../../services/admin.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataFileDialogComponent } from '../data-file-dialog/data-file-dialog.component';
import { DocumentSet } from '../../models/DocumentSet';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { Router } from '@angular/router';
import { SubMenu } from 'src/app/header/models/menu';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-admin-document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.scss']
})
export class AdminDocumentComponent implements OnInit, OnDestroy {

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private subMenusService: SubMenusService,
    private router: Router) {
    this.fetchAllSet();
    this.searchFiles();
  }
  progress = 0;

  progressObservable = new Observable<number>((observer) => {
    // observable execution
    observer.next(this.progress);
    observer.complete();
  });

  files: Document[] = [];
  filesForForum: Document[] = [];
  filesSet: Document[] = [];
  allSet: DocumentSet[] = [];
  currentSet: DocumentSet;

  selectedFiles: FileList;
  clearControl = new FormControl();

  submenusSubscription;

  HEX_CHARS = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
  ];

  ngOnInit() {
    this.createMenu();
    this.submenusSubscription = this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action));
  }

  ngOnDestroy() {
    if (this.submenusSubscription !== undefined) {
      this.submenusSubscription.unsubscribe();
    } else {
      LoggerService.log('ERROR : SubMenusSubscription (Admin Data App) should have been set', LogLevel.DEV);
    }
  }

  onFilesChange() {
    this.filesForForum = [];
    for (const file of this.files) {
      const filePath = file.path;
      if (filePath.startsWith('/forum/') && !Document.equals(this.filesSet, file)) {
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

  removeDocument(document: Document) {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    const params = {
      _id: document._id,
      extension: document.extension,
      path: document.path,
    };
    this.adminService.deleteFile(params, null).subscribe(() => {
      this.files.splice(this.files.indexOf(document), 1);
      this.onFilesChange();
      this.fetchAllSet();
      this.fetchCurrentSet();
      dialogProgress.close();
    });
  }

  editDocument(document: Document) {
    const dialogDocument = this.openDialogDocument(document);
    dialogDocument.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          const oldPath = document.path;
          const postParams = {
            oldPath,
            newPath: data.path,
            displayName: data.displayName,
            _id: document._id,
            extension: document.extension
          };
          this.adminService.updateFile(postParams, '').subscribe(() => {
            document.path = data.path;
            document.displayName = data.displayName;
            this.fetchCurrentSet();
            dialogProgress.close();
          });
        }
      });
  }

  openDialogDocument(document: Document) {
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
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
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
    this.adminService.saveSet(postParams).subscribe(() => {
      dialogProgress.close();
    });
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
    this.adminService.getFiles().subscribe((filesList: Document[]) => {
      if (filesList !== undefined) {
        filesList.forEach(file => {
          file._id = this.toHexString(file);
        });
        this.files = filesList;
      }
      // notify that file list is changed
      this.onFilesChange();
    });
  }

  fetchCurrentSet() {
    this.filesSet = [];
    this.adminService.getSetFiles(this.currentSet.name).subscribe((set: DocumentSet) => {
      if (set !== undefined) {
        this.currentSet = set;
        set.mobileDocs.forEach(mobileDoc => {
          this.fetchFile(mobileDoc.name);
        });
      }
    });
  }

  fetchFile(fileName: string) {
    this.adminService.getFile(fileName).subscribe((file: Document) => {
      if (file !== undefined) {
        file._id = this.toHexString(file);
        this.filesSet.push(file);
        this.onFilesChange();
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

  toHexString(file: Document) {
    const char: string[] = [];
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


  doAction(action: string) {
    if (action !== '') {
      const actionSplit = action.split('//');
      this.subMenusService.notifyMenuAction('');
      if (actionSplit[0] === this.router.url) {
        if (actionSplit[1].match('^redirect/.*')) {
          const redirect = actionSplit[1].substring(9);
          if (('/' + redirect) !== this.router.url + '/') {
            this.redirectAfterAction(redirect);
          }
        }
      }
    }
  }

  redirectAfterAction(redirect: string) {
    this.router.navigate([redirect]);
  }

  createMenu() {
    const subMenu: SubMenu[] = [];
    subMenu.push(this.subMenusService.createMenu('Documents', [], 'storage', 'redirect/admin/document', []));
    subMenu.push(this.subMenusService.createMenu('Données Applicatives', [], 'dashboard', 'redirect/admin/dataApp', []));
    this.subMenusService.notifySubMenu(subMenu);
  }

  selectFile($event) {
    this.selectedFiles = $event.target.files;
  }


  upload() {
    this.progress = 0;
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const currentFileUpload = this.selectedFiles.item(i);
      this.adminService.uploadFile(currentFileUpload, '/forum/').subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          const fileData = JSON.parse(event.body);
          const newFile: Document = new Document(fileData._id,
            fileData.path,
            fileData.extension,
            fileData.dateOfCreation,
            fileData.displayName);
          newFile._id = this.toHexString(newFile);
          this.files.push(newFile);
        }
      });
    }
    this.onFilesChange();
    this.clearControl.setValue('');
    this.selectedFiles = null;
    dialogProgress.close();
  }

  isNotSelectedFiles() {
    return this.selectedFiles === undefined || this.selectedFiles === null;
  }

  sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir: string, switchcount = 0;
    table = document.getElementById('documentsTable');
    switching = true;
    // Set the sorting direction to ascending:
    dir = 'asc';
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName('TD')[n];
        y = rows[i + 1].getElementsByTagName('TD')[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir === 'asc') {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir === 'desc') {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount === 0 && dir === 'asc') {
          dir = 'desc';
          switching = true;
        }
      }
    }
  }

}
