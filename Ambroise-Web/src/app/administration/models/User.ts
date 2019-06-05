export class User {

    constructor(public name: string, public forName: string, public mail: string, public role: string) { }

    getName() {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    getForName() {
        return this.forName;
    }

    setForName(forName: string) {
        this.forName = forName;
    }

    getMail() {
        return this.mail;
    }

    setMail(mail: string) {
        this.mail = mail;
    }

    getRole() {
        return this.role;
    }

    setRole(role: string) {
        this.role = role;
    }
}