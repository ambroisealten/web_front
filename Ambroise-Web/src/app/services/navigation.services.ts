import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class HeaderNavigation {

    private currentModule: String;
    test: any;
    private modules = {
        "modules": [
            {
                "label": "Missions",
                "roles": ["admin", "cdr", "manager"],
                "routerLink": "mission",
                "menus": [
                    {
                        "label": "Menu Mission 1",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    },
                    {
                        "label": "Menu Mission 2",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    },
                    {
                        "label": "Menu Mission 3",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    }
                ]
            },
            {
                "label": "Compétences",
                "roles": ["admin", "manager"],
                "routerLink": "competences",
                "menus": [
                    {
                        "label": "Menu Compétences 1",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    },
                    {
                        "label": "Menu Compétences 2",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    },
                    {
                        "label": "Menu Compétences 3",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    }
                ]
            },
            {
                "label": "Forum",
                "roles": ["admin", "cdr", "manager"],
                "routerLink": "forum",
                "menus": [
                    {
                        "label": "Menu Forum 1",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    },
                    {
                        "label": "Menu Forum 2",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    },
                    {
                        "label": "Menu Forum 3",
                        "submenus": [
                            {
                                "label": "submenu1"
                            },
                            {
                                "label": "submenu2"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    constructor(private httpClient: HttpClient) {
        this.currentModule = "Missions";
    }

    setCurrentModule(currentModule: String) {
        this.currentModule = currentModule;
    }

    getCurrentModule() {
        return this.currentModule;
    }

    getModules() {
        let token = window.sessionStorage.getItem("bearerToken");

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : ''
        });

        let options = { headers: headers };

        this.httpClient
            .get('http://localhost:8080/configMenu')
            .subscribe(data => {
                console.log(JSON.stringify(data));
                this.test = data;
            }, error => {
                console.log(error);// Error getting the data
            });
        setTimeout(() => {
            console.log("coucou" + this.test);
            this.modules = this.test;
            return this.modules;
        }, 50);
    }

}