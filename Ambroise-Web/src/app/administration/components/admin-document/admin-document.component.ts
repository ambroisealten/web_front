import { Component, OnInit } from '@angular/core';
import { File } from 'src/app/administration/models/File';
import { AdminService } from '../../services/admin.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Component({
  selector: 'app-admin-document',
  templateUrl: './admin-document.component.html',
  styleUrls: ['./admin-document.component.scss']
})
export class AdminDocumentComponent implements OnInit {

  files = [new File('http://localhost:8080/file/alten.png', '1555511830669', false), new File('http://localhost:8080/file/DOMINO_CahierDeTests_v1.2.pdf', '1555511830716', true), new File('http://localhost:8080/file/DocLoginWebService.docx', '1555511874438', true)];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  getDocuments() {
    return this.files;
  }

  visualize(uri: string) {


  }
}
