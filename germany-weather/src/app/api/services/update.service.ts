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

import { ApiKeyBody } from '../models/api-key-body';

@Injectable({
  providedIn: 'root',
})
export class UpdateService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation updateUpdatePost
   */
  static readonly UpdateUpdatePostPath = '/update/';

  /**
   * Update.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateUpdatePost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUpdatePost$Response(params: {
    body: ApiKeyBody
  }): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, UpdateService.UpdateUpdatePostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<any>;
      })
    );
  }

  /**
   * Update.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateUpdatePost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUpdatePost(params: {
    body: ApiKeyBody
  }): Observable<any> {

    return this.updateUpdatePost$Response(params).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

}
