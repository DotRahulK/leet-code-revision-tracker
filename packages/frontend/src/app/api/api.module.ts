/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { AppApi } from './services/app-api';
import { UserProblemsApi } from './services/user-problems-api';
import { ProblemsApi } from './services/problems-api';
import { LeetcodeApi } from './services/leetcode-api';
import { UsersApi } from './services/users-api';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    AppApi,
    UserProblemsApi,
    ProblemsApi,
    LeetcodeApi,
    UsersApi,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
