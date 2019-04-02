import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

  currentModule = "Module 1";
  modules = {
    "modules" : [
        {
            "label" : "Module 1",
            "menus" : [
                {
                    "label" : "Menu 1",
                    "submenus" : [
                        {
                            "label" : "submenu1"
                        },
                        {
                            "label" : "submenu2"
                        }
                    ]
                },
                {
                    "label" : "Menu 2",
                    "submenus" : [
                        {
                            "label" : "submenu1"
                        },
                        {
                            "label" : "submenu2"
                        }
                    ]
                },
                {
                    "label" : "Menu 3",
                    "submenus" : [
                        {
                            "label" : "submenu1"
                        },
                        {
                            "label" : "submenu2"
                        }
                    ]
                }
            ]
        },
        {
            "label" : "Module 2",
            "menus" : [
                {
                    "label" : "Menu 1",
                    "submenus" : [
                        {
                            "label" : "submenu1"
                        },
                        {
                            "label" : "submenu2"
                        }
                    ]
                },
                {
                    "label" : "Menu 2",
                    "submenus" : [
                        {
                            "label" : "submenu1"
                        },
                        {
                            "label" : "submenu2"
                        }
                    ]
                },
                {
                    "label" : "Menu 3",
                    "submenus" : [
                        {
                            "label" : "submenu1"
                        },
                        {
                            "label" : "submenu2"
                        }
                    ]
                }
            ]
        }
    ]
};

  constructor() { }

  ngOnInit() {
  }

}
