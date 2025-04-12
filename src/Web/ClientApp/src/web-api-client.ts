//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v14.1.0.0 (NJsonSchema v11.0.2.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

import followIfLoginRedirect from './components/api-authorization/followIfLoginRedirect';

export class MovieClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        this.http = http ? http : window as any;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    getMovies(page: number): Promise<PaginatedListOfSummarizedMovie> {
        let url_ = this.baseUrl + "/api/Movie/{page}";
        if (page === undefined || page === null)
            throw new Error("The parameter 'page' must be defined.");
        url_ = url_.replace("{page}", encodeURIComponent("" + page));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetMovies(_response);
        });
    }

    protected processGetMovies(response: Response): Promise<PaginatedListOfSummarizedMovie> {
        followIfLoginRedirect(response);
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PaginatedListOfSummarizedMovie.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PaginatedListOfSummarizedMovie>(null as any);
    }
}

export class WeatherForecastsClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        this.http = http ? http : window as any;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    getWeatherForecasts(): Promise<WeatherForecast[]> {
        let url_ = this.baseUrl + "/api/WeatherForecasts";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetWeatherForecasts(_response);
        });
    }

    protected processGetWeatherForecasts(response: Response): Promise<WeatherForecast[]> {
        followIfLoginRedirect(response);
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(WeatherForecast.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<WeatherForecast[]>(null as any);
    }
}

export class PaginatedListOfSummarizedMovie implements IPaginatedListOfSummarizedMovie {
    items?: SummarizedMovie[];
    pageNumber?: number;
    totalPages?: number;
    totalCount?: number;

    constructor(data?: IPaginatedListOfSummarizedMovie) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            if (Array.isArray(_data["items"])) {
                this.items = [] as any;
                for (let item of _data["items"])
                    this.items!.push(SummarizedMovie.fromJS(item));
            }
            this.pageNumber = _data["pageNumber"];
            this.totalPages = _data["totalPages"];
            this.totalCount = _data["totalCount"];
        }
    }

    static fromJS(data: any): PaginatedListOfSummarizedMovie {
        data = typeof data === 'object' ? data : {};
        let result = new PaginatedListOfSummarizedMovie();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        data["pageNumber"] = this.pageNumber;
        data["totalPages"] = this.totalPages;
        data["totalCount"] = this.totalCount;
        return data;
    }
}

export interface IPaginatedListOfSummarizedMovie {
    items?: SummarizedMovie[];
    pageNumber?: number;
    totalPages?: number;
    totalCount?: number;
}

export class SummarizedMovie implements ISummarizedMovie {
    adult?: boolean;
    backdrop_path?: string | undefined;
    genre_ids?: number[] | undefined;
    id?: number;
    original_language?: string | undefined;
    original_title?: string | undefined;
    overview?: string | undefined;
    popularity?: number;
    poster_path?: string | undefined;
    release_date?: string | undefined;
    title?: string | undefined;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;

    constructor(data?: ISummarizedMovie) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.adult = _data["adult"];
            this.backdrop_path = _data["backdrop_path"];
            if (Array.isArray(_data["genre_ids"])) {
                this.genre_ids = [] as any;
                for (let item of _data["genre_ids"])
                    this.genre_ids!.push(item);
            }
            this.id = _data["id"];
            this.original_language = _data["original_language"];
            this.original_title = _data["original_title"];
            this.overview = _data["overview"];
            this.popularity = _data["popularity"];
            this.poster_path = _data["poster_path"];
            this.release_date = _data["release_date"];
            this.title = _data["title"];
            this.video = _data["video"];
            this.vote_average = _data["vote_average"];
            this.vote_count = _data["vote_count"];
        }
    }

    static fromJS(data: any): SummarizedMovie {
        data = typeof data === 'object' ? data : {};
        let result = new SummarizedMovie();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["adult"] = this.adult;
        data["backdrop_path"] = this.backdrop_path;
        if (Array.isArray(this.genre_ids)) {
            data["genre_ids"] = [];
            for (let item of this.genre_ids)
                data["genre_ids"].push(item);
        }
        data["id"] = this.id;
        data["original_language"] = this.original_language;
        data["original_title"] = this.original_title;
        data["overview"] = this.overview;
        data["popularity"] = this.popularity;
        data["poster_path"] = this.poster_path;
        data["release_date"] = this.release_date;
        data["title"] = this.title;
        data["video"] = this.video;
        data["vote_average"] = this.vote_average;
        data["vote_count"] = this.vote_count;
        return data;
    }
}

export interface ISummarizedMovie {
    adult?: boolean;
    backdrop_path?: string | undefined;
    genre_ids?: number[] | undefined;
    id?: number;
    original_language?: string | undefined;
    original_title?: string | undefined;
    overview?: string | undefined;
    popularity?: number;
    poster_path?: string | undefined;
    release_date?: string | undefined;
    title?: string | undefined;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
}

export class WeatherForecast implements IWeatherForecast {
    date?: Date;
    temperatureC?: number;
    temperatureF?: number;
    summary?: string | undefined;

    constructor(data?: IWeatherForecast) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.date = _data["date"] ? new Date(_data["date"].toString()) : <any>undefined;
            this.temperatureC = _data["temperatureC"];
            this.temperatureF = _data["temperatureF"];
            this.summary = _data["summary"];
        }
    }

    static fromJS(data: any): WeatherForecast {
        data = typeof data === 'object' ? data : {};
        let result = new WeatherForecast();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["date"] = this.date ? this.date.toISOString() : <any>undefined;
        data["temperatureC"] = this.temperatureC;
        data["temperatureF"] = this.temperatureF;
        data["summary"] = this.summary;
        return data;
    }
}

export interface IWeatherForecast {
    date?: Date;
    temperatureC?: number;
    temperatureF?: number;
    summary?: string | undefined;
}

export class SwaggerException extends Error {
    override message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new SwaggerException(message, status, response, headers, null);
}