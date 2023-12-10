import {Server} from "http";
import SocketIO from "socket.io";

import * as customError from "../config/errorCodes"

class Web_Console {

    private io?: SocketIO.Server = undefined;

    private webSocketPath: string =  "/logging";
    private httpServer: Server;
    private validationFunction: (socket: SocketIO.Socket, next: Function) => void;

    constructor(httpServer: Server, pathToWebSocket?: string, validationFunction?: (socket: SocketIO.Socket, next: Function) => void) {
        this.httpServer = httpServer;
        this.validationFunction = (socket: SocketIO.Socket, next: Function) => {return next();}

        if(pathToWebSocket)
            this.webSocketPath = pathToWebSocket;

        if(validationFunction)
            this.validationFunction = validationFunction;
    }

    public start() {
        if(this.io) {
            this.io.close;
        }

        this.io = new SocketIO.Server(this.httpServer, {
            path: this.webSocketPath,
            cors: this.handlePreflightRequest
        });

        this.init();

        this.overwriteOutput(this.io);
        console.log("Web Console started...");
    }

    private init(): boolean {
        if(!this.io) return false;

        this.io.use(this.validationFunction);

        this.io.on("connection", (socket: SocketIO.Socket) => {
            socket.emit("log",{msg: "Connected to Web Console! ♥"})

            socket.on("cmd", (data) => {
                this.executeCommand(socket, data);
            });
        });

        return true;
    }

    private handlePreflightRequest(request: any, response: any) {
        const headers = {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, user-token",
            "Access-Control-Allow-Origin": request.headers.origin,
            "Access-Control-Allow-Credentials": true
        };
        response.writeHead(200, headers);
        response.end();
    }

    private overwriteOutput(io: SocketIO.Server) {

        const originalStdoutWrite = process.stdout.write.bind(process.stdout);
        const originalStderrWrite = process.stderr.write.bind(process.stderr);

        process.stdout.write = function(chunk: any, encoding?: any , next?: any ): boolean {

            if (typeof chunk === 'string') {
                io.emit("log",{msg: chunk});
            }

            return originalStdoutWrite(chunk, encoding, next);
        };

        process.stderr.write = function(chunk: any, encoding?: any , next?: any ): boolean {

            if (typeof chunk === 'string') {
                io.emit("err",{msg: chunk});
            }

            return originalStderrWrite(chunk, encoding, next);
        };
    }

    private executeCommand(socket: SocketIO.Socket, command: string) {
        if(!this.io) return false;

        console.log("[web_console] [execute] Socket<" + socket.id + "> executed command '" + command + "'.")

        switch(command) {
            case 'exit':
                console.log("[web_console] [info] Terminating socket connection <" + socket.id + ">...");
                socket.disconnect(true);
            break;
            case 'list_all':
                console.log("[web_console] [info] Listing all socket connection...");
                console.log(this.io.fetchSockets());
            break;
            case 'toggle_creation':

            break;
            case 'delete_all':

            break;
        }
    }
}

export default Web_Console;

export const validateUserAccess = async (socket: SocketIO.Socket, next: Function) => {
    //Get the jwt token from headers
    const token: string = <string>socket.handshake.headers['user-token'];

    if(!token) {
        console.error("[web_console] [JWT_Validation] Parameter user-token missing in the handshake!")
        return next(new Error(customError.tokenRequired));
    }

    if(token != process.env.WEB_CONSOLE_PASSWORD) {
        return next(new Error(customError.accessForbidden));
    } else {
        console.log("[web_console] [JWT_Validation] Socket<" + socket.id + "> has established a new connection!")
        next();
    }
};
