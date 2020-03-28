declare namespace NodeJS {
    export interface ProcessEnv {
        MODE: string;
        HOST: string;
        PORT: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        TENANT: string;
        COOKIE_SESSION: string;
    }
}
