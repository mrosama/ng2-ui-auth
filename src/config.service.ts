import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';

/**
 * Created by Ron on 17/12/2015.
 */

export interface IPopupOptions {
    width?: number;
    height?: number;
    left?: number;
    top?: number;
}

export interface IOauth1Options {
    url?: string;
    name?: string;
    popupOptions?: IPopupOptions;
    redirectUri?: string;
    authorizationEndpoint?: string;
    oauthType?: string;
    exchangeForToken?: boolean | ((options: {code?: string, state?: string}, userData?: any) => Observable<Response>);
}

export interface IOauth2Options extends IOauth1Options {
    state?: string| (() => string);
    defaultUrlParams?: string[];
    responseType?: string;
    responseParams?: {
        code?: string;
        clientId?: string;
        redirectUri?: string;
    };
    clientId?: string;
    scopeDelimiter?: string;
    scopePrefix?: string;

    requiredUrlParams?: string[];
    optionalUrlParams?: string[];
    scope?: string[];
    display?: string;
}

export interface IProviders {
    [provider: string]: IOauth2Options;
}

export abstract class CustomConfig {
    tokenRoot: string;
    cordova: boolean;
    baseUrl: string;
    loginUrl: string;
    signupUrl: string;
    unlinkUrl: string;
    tokenName: string;
    tokenSeparator: string;
    tokenPrefix: string;
    authToken: string;
    authHeader: string;
    storageType: string;
    providers: IProviders;
    defaultHeaders: { [name: string]: string };
    withCredentials: boolean;
    autoRefreshToken: boolean;
    refreshUrl: string;
}

@Injectable()
export class ConfigService {
    constructor(config?: CustomConfig) {
        Object.keys(config).forEach((key) => {
            if (typeof config[key] === "undefined") {
                return;
            }
            if (key !== 'providers') {
                this[key] = config[key];
            } else {
                Object.keys(config[key]).forEach((provider) => {
                    if (typeof this.providers[provider] === 'undefined') {
                        this.providers[provider] = config.providers[provider];
                    } else {
                        Object.keys(config.providers[provider]).forEach((prop) => {
                            this.providers[provider][prop] = config.providers[provider][prop];
                        });
                    }
                });
            }
        });
    }
    withCredentials = false;
    tokenRoot = null;
    cordova = false;
    baseUrl = '/';
    loginUrl = '/auth/login';
    signupUrl = '/auth/signup';
    unlinkUrl = '/auth/unlink/';
    refreshUrl = '/auth/refresh';
    tokenName = 'token';
    tokenSeparator = '_';
    tokenPrefix = 'ng2-ui-auth';
    authHeader = 'Authorization';
    authToken = 'Bearer';
    storageType = 'localStorage';
    defaultHeaders = null;
    autoRefreshToken = false;
    providers: IProviders = {
        facebook: {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
            redirectUri: window.location.origin + '/',
            requiredUrlParams: ['display', 'scope'],
            scope: ['email'],
            scopeDelimiter: ',',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: {width: 580, height: 400}
        },
        google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin,
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: {width: 452, height: 633},
            state: () => encodeURIComponent(Math.random().toString(36).substr(2)),
        },
        github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin,
            optionalUrlParams: ['scope'],
            scope: ['user:email'],
            scopeDelimiter: ' ',
            oauthType: '2.0',
            popupOptions: {width: 1020, height: 618}
        },
        instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimiter: '+',
            oauthType: '2.0'
        },
        linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            oauthType: '2.0',
            popupOptions: {width: 527, height: 582}
        },
        twitter: {
            name: 'twitter',
            url: '/auth/twitter',
            authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
            redirectUri: window.location.origin,
            oauthType: '1.0',
            popupOptions: {width: 495, height: 645}
        },
        twitch: {
            name: 'twitch',
            url: '/auth/twitch',
            authorizationEndpoint: 'https://api.twitch.tv/kraken/oauth2/authorize',
            redirectUri: window.location.origin,
            requiredUrlParams: ['scope'],
            scope: ['user_read'],
            scopeDelimiter: ' ',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: {width: 500, height: 560}
        },
        live: {
            name: 'live',
            url: '/auth/live',
            authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
            redirectUri: window.location.origin,
            requiredUrlParams: ['display', 'scope'],
            scope: ['wl.emails'],
            scopeDelimiter: ' ',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: {width: 500, height: 560}
        },
        yahoo: {
            name: 'yahoo',
            url: '/auth/yahoo',
            authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: window.location.origin,
            scope: [],
            scopeDelimiter: ',',
            oauthType: '2.0',
            popupOptions: {width: 559, height: 519}
        },
        bitbucket: {
            name: 'bitbucket',
            url: '/auth/bitbucket',
            authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize',
            redirectUri: window.location.origin + '/',
            requiredUrlParams: ['scope'],
            scope: ['email'],
            scopeDelimiter: ',',
            oauthType: '2.0',
            popupOptions: {width: 1028, height: 529}
        },
        spotify: {
            name: 'spotify',
            url: '/auth/spotify',
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
            redirectUri: window.location.origin,
            optionalUrlParams: ['state'],
            requiredUrlParams: ['scope'],
            scope: ['user-read-email'],
            scopePrefix: '',
            scopeDelimiter: ',',
            oauthType: '2.0',
            popupOptions: { width: 500, height: 530 },
            state: () => encodeURIComponent(Math.random().toString(36).substr(2))
        }
    };
}
