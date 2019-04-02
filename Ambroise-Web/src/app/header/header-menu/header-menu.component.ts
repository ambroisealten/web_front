import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

  currentModule = "Missions";
  modules = {
    "modules" : [
        {
            "label" : "Missions",
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
            "label" : "Compétences",
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
            "label" : "Forum",
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
