/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl: string = environment.api_url;
}

/**
 * Parameters for `ApiModule.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
