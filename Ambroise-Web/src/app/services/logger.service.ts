import { Injectable } from "@angular/core";


@Injectable()
export class LoggerService {

    public static globalLogLevel: LogLevel;

    public static log(o: Object, logType: LogLevel) {

        if (LoggerService.getValue(logType) <= LoggerService.getValue(LoggerService.globalLogLevel)) {
            let tmp = this.getStackTrace()[1].split(' ');
            if (tmp[1].split('..')[1] === undefined) {
                console.log("\nFrom : "+ tmp[2]);
                console.log("\t-> " + o);
            }

            else {
                console.log("\nFrom : "+ tmp[1].split('..')[1]);
                console.log("\t-> "  + o);

            }

        }

    }

    private static getStackTrace() {

        var stack;

        try {
            throw new Error('');
        }
        catch (error) {
            stack = error.stack || '';
        }

        stack = stack.split('\n').map(function (line) { return line.trim(); });
        return stack.splice(stack[0] == 'Error' ? 2 : 1);
    }

    public static parseLogType(logLevelString: String) {

        const type = LogLevel[logLevelString.toString()];
        if (type === undefined) {
            throw new Error("La variable d'environement " + type + " n'existe pas");
        }

        LoggerService.globalLogLevel = type;
    }

    private static getValue(logLevel: LogLevel): number {
        switch (logLevel) {
            case LogLevel.JOKE: return 5;
            case LogLevel.DEVDEBUG: return 4;
            case LogLevel.DEBUG: return 3;
            case LogLevel.DEV: return 2;
            case LogLevel.PROD: return 1;
            default: throw new Error('unexistant LogLevel : ' + logLevel);
        }
    }

    //TO-DO : Ecriture d'un fichier log en mode DEV et/ou debug

}

export enum LogLevel {
    JOKE = 'JOKE',
    DEVDEBUG = 'DEVDEBUG',
    DEBUG = 'DEBUG',
    DEV = 'DEV',
    PROD = 'PROD'
}
