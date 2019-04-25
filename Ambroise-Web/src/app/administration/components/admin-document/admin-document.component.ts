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

  files = [new File("id54dfs54dgfs54dg5sg",'/forum/2019/global/', 'png', '1555511830668',"Logo ALTEN"), new File("id546dgs546gs7546fqe8",'/global/2019/','pdf', '1555511830716', "Cahier de test"), new File("iddvs546375g",'/forum/2015/global/','docx', '1555511874438', "Login Documentation"),new File("id4d4hf754874",'/forum/2019/global/','pdf','1555511830668',"Presentation ALTEN"), new File("id5468546gfh4dh",'/forum/2019/global/','png','1555511830667',"Bienvenue à ALTEN")];
  filesForForum = [];
  filesForum = [new File("id4d4hf754874",'/forum/2019/global/','pdf','1555511830668',"Presentation ALTEN"), new File("id5468546gfh4dh",'/forum/2019/global/','png','1555511830667',"Bienvenue à ALTEN")]
  allFilesIdForum = ["id4d4hf754874","id5468546gfh4dh"];
  allSets = {"/2019/global/" :  this.filesForum};
  currentSet = "";

  constructor(private adminService: AdminService) { 
    let currentYear = new Date().getFullYear().toString();
    this.currentSet = '/'+currentYear+'/global/';
    for(let file of this.files){
      let filePath = file.getPath();
      if(filePath.startsWith('/forum/') && !this.allFilesIdForum.includes(file.get_id())){
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

  removeDocument(event : MouseEvent){
    let target = event.target;
    while(target.tagName != "BUTTON"){
      target = target.parentNode;
    }
    let idDoc = target.parentNode.parentNode.id;
    LoggerService.log("We want to supress this doc : "+idDoc,LogLevel.DEBUG);
  }

  editDocument(event : MouseEvent){
    let target = event.target;
    while(target.tagName != "BUTTON"){
      target = target.parentNode;
    }
    let idDoc = target.parentNode.parentNode.id;
    LoggerService.log("We want to edit the current doc : "+idDoc,LogLevel.DEBUG);  
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