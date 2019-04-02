import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderNavigation{

    private currentModule : String;
    private modules = {
        "modules" : [
            {
                "label" : "Missions",
                "roles" : ["admin", "cdr", "manager"],
                "routerLink" : "mission",
                "menus" : [
                    {
                        "label" : "Menu Mission 1",
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
                        "label" : "Menu Mission 2",
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
                        "label" : "Menu Mission 3",
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
                "roles" : ["admin", "manager"],
                "routerLink" : "competences",
                "menus" : [
                    {
                        "label" : "Menu Compétences 1",
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
                        "label" : "Menu Compétences 2",
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
                        "label" : "Menu Compétences 3",
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
                "roles" : ["admin", "cdr", "manager"],
                "routerLink" : "forum",
                "menus" : [
                    {
                        "label" : "Menu Forum 1",
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
                        "label" : "Menu Forum 2",
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
                        "label" : "Menu Forum 3",
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

    constructor(){
        this.currentModule = "Missions";
    }

    setCurrentModule(currentModule: String ){
        this.currentModule = currentModule;
    }

    getCurrentModule(){
        //console.log("A que coucou");
        return this.currentModule;
    }

   /* setModules(modules){
        this.modules = modules;
    }*/

    getModules(){
        return this.modules;
    }

}