import { Component, OnInit } from '@angular/core';
import { File } from '../../models/File';
import { AdminService } from '../../services/admin.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { log } from 'util';
import { LoggerService, LogLevel } from '../../../services/logger.service';

@Component({
  selector: 'app-admin-document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.scss']
})
export class AdminDocumentComponent implements OnInit {

  files = [new File('http://localhost:8080/file/alten.png', '1555511830669', false), new File('http://localhost:8080/file/DOMINO_CahierDeTests_v1.2.pdf', '1555511830716', true), new File('http://localhost:8080/file/DocLoginWebService.docx', '1555511874438', true)];
  filesForForum = [new File('http://localhost:8080/file/DOMINO_CahierDeTests_v1.2.pdf', '1555511830716', true), new File('http://localhost:8080/file/DocLoginWebService.docx', '1555511874438', true)]
  filesForum = [new File('http://localhost:8080/file/test.pdf','1555511830668',true), new File('http://localhost:8080/file/test.png','1555511830667',true)]

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  getDocuments() {
    return this.files;
  }

  visualize(uri: string) {


  }

  drop(event : CdkDragDrop<string[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex,event.currentIndex);
    }
    else{
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  submitListForum(){
    let finalList = [];
    let dropList = document.getElementsByClassName("cdk-drop-list")[1];
    let order = 0;
    for(let i = 0; i <dropList.childNodes.length; i++){
      let child = dropList.childNodes[i];
      if(child.nodeName === "DIV"){
        order++;
        let childObject = {};
        childObject["uri"] = child.textContent;
        childObject["order"] = order;
        finalList.push(childObject);
      }
    }
    if(finalList.length == 0){
      let test = confirm("Êtes-vous sûr de ne mettre aucun documents ?");
      if(test){
        // Do Update request
      }
      else{
        // Do nothing
      }
    }
    LoggerService.log(finalList,LogLevel.JOKE);
  }
}
