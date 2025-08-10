/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { SyncDto } from '../models/sync-dto';

@Injectable({
  providedIn: 'root',
})
export class LeetcodeApi extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation leetcodeControllerSync
   */
  static readonly LeetcodeControllerSyncPath = '/leetcode/sync';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `leetcodeControllerSync()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  leetcodeControllerSync$Response(params: {
    context?: HttpContext
    body: SyncDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, LeetcodeApi.LeetcodeControllerSyncPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `leetcodeControllerSync$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  leetcodeControllerSync(params: {
    context?: HttpContext
    body: SyncDto
  }
): Observable<void> {

    return this.leetcodeControllerSync$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation leetcodeControllerRecent
   */
  static readonly LeetcodeControllerRecentPath = '/leetcode/recent';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `leetcodeControllerRecent()` instead.
   *
   * This method doesn't expect any request body.
   */
  leetcodeControllerRecent$Response(params?: {

    /**
     * Number of recent submissions to fetch
     */
    limit?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, LeetcodeApi.LeetcodeControllerRecentPath, 'get');
    if (params) {
      rb.query('limit', params.limit, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `leetcodeControllerRecent$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  leetcodeControllerRecent(params?: {

    /**
     * Number of recent submissions to fetch
     */
    limit?: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.leetcodeControllerRecent$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation leetcodeControllerQuestion
   */
  static readonly LeetcodeControllerQuestionPath = '/leetcode/question/{slug}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `leetcodeControllerQuestion()` instead.
   *
   * This method doesn't expect any request body.
   */
  leetcodeControllerQuestion$Response(params: {

    /**
     * LeetCode problem slug
     */
    slug: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, LeetcodeApi.LeetcodeControllerQuestionPath, 'get');
    if (params) {
      rb.path('slug', params.slug, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `leetcodeControllerQuestion$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  leetcodeControllerQuestion(params: {

    /**
     * LeetCode problem slug
     */
    slug: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.leetcodeControllerQuestion$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
