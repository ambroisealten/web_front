import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-document-menu-forum',
  templateUrl: './admin-document-menu-forum.component.html',
  styleUrls: ['./admin-document-menu-forum.component.scss']
})
export class AdminDocumentMenuForumComponent implements OnInit {
  allDocs = [
    {"uri":"File1",isForForum:false},
    {"uri":"File2",isForForum:true},
    {"uri":"File3",isForForum:true},
    {"uri":"File5",isForForum:true}
  ];

  docsForum = [
    {"uri":"File 4",isForForum:true},
    {"uri":"File 6",isForForum:true}
  ];

  constructor() { }

  ngOnInit() {
  }

}
