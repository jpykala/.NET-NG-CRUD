import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RequestTimeoutHttpInterceptor, DEFAULT_TIMEOUT } from './interceptors/timeout.interceptor';


import { CalendarModule } from 'primeng/calendar';
import {AccordionModule} from 'primeng/accordion';    
import {ButtonModule} from 'primeng/button'; 
import {MenuItem} from 'primeng/api'; 
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {ChartModule} from 'primeng/chart';
import {TabViewModule} from 'primeng/tabview';
import {MultiSelectModule} from 'primeng/multiselect';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ]),
    BrowserAnimationsModule,
    CalendarModule,
    ButtonModule,
    AccordionModule,
    RadioButtonModule,
    InputNumberModule,
    DropdownModule,
    OverlayPanelModule,
    ToastModule,
    TableModule,
    TooltipModule,
    ChartModule,
    TabViewModule,
    MultiSelectModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestTimeoutHttpInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 5000 },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
