import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class HeaderService {

    private currentModule: String;
    test: any;
   /* private modules = {
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
    };*/

    constructor(private httpClient: HttpClient) {
        this.currentModule = "Missions";
    }

    setCurrentModuleFromService(currentModule: String) {
        this.currentModule = currentModule;
    }

    getCurrentModuleFromService() {
        return this.currentModule;
    }

    getModulesFromService(callback) {
        let token = window.sessionStorage.getItem("bearerToken");

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });

        let options = { headers: headers };

        this.httpClient
            .get('http://localhost:8080/configMenu' /*, options*/) //En attente du WebService Login pour la récuperation du token
            .subscribe(data => {
                callback(JSON.stringify(data));
            }, error => {
                console.log(error);// Error getting the data
            });
    }

}