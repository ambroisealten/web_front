import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderNavigation{

    private currentModul : String;
    private modules = {
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

    constructor(){
        this.currentModul = "Missions";
    }

    setCurrrentModul(currentModul: String ){
        this.currentModul = currentModul;
    }

    getCurrentModul(){
        return this.currentModul;
    }

    setModules(modules){
        this.modules = modules;
    }

    getModules(){
        return this.modules;
    }

}