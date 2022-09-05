/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CityInfo } from '../models/city-info';
import { StateInfo } from '../models/state-info';

@Injectable({
  providedIn: 'root',
})
export class InfoService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation statesInfoStatesGet
   */
  static readonly StatesInfoStatesGetPath = '/info/states';

  /**
   * States.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statesInfoStatesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  statesInfoStatesGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<StateInfo>>> {

    const rb = new RequestBuilder(this.rootUrl, InfoService.StatesInfoStatesGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<StateInfo>>;
      })
    );
  }

  /**
   * States.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `statesInfoStatesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  statesInfoStatesGet(params?: {
  }): Observable<Array<StateInfo>> {

    return this.statesInfoStatesGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<StateInfo>>) => r.body as Array<StateInfo>)
    );
  }

  /**
   * Path part for operation citiesInfoCitiesGet
   */
  static readonly CitiesInfoCitiesGetPath = '/info/cities';

  /**
   * Cities.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `citiesInfoCitiesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  citiesInfoCitiesGet$Response(params?: {
    city_name?: string;
    state_name?: string;
    postal_code?: number;
    latitude?: number;
    longitude?: number;
  }): Observable<StrictHttpResponse<Array<CityInfo>>> {

    const rb = new RequestBuilder(this.rootUrl, InfoService.CitiesInfoCitiesGetPath, 'get');
    if (params) {
      rb.query('city_name', params.city_name, {});
      rb.query('state_name', params.state_name, {});
      rb.query('postal_code', params.postal_code, {});
      rb.query('latitude', params.latitude, {});
      rb.query('longitude', params.longitude, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CityInfo>>;
      })
    );
  }

  /**
   * Cities.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `citiesInfoCitiesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  citiesInfoCitiesGet(params?: {
    city_name?: string;
    state_name?: string;
    postal_code?: number;
    latitude?: number;
    longitude?: number;
  }): Observable<Array<CityInfo>> {

    return this.citiesInfoCitiesGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CityInfo>>) => r.body as Array<CityInfo>)
    );
  }

}
