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

import { Source } from '../models/source';

@Injectable({
  providedIn: 'root',
})
export class SourcesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getSources
   */
  static readonly GetSourcesPath = '/sources';

  /**
   * Get available sources.
   *
   * Get a list of all Bright Sky sources matching the given location criteria, ordered by distance.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getSources()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSources$Response(params?: {

    /**
     * Latitude in decimal degrees, e.g. &#x60;51.58&#x60;.
     */
    lat?: number;

    /**
     * Longitude in decimal degrees, e.g. &#x60;7.38&#x60;.
     */
    lon?: number;

    /**
     * DWD station ID, typically five alphanumeric characters, e.g. &#x60;P0036&#x60;. You can supply multiple station IDs separated by commas, ordered from highest to lowest priority.
     */
    dwd_station_id?: string;

    /**
     * WMO station ID, typically five digits, e.g. &#x60;10315&#x60;. You can supply multiple station IDs separated by commas, ordered from highest to lowest priority.
     */
    wmo_station_id?: string;

    /**
     * Bright Sky source ID, as retrieved from the &#x60;sources&#x60; endpoint, e.g. &#x60;1234&#x60;. You can supply multiple source IDs separated by commas, ordered from highest to lowest priority.
     */
    source_id?: number;

    /**
     * Maximum distance of record location from the location given by &#x60;lat&#x60; and &#x60;lon&#x60;, in meters, e.g. &#x60;10000&#x60;. Only has an effect when using &#x60;lat&#x60; and &#x60;lon&#x60;. Defaults to &#x60;50000&#x60;.
     */
    max_dist?: number;
  }): Observable<StrictHttpResponse<{
'sources'?: Array<Source>;
}>> {

    const rb = new RequestBuilder(this.rootUrl, SourcesService.GetSourcesPath, 'get');
    if (params) {
      rb.query('lat', params.lat, {});
      rb.query('lon', params.lon, {});
      rb.query('dwd_station_id', params.dwd_station_id, {});
      rb.query('wmo_station_id', params.wmo_station_id, {});
      rb.query('source_id', params.source_id, {});
      rb.query('max_dist', params.max_dist, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'sources'?: Array<Source>;
        }>;
      })
    );
  }

  /**
   * Get available sources.
   *
   * Get a list of all Bright Sky sources matching the given location criteria, ordered by distance.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getSources$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSources(params?: {

    /**
     * Latitude in decimal degrees, e.g. &#x60;51.58&#x60;.
     */
    lat?: number;

    /**
     * Longitude in decimal degrees, e.g. &#x60;7.38&#x60;.
     */
    lon?: number;

    /**
     * DWD station ID, typically five alphanumeric characters, e.g. &#x60;P0036&#x60;. You can supply multiple station IDs separated by commas, ordered from highest to lowest priority.
     */
    dwd_station_id?: string;

    /**
     * WMO station ID, typically five digits, e.g. &#x60;10315&#x60;. You can supply multiple station IDs separated by commas, ordered from highest to lowest priority.
     */
    wmo_station_id?: string;

    /**
     * Bright Sky source ID, as retrieved from the &#x60;sources&#x60; endpoint, e.g. &#x60;1234&#x60;. You can supply multiple source IDs separated by commas, ordered from highest to lowest priority.
     */
    source_id?: number;

    /**
     * Maximum distance of record location from the location given by &#x60;lat&#x60; and &#x60;lon&#x60;, in meters, e.g. &#x60;10000&#x60;. Only has an effect when using &#x60;lat&#x60; and &#x60;lon&#x60;. Defaults to &#x60;50000&#x60;.
     */
    max_dist?: number;
  }): Observable<{
'sources'?: Array<Source>;
}> {

    return this.getSources$Response(params).pipe(
      map((r: StrictHttpResponse<{
'sources'?: Array<Source>;
}>) => r.body as {
'sources'?: Array<Source>;
})
    );
  }

}
