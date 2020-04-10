import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShortenService } from '../shorten.service';
import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material";
import { ClipboardService } from 'ngx-clipboard'


@Component({
    selector: 'app-short-create',
    templateUrl: './short-create.component.html',
    styleUrls: ['./short-create.component.css']
})
export class ShortCreateComponent implements OnInit {
    isLoadingSpinner = false

    form: FormGroup
    // credits https://gist.github.com/dperini/729294
    urlregexp = new RegExp(
        "^" +
          // protocol identifier (optional)
          // short syntax // still required
          "(?:(?:(?:https?|ftp):)?\\/\\/)" +
          // user:pass BasicAuth (optional)
          "(?:\\S+(?::\\S*)?@)?" +
          "(?:" +
            // IP address exclusion
            // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broadcast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
          "|" +
            // host & domain names, may end with dot
            // can be replaced by a shortest alternative
            // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
            "(?:" +
              "(?:" +
                "[a-z0-9\\u00a1-\\uffff]" +
                "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
              ")?" +
              "[a-z0-9\\u00a1-\\uffff]\\." +
            ")+" +
            // TLD identifier name, may end with dot
            "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
          ")" +
          // port number (optional)
          "(?::\\d{2,5})?" +
          // resource path (optional)
          "(?:[/?#]\\S*)?" +
        "$", "i"
      );
    longUrl: string
    shortUrl: string;

    constructor(public shortenService: ShortenService, public snackBar: MatSnackBar, private _clipboardService: ClipboardService) { }

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
                    this.copyShortUrl(this.shortUrl)
                }
            },
            error => {
                this.isLoadingSpinner = false
                this.snackBar.open('Error : / ', 'close', {
                    duration: 3000,
                });
            });
    }

    copyShortUrl(text: string) {
        let check = this._clipboardService.copyFromContent(text)
        if (check) {
            this.snackBar.open('ShortURL copied to Clipboard !', 'close', {
                duration: 5000,
            });
        }
    }
}