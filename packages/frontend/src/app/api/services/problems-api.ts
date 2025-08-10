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

import { BulkImportProblemsDto } from '../models/bulk-import-problems-dto';
import { UpsertProblemDto } from '../models/upsert-problem-dto';

@Injectable({
  providedIn: 'root',
})
export class ProblemsApi extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation problemsControllerGetProblems
   */
  static readonly ProblemsControllerGetProblemsPath = '/problems';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `problemsControllerGetProblems()` instead.
   *
   * This method doesn't expect any request body.
   */
  problemsControllerGetProblems$Response(params?: {

    /**
     * Search term for problem title or slug
     */
    search?: string;

    /**
     * Filter by tag
     */
    tag?: string;

    /**
     * Filter by difficulty
     */
    difficulty?: 'Easy' | 'Medium' | 'Hard';

    /**
     * Maximum number of problems to return
     */
    limit?: number;

    /**
     * Number of problems to skip
     */
    offset?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemsApi.ProblemsControllerGetProblemsPath, 'get');
    if (params) {
      rb.query('search', params.search, {});
      rb.query('tag', params.tag, {});
      rb.query('difficulty', params.difficulty, {});
      rb.query('limit', params.limit, {});
      rb.query('offset', params.offset, {});
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
   * To access the full response (for headers, for example), `problemsControllerGetProblems$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  problemsControllerGetProblems(params?: {

    /**
     * Search term for problem title or slug
     */
    search?: string;

    /**
     * Filter by tag
     */
    tag?: string;

    /**
     * Filter by difficulty
     */
    difficulty?: 'Easy' | 'Medium' | 'Hard';

    /**
     * Maximum number of problems to return
     */
    limit?: number;

    /**
     * Number of problems to skip
     */
    offset?: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.problemsControllerGetProblems$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation problemsControllerGetBySlug
   */
  static readonly ProblemsControllerGetBySlugPath = '/problems/{slug}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `problemsControllerGetBySlug()` instead.
   *
   * This method doesn't expect any request body.
   */
  problemsControllerGetBySlug$Response(params: {

    /**
     * Problem slug
     */
    slug: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemsApi.ProblemsControllerGetBySlugPath, 'get');
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
   * To access the full response (for headers, for example), `problemsControllerGetBySlug$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  problemsControllerGetBySlug(params: {

    /**
     * Problem slug
     */
    slug: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.problemsControllerGetBySlug$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation problemsControllerUpsertProblem
   */
  static readonly ProblemsControllerUpsertProblemPath = '/problems/{slug}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `problemsControllerUpsertProblem()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  problemsControllerUpsertProblem$Response(params: {

    /**
     * Problem slug
     */
    slug: string;
    context?: HttpContext
    body: UpsertProblemDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemsApi.ProblemsControllerUpsertProblemPath, 'put');
    if (params) {
      rb.path('slug', params.slug, {});
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
   * To access the full response (for headers, for example), `problemsControllerUpsertProblem$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  problemsControllerUpsertProblem(params: {

    /**
     * Problem slug
     */
    slug: string;
    context?: HttpContext
    body: UpsertProblemDto
  }
): Observable<void> {

    return this.problemsControllerUpsertProblem$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation problemsControllerBulkImport
   */
  static readonly ProblemsControllerBulkImportPath = '/problems/import';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `problemsControllerBulkImport()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  problemsControllerBulkImport$Response(params: {
    context?: HttpContext
    body: BulkImportProblemsDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProblemsApi.ProblemsControllerBulkImportPath, 'post');
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
   * To access the full response (for headers, for example), `problemsControllerBulkImport$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  problemsControllerBulkImport(params: {
    context?: HttpContext
    body: BulkImportProblemsDto
  }
): Observable<void> {

    return this.problemsControllerBulkImport$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
