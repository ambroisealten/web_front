import { Component, OnInit } from '@angular/core';
import { File } from '../../models/File';
import { AdminService } from '../../services/admin.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoggerService, LogLevel } from '../../../services/logger.service';

@Component({
  selector: 'app-admin-document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.scss']
})
export class AdminDocumentComponent implements OnInit {

  files = [new File("id54dfs54dgfs54dg5sg",'/forum/2019/test/', 'png', '1555511830668',"Logo ALTEN"), new File("id546dgs546gs7546fqe8",'/global/2019/','pdf', '1555511830716', "Cahier de test"), new File("iddvs546375g",'/forum/2015/test/','docx', '1555511874438', "Login Documentation")];
  filesForForum = [];
  filesForum = [new File("id4d4hf754874",'/forum/2019/global/','pdf','1555511830668',"Presentation ALTEN"), new File("id5468546gfh4dh",'/forum/2018/epitech/','png','1555511830667',"Bienvenue à ALTEN")]

  constructor(private adminService: AdminService) { 
    for(let file of this.files){
      if(file.getPath().startsWith('/forum/')){
        this.filesForForum.push(file);
      }
    }
    LoggerService.log(this.filesForForum,LogLevel.DEBUG);
  }

  ngOnInit() {
    
  }

  getDocuments() {
    return this.files;
  }

  removeDocument(event){
    let message = event.target.parentNode.textContent.replace("x","");
    LoggerService.log("We want to supress this doc : "+message,LogLevel.DEBUG);
  }

  editCollection(event){
    let message = event.target.parentNode.textContent.replace("edit","");
    LoggerService.log("We want to edit the current collection : "+message,LogLevel.DEBUG);  
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
        childObject["id"] = child.childNodes[1].textContent;
        childObject["order"] = order;
        finalList.push(childObject);
      }
    }
    if(finalList.length == 0){
      let test = confirm("Êtes-vous sûr de ne mettre aucun documents ?");
      if(test){
        // Update request
      }
      else{
        // Nothing (?)
      }
    }
    LoggerService.log(finalList,LogLevel.DEBUG);
  }
}
