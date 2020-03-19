import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShortenService } from '../shorten.service';
import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material";


@Component({
    selector: 'app-short-create',
    templateUrl: './short-create.component.html',
    styleUrls: ['./short-create.component.css']
})
export class ShortCreateComponent implements OnInit {
    isLoadingSpinner = false

    form: FormGroup
    urlregexp = /^(?:http|ftp)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[\/?]\S+)$/gi;
    longUrl: string
    shortUrl: string;

    constructor(public shortenService: ShortenService, public snackBar: MatSnackBar) { }

    ngOnInit() {
        var serverUrl = new URL(window.location.href).origin
        let url_me_regexp = '^((?!' + serverUrl + ').)*$'

        this.form = new FormGroup({
            url: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.maxLength(256),
                    Validators.pattern(this.urlregexp),
                    Validators.pattern(url_me_regexp) // check wheather URL is of self
                ]
            }),
        })
    }

    onSendUrl() {
        if (this.form.invalid) {
            return;
        }

        this.isLoadingSpinner = true

        this.shortenService.addUrl(this.form.value.url).subscribe(
            (urlRec: any) => {
                if (urlRec) {
                    this.longUrl = this.form.value.url
                    var serverUrl = new URL(window.location.href).origin
                    this.shortUrl = serverUrl + '/' + urlRec.shortUrl
                    this.isLoadingSpinner = false
                    this.form.reset();
                }
            },
            error => {
                this.isLoadingSpinner = false
                this.snackBar.open('Error : / ', 'close', {
                    duration: 3000,
                });
            });
    }
}