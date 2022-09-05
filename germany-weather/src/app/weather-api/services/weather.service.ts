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
import { SynopRecord } from '../models/synop-record';
import { Timestamp } from '../models/timestamp';
import { WeatherRecord } from '../models/weather-record';

@Injectable({
  providedIn: 'root',
})
export class WeatherService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getWeather
   */
  static readonly GetWeatherPath = '/weather';

  /**
   * Get observed and/or forecasted weather.
   *
   * Get a list of hourly weather records (and/or forecasts) for the time range given by `date` and `last_date`.
   *
   * To set the location for which to retrieve records (and/or forecasts), you must supply both `lat` and `lon` _or_ one of `dwd_station_id`, `wmo_station_id`, or `source_id`.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getWeather()` instead.
   *
   * This method doesn't expect any request body.
   */
  getWeather$Response(params: {

    /**
     * Timestamp of first weather record (or forecast) to retrieve, in ISO 8601 format, e.g. &#x60;2020-04-21&#x60; or &#x60;2020-04-24T12:00+02:00&#x60;. May contain time and/or UTC offset. If you do not supply a time, midnight will be assumed.
     */
    date: Timestamp;

    /**
     * Timestamp of last weather record (or forecast) to retrieve, in ISO 8601 format. Will default to &#x60;date + 1 day&#x60;. (Also see explanation for &#x60;date&#x60;.)
     */
    last_date?: Timestamp;

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

    /**
     * Timezone in which record timestamps will be presented, as &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/List_of_tz_database_time_zones&quot;&gt;tz database name&lt;/a&gt;, e.g. &#x60;Europe/Berlin&#x60;. Will also be used as timezone when parsing &#x60;date&#x60; and &#x60;last_date&#x60;, unless these have explicit UTC offsets. If omitted but &#x60;date&#x60; has an explicit UTC offset, that offset will be used as timezone. Otherwise will default to UTC.
     */
    tz?: string;

    /**
     * Physical units in which meteorological parameters will be returned. Set to &#x60;si&#x60; to use &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/International_System_of_Units&quot;&gt;SI units&lt;/a&gt;. The default &#x60;dwd&#x60; option uses a set of units that is more common in meteorological applications and civil use:
     * &lt;table&gt;
     *   &lt;tr&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;DWD&lt;/td&gt;&lt;td&gt;SI&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Cloud cover&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Dew point&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Precipitation&lt;/td&gt;&lt;td&gt;mm&lt;/td&gt;&lt;td&gt;kg / m²&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Pressure&lt;/td&gt;&lt;td&gt;hPa&lt;/td&gt;&lt;td&gt;Pa&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Relative humidity&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Sunshine&lt;/td&gt;&lt;td&gt;min&lt;/td&gt;&lt;td&gt;s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Temperature&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Visibility&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     * &lt;/table&gt;
     */
    units?: 'dwd' | 'si';
  }): Observable<StrictHttpResponse<{
'weather'?: Array<WeatherRecord>;
'sources'?: Array<Source>;
}>> {

    const rb = new RequestBuilder(this.rootUrl, WeatherService.GetWeatherPath, 'get');
    if (params) {
      rb.query('date', params.date, {});
      rb.query('last_date', params.last_date, {});
      rb.query('lat', params.lat, {});
      rb.query('lon', params.lon, {});
      rb.query('dwd_station_id', params.dwd_station_id, {});
      rb.query('wmo_station_id', params.wmo_station_id, {});
      rb.query('source_id', params.source_id, {});
      rb.query('max_dist', params.max_dist, {});
      rb.query('tz', params.tz, {});
      rb.query('units', params.units, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'weather'?: Array<WeatherRecord>;
        'sources'?: Array<Source>;
        }>;
      })
    );
  }

  /**
   * Get observed and/or forecasted weather.
   *
   * Get a list of hourly weather records (and/or forecasts) for the time range given by `date` and `last_date`.
   *
   * To set the location for which to retrieve records (and/or forecasts), you must supply both `lat` and `lon` _or_ one of `dwd_station_id`, `wmo_station_id`, or `source_id`.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getWeather$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getWeather(params: {

    /**
     * Timestamp of first weather record (or forecast) to retrieve, in ISO 8601 format, e.g. &#x60;2020-04-21&#x60; or &#x60;2020-04-24T12:00+02:00&#x60;. May contain time and/or UTC offset. If you do not supply a time, midnight will be assumed.
     */
    date: Timestamp;

    /**
     * Timestamp of last weather record (or forecast) to retrieve, in ISO 8601 format. Will default to &#x60;date + 1 day&#x60;. (Also see explanation for &#x60;date&#x60;.)
     */
    last_date?: Timestamp;

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

    /**
     * Timezone in which record timestamps will be presented, as &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/List_of_tz_database_time_zones&quot;&gt;tz database name&lt;/a&gt;, e.g. &#x60;Europe/Berlin&#x60;. Will also be used as timezone when parsing &#x60;date&#x60; and &#x60;last_date&#x60;, unless these have explicit UTC offsets. If omitted but &#x60;date&#x60; has an explicit UTC offset, that offset will be used as timezone. Otherwise will default to UTC.
     */
    tz?: string;

    /**
     * Physical units in which meteorological parameters will be returned. Set to &#x60;si&#x60; to use &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/International_System_of_Units&quot;&gt;SI units&lt;/a&gt;. The default &#x60;dwd&#x60; option uses a set of units that is more common in meteorological applications and civil use:
     * &lt;table&gt;
     *   &lt;tr&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;DWD&lt;/td&gt;&lt;td&gt;SI&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Cloud cover&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Dew point&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Precipitation&lt;/td&gt;&lt;td&gt;mm&lt;/td&gt;&lt;td&gt;kg / m²&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Pressure&lt;/td&gt;&lt;td&gt;hPa&lt;/td&gt;&lt;td&gt;Pa&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Relative humidity&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Sunshine&lt;/td&gt;&lt;td&gt;min&lt;/td&gt;&lt;td&gt;s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Temperature&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Visibility&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     * &lt;/table&gt;
     */
    units?: 'dwd' | 'si';
  }): Observable<{
'weather'?: Array<WeatherRecord>;
'sources'?: Array<Source>;
}> {

    return this.getWeather$Response(params).pipe(
      map((r: StrictHttpResponse<{
'weather'?: Array<WeatherRecord>;
'sources'?: Array<Source>;
}>) => r.body as {
'weather'?: Array<WeatherRecord>;
'sources'?: Array<Source>;
})
    );
  }

  /**
   * Path part for operation getCurrentWeather
   */
  static readonly GetCurrentWeatherPath = '/current_weather';

  /**
   * Get current weather.
   *
   * Get current weather for a given location.
   *
   * This endpoint is different from the other weather endpoints in that it does not directly correspond to any of the data available from the DWD Open Data server. Instead, it is a best-effort solution to reflect current weather conditions by compiling SYNOP observations from the past one and a half hours.
   *
   * To set the location for which to retrieve weather, you must supply both `lat` and `lon` _or_ one of `dwd_station_id`, `wmo_station_id`, or `source_id`.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCurrentWeather()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentWeather$Response(params?: {

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

    /**
     * Timezone in which record timestamps will be presented, as &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/List_of_tz_database_time_zones&quot;&gt;tz database name&lt;/a&gt;, e.g. &#x60;Europe/Berlin&#x60;. Will also be used as timezone when parsing &#x60;date&#x60; and &#x60;last_date&#x60;, unless these have explicit UTC offsets. If omitted but &#x60;date&#x60; has an explicit UTC offset, that offset will be used as timezone. Otherwise will default to UTC.
     */
    tz?: string;

    /**
     * Physical units in which meteorological parameters will be returned. Set to &#x60;si&#x60; to use &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/International_System_of_Units&quot;&gt;SI units&lt;/a&gt;. The default &#x60;dwd&#x60; option uses a set of units that is more common in meteorological applications and civil use:
     * &lt;table&gt;
     *   &lt;tr&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;DWD&lt;/td&gt;&lt;td&gt;SI&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Cloud cover&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Dew point&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Precipitation&lt;/td&gt;&lt;td&gt;mm&lt;/td&gt;&lt;td&gt;kg / m²&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Pressure&lt;/td&gt;&lt;td&gt;hPa&lt;/td&gt;&lt;td&gt;Pa&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Relative humidity&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Sunshine&lt;/td&gt;&lt;td&gt;min&lt;/td&gt;&lt;td&gt;s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Temperature&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Visibility&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     * &lt;/table&gt;
     */
    units?: 'dwd' | 'si';
  }): Observable<StrictHttpResponse<{
'weather'?: SynopRecord & {

/**
 * Object mapping meteorological parameters to the source IDs of alternative sources that were used to fill up missing values in the main source
 */
'fallback_source_ids'?: {
};
};
'sources'?: Array<Source>;
}>> {

    const rb = new RequestBuilder(this.rootUrl, WeatherService.GetCurrentWeatherPath, 'get');
    if (params) {
      rb.query('lat', params.lat, {});
      rb.query('lon', params.lon, {});
      rb.query('dwd_station_id', params.dwd_station_id, {});
      rb.query('wmo_station_id', params.wmo_station_id, {});
      rb.query('source_id', params.source_id, {});
      rb.query('max_dist', params.max_dist, {});
      rb.query('tz', params.tz, {});
      rb.query('units', params.units, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'weather'?: SynopRecord & {
        
        /**
         * Object mapping meteorological parameters to the source IDs of alternative sources that were used to fill up missing values in the main source
         */
        'fallback_source_ids'?: {
        };
        };
        'sources'?: Array<Source>;
        }>;
      })
    );
  }

  /**
   * Get current weather.
   *
   * Get current weather for a given location.
   *
   * This endpoint is different from the other weather endpoints in that it does not directly correspond to any of the data available from the DWD Open Data server. Instead, it is a best-effort solution to reflect current weather conditions by compiling SYNOP observations from the past one and a half hours.
   *
   * To set the location for which to retrieve weather, you must supply both `lat` and `lon` _or_ one of `dwd_station_id`, `wmo_station_id`, or `source_id`.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCurrentWeather$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentWeather(params?: {

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

    /**
     * Timezone in which record timestamps will be presented, as &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/List_of_tz_database_time_zones&quot;&gt;tz database name&lt;/a&gt;, e.g. &#x60;Europe/Berlin&#x60;. Will also be used as timezone when parsing &#x60;date&#x60; and &#x60;last_date&#x60;, unless these have explicit UTC offsets. If omitted but &#x60;date&#x60; has an explicit UTC offset, that offset will be used as timezone. Otherwise will default to UTC.
     */
    tz?: string;

    /**
     * Physical units in which meteorological parameters will be returned. Set to &#x60;si&#x60; to use &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/International_System_of_Units&quot;&gt;SI units&lt;/a&gt;. The default &#x60;dwd&#x60; option uses a set of units that is more common in meteorological applications and civil use:
     * &lt;table&gt;
     *   &lt;tr&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;DWD&lt;/td&gt;&lt;td&gt;SI&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Cloud cover&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Dew point&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Precipitation&lt;/td&gt;&lt;td&gt;mm&lt;/td&gt;&lt;td&gt;kg / m²&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Pressure&lt;/td&gt;&lt;td&gt;hPa&lt;/td&gt;&lt;td&gt;Pa&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Relative humidity&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Sunshine&lt;/td&gt;&lt;td&gt;min&lt;/td&gt;&lt;td&gt;s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Temperature&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Visibility&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     * &lt;/table&gt;
     */
    units?: 'dwd' | 'si';
  }): Observable<{
'weather'?: SynopRecord & {

/**
 * Object mapping meteorological parameters to the source IDs of alternative sources that were used to fill up missing values in the main source
 */
'fallback_source_ids'?: {
};
};
'sources'?: Array<Source>;
}> {

    return this.getCurrentWeather$Response(params).pipe(
      map((r: StrictHttpResponse<{
'weather'?: SynopRecord & {

/**
 * Object mapping meteorological parameters to the source IDs of alternative sources that were used to fill up missing values in the main source
 */
'fallback_source_ids'?: {
};
};
'sources'?: Array<Source>;
}>) => r.body as {
'weather'?: SynopRecord & {

/**
 * Object mapping meteorological parameters to the source IDs of alternative sources that were used to fill up missing values in the main source
 */
'fallback_source_ids'?: {
};
};
'sources'?: Array<Source>;
})
    );
  }

  /**
   * Path part for operation getSynop
   */
  static readonly GetSynopPath = '/synop';

  /**
   * Get SYNOP observations.
   *
   * Get a list of ten-minutely SYNOP observations for the time range given by `date` and `last_date`. Note that Bright Sky only stores SYNOP observations from the past 30 hours.
   *
   * To set the weather station for which to retrieve records, you must supply one of `dwd_station_id`, `wmo_station_id`, or `source_id`. The `synop` endpoint does not support `lat` and `lon`; use the `sources` endpoint if you need to retrieve a SYNOP station ID close to a given location.
   *
   * SYNOP observations are stored as they were reported, which in particular implies that many parameters are only available at certain timestamps. For example, most stations report `sunshine_60` only on the full hour, and `sunshine_30` only at 30 minutes past the full hour (i.e. also not on the full hour). Check out the [`current_weather` endpoint](#get-/current_weather) for an opinionated compilation of recent SYNOP records into a single "current weather" record.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getSynop()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSynop$Response(params: {

    /**
     * Timestamp of first weather record (or forecast) to retrieve, in ISO 8601 format, e.g. &#x60;2020-04-21&#x60; or &#x60;2020-04-24T12:00+02:00&#x60;. May contain time and/or UTC offset. If you do not supply a time, midnight will be assumed.
     */
    date: Timestamp;

    /**
     * Timestamp of last weather record (or forecast) to retrieve, in ISO 8601 format. Will default to &#x60;date + 1 day&#x60;. (Also see explanation for &#x60;date&#x60;.)
     */
    last_date?: Timestamp;

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
     * Timezone in which record timestamps will be presented, as &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/List_of_tz_database_time_zones&quot;&gt;tz database name&lt;/a&gt;, e.g. &#x60;Europe/Berlin&#x60;. Will also be used as timezone when parsing &#x60;date&#x60; and &#x60;last_date&#x60;, unless these have explicit UTC offsets. If omitted but &#x60;date&#x60; has an explicit UTC offset, that offset will be used as timezone. Otherwise will default to UTC.
     */
    tz?: string;

    /**
     * Physical units in which meteorological parameters will be returned. Set to &#x60;si&#x60; to use &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/International_System_of_Units&quot;&gt;SI units&lt;/a&gt;. The default &#x60;dwd&#x60; option uses a set of units that is more common in meteorological applications and civil use:
     * &lt;table&gt;
     *   &lt;tr&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;DWD&lt;/td&gt;&lt;td&gt;SI&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Cloud cover&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Dew point&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Precipitation&lt;/td&gt;&lt;td&gt;mm&lt;/td&gt;&lt;td&gt;kg / m²&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Pressure&lt;/td&gt;&lt;td&gt;hPa&lt;/td&gt;&lt;td&gt;Pa&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Relative humidity&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Sunshine&lt;/td&gt;&lt;td&gt;min&lt;/td&gt;&lt;td&gt;s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Temperature&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Visibility&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     * &lt;/table&gt;
     */
    units?: 'dwd' | 'si';
  }): Observable<StrictHttpResponse<{
'weather'?: Array<SynopRecord>;
'sources'?: Array<Source>;
}>> {

    const rb = new RequestBuilder(this.rootUrl, WeatherService.GetSynopPath, 'get');
    if (params) {
      rb.query('date', params.date, {});
      rb.query('last_date', params.last_date, {});
      rb.query('dwd_station_id', params.dwd_station_id, {});
      rb.query('wmo_station_id', params.wmo_station_id, {});
      rb.query('source_id', params.source_id, {});
      rb.query('tz', params.tz, {});
      rb.query('units', params.units, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        'weather'?: Array<SynopRecord>;
        'sources'?: Array<Source>;
        }>;
      })
    );
  }

  /**
   * Get SYNOP observations.
   *
   * Get a list of ten-minutely SYNOP observations for the time range given by `date` and `last_date`. Note that Bright Sky only stores SYNOP observations from the past 30 hours.
   *
   * To set the weather station for which to retrieve records, you must supply one of `dwd_station_id`, `wmo_station_id`, or `source_id`. The `synop` endpoint does not support `lat` and `lon`; use the `sources` endpoint if you need to retrieve a SYNOP station ID close to a given location.
   *
   * SYNOP observations are stored as they were reported, which in particular implies that many parameters are only available at certain timestamps. For example, most stations report `sunshine_60` only on the full hour, and `sunshine_30` only at 30 minutes past the full hour (i.e. also not on the full hour). Check out the [`current_weather` endpoint](#get-/current_weather) for an opinionated compilation of recent SYNOP records into a single "current weather" record.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getSynop$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSynop(params: {

    /**
     * Timestamp of first weather record (or forecast) to retrieve, in ISO 8601 format, e.g. &#x60;2020-04-21&#x60; or &#x60;2020-04-24T12:00+02:00&#x60;. May contain time and/or UTC offset. If you do not supply a time, midnight will be assumed.
     */
    date: Timestamp;

    /**
     * Timestamp of last weather record (or forecast) to retrieve, in ISO 8601 format. Will default to &#x60;date + 1 day&#x60;. (Also see explanation for &#x60;date&#x60;.)
     */
    last_date?: Timestamp;

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
     * Timezone in which record timestamps will be presented, as &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/List_of_tz_database_time_zones&quot;&gt;tz database name&lt;/a&gt;, e.g. &#x60;Europe/Berlin&#x60;. Will also be used as timezone when parsing &#x60;date&#x60; and &#x60;last_date&#x60;, unless these have explicit UTC offsets. If omitted but &#x60;date&#x60; has an explicit UTC offset, that offset will be used as timezone. Otherwise will default to UTC.
     */
    tz?: string;

    /**
     * Physical units in which meteorological parameters will be returned. Set to &#x60;si&#x60; to use &lt;a href&#x3D;&quot;https://en.wikipedia.org/wiki/International_System_of_Units&quot;&gt;SI units&lt;/a&gt;. The default &#x60;dwd&#x60; option uses a set of units that is more common in meteorological applications and civil use:
     * &lt;table&gt;
     *   &lt;tr&gt;&lt;td&gt;&lt;/td&gt;&lt;td&gt;DWD&lt;/td&gt;&lt;td&gt;SI&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Cloud cover&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Dew point&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Precipitation&lt;/td&gt;&lt;td&gt;mm&lt;/td&gt;&lt;td&gt;kg / m²&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Pressure&lt;/td&gt;&lt;td&gt;hPa&lt;/td&gt;&lt;td&gt;Pa&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Relative humidity&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;td&gt;%&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Sunshine&lt;/td&gt;&lt;td&gt;min&lt;/td&gt;&lt;td&gt;s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Temperature&lt;/td&gt;&lt;td&gt;°C&lt;/td&gt;&lt;td&gt;K&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Visibility&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;td&gt;m&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust direction&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;td&gt;°&lt;/td&gt;&lt;/tr&gt;
     *   &lt;tr&gt;&lt;td&gt;Wind gust speed&lt;/td&gt;&lt;td&gt;km / h&lt;/td&gt;&lt;td&gt;m / s&lt;/td&gt;&lt;/tr&gt;
     * &lt;/table&gt;
     */
    units?: 'dwd' | 'si';
  }): Observable<{
'weather'?: Array<SynopRecord>;
'sources'?: Array<Source>;
}> {

    return this.getSynop$Response(params).pipe(
      map((r: StrictHttpResponse<{
'weather'?: Array<SynopRecord>;
'sources'?: Array<Source>;
}>) => r.body as {
'weather'?: Array<SynopRecord>;
'sources'?: Array<Source>;
})
    );
  }

}
