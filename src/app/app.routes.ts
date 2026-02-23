import { Routes } from '@angular/router';
import { DatasetGuide } from './dataset-guide/dataset-guide';
import { App } from './app';
import { HomeComponent } from './home/home';

export const routes: Routes = [
       { path: '', component: HomeComponent },
     { path: 'dataset-guide', component: DatasetGuide },
     { path: '**', redirectTo: '' }
];
