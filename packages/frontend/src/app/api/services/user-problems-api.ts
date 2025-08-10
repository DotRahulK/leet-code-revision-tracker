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

import { LinkProblemDto } from '../models/link-problem-dto';
import { RateRecallDto } from '../models/rate-recall-dto';
import { UpdateCodeDto } from '../models/update-code-dto';
import { UpdateNotesDto } from '../models/update-notes-dto';

@Injectable({
  providedIn: 'root',
})
export class UserProblemsApi extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation userProblemsControllerGetDueToday
   */
  static readonly UserProblemsControllerGetDueTodayPath = '/reviews/today';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userProblemsControllerGetDueToday()` instead.
   *
   * This method doesn't expect any request body.
   */
  userProblemsControllerGetDueToday$Response(params?: {
    userId?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UserProblemsApi.UserProblemsControllerGetDueTodayPath, 'get');
    if (params) {
      rb.query('userId', params.userId, {});
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
   * To access the full response (for headers, for example), `userProblemsControllerGetDueToday$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  userProblemsControllerGetDueToday(params?: {
    userId?: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.userProblemsControllerGetDueToday$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation userProblemsControllerRateRecall
   */
  static readonly UserProblemsControllerRateRecallPath = '/reviews/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userProblemsControllerRateRecall()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerRateRecall$Response(params: {

    /**
     * UserProblem identifier
     */
    id: string;
    context?: HttpContext
    body: RateRecallDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UserProblemsApi.UserProblemsControllerRateRecallPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
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
   * To access the full response (for headers, for example), `userProblemsControllerRateRecall$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerRateRecall(params: {

    /**
     * UserProblem identifier
     */
    id: string;
    context?: HttpContext
    body: RateRecallDto
  }
): Observable<void> {

    return this.userProblemsControllerRateRecall$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation userProblemsControllerLinkProblem
   */
  static readonly UserProblemsControllerLinkProblemPath = '/user-problems';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userProblemsControllerLinkProblem()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerLinkProblem$Response(params: {
    context?: HttpContext
    body: LinkProblemDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UserProblemsApi.UserProblemsControllerLinkProblemPath, 'post');
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
   * To access the full response (for headers, for example), `userProblemsControllerLinkProblem$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerLinkProblem(params: {
    context?: HttpContext
    body: LinkProblemDto
  }
): Observable<void> {

    return this.userProblemsControllerLinkProblem$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation userProblemsControllerUpdateNotes
   */
  static readonly UserProblemsControllerUpdateNotesPath = '/user-problems/{id}/notes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userProblemsControllerUpdateNotes()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerUpdateNotes$Response(params: {

    /**
     * UserProblem identifier
     */
    id: string;
    context?: HttpContext
    body: UpdateNotesDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UserProblemsApi.UserProblemsControllerUpdateNotesPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
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
   * To access the full response (for headers, for example), `userProblemsControllerUpdateNotes$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerUpdateNotes(params: {

    /**
     * UserProblem identifier
     */
    id: string;
    context?: HttpContext
    body: UpdateNotesDto
  }
): Observable<void> {

    return this.userProblemsControllerUpdateNotes$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation userProblemsControllerUpdateCode
   */
  static readonly UserProblemsControllerUpdateCodePath = '/user-problems/{id}/code';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userProblemsControllerUpdateCode()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerUpdateCode$Response(params: {

    /**
     * UserProblem identifier
     */
    id: string;
    context?: HttpContext
    body: UpdateCodeDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UserProblemsApi.UserProblemsControllerUpdateCodePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
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
   * To access the full response (for headers, for example), `userProblemsControllerUpdateCode$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  userProblemsControllerUpdateCode(params: {

    /**
     * UserProblem identifier
     */
    id: string;
    context?: HttpContext
    body: UpdateCodeDto
  }
): Observable<void> {

    return this.userProblemsControllerUpdateCode$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
