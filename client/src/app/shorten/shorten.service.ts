import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Router } from '@angular/router';

import { environment } from "src/environments/environment"

const BACKEND_URL = environment.apiUrl + "shorten/"

@Injectable({ providedIn: 'root' })
export class ShortenService {
    constructor(private http: HttpClient,) { }

    addUrl(url: string) {
        let postData = { url: url }
        return this.http.post<{ message: string, shortUrl: string }>(BACKEND_URL, postData)
    }

    getLongUrl(id: string) {
        return this.http.get<{ message: string, longUrl: string }>(BACKEND_URL + id)
    }
}