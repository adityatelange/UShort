import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ShortenService } from '../shorten.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-long-get',
    template: '<mat-spinner *ngIf="isLoadingSpinner" style="margin: auto;height: 100%;"></mat-spinner>',
})
export class LongGetComponent implements OnInit {
    private shorturl: string
    isLoadingSpinner = false

    constructor(public shortenService: ShortenService, public route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.isLoadingSpinner = true
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('shorturl')) {
                this.shorturl = paramMap.get('shorturl')

                this.shortenService.getLongUrl(this.shorturl).subscribe(
                    (urlRec: any) => {
                        if (urlRec.longUrl) {
                            // redirect user to LongUrl
                            window.location.href = urlRec.longUrl
                        } else {
                            this.snackBar.open(urlRec.message, 'close', {
                                duration: 3000,
                            });
                            this.router.navigate(['/'])
                        }
                    },
                    error => {
                        this.snackBar.open(error.error.message, 'close', {
                            duration: 3000,
                        });
                        this.router.navigate(['/'])
                    })
            }
        })
    }
}