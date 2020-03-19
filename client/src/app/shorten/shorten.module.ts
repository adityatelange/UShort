import { NgModule } from '@angular/core';
import { ShortCreateComponent } from '../shorten/short-create/short-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LongGetComponent } from './long-get/long-get.component';

@NgModule({
    declarations: [
        ShortCreateComponent,
        LongGetComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class ShortenModule { }