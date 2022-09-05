/* tslint:disable */
/* eslint-disable */
import { Timestamp } from './timestamp';
export interface SynopRecord {

  /**
   * Total cloud cover at timestamp
   */
  cloud_cover?: null | number;

  /**
   * Current weather conditions. Unlike the numerical parameters, this field is not taken as-is from the raw data (because it does not exist), but is calculated from different fields in the raw data as a best effort. Not all values are available for all source types.
   */
  condition?: null | 'dry' | 'fog' | 'rain' | 'sleet' | 'snow' | 'hail' | 'thunderstorm' | 'null';

  /**
   * Dew point at timestamp, 2 m above ground
   */
  dew_point?: null | number;

  /**
   * Icon alias suitable for the current weather conditions. Unlike the numerical parameters, this field is not taken as-is from the raw data (because it does not exist), but is calculated from different fields in the raw data as a best effort. Not all values are available for all source types.
   */
  icon?: null | 'clear-day' | 'clear-night' | 'partly-cloudy-day' | 'partly-cloudy-night' | 'cloudy' | 'fog' | 'wind' | 'rain' | 'sleet' | 'snow' | 'hail' | 'thunderstorm' | 'null';

  /**
   * Total precipitation during previous 10 minutes
   */
  precipitation_10?: null | number;

  /**
   * Total precipitation during previous 30 minutes
   */
  precipitation_30?: null | number;

  /**
   * Total precipitation during previous 60 minutes
   */
  precipitation_60?: null | number;

  /**
   * Atmospheric pressure at timestamp, reduced to mean sea level
   */
  pressure_msl?: null | number;

  /**
   * Relative humidity at timestamp
   */
  relative_humidity?: null | number;

  /**
   * Bright Sky source ID for this record
   */
  source_id?: number;

  /**
   * Sunshine duration during previous 30 minutes
   */
  sunshine_30?: null | number;

  /**
   * Sunshine duration during previous 60 minutes
   */
  sunshine_60?: null | number;

  /**
   * Air temperature at timestamp, 2 m above the ground
   */
  temperature?: null | number;
  timestamp?: Timestamp & any;

  /**
   * Visibility at timestamp
   */
  visibility?: null | number;

  /**
   * Mean wind direction during previous 10 minutes, 10 m above the ground
   */
  wind_direction_10?: null | number;

  /**
   * Mean wind direction during previous 30 minutes, 10 m above the ground
   */
  wind_direction_30?: null | number;

  /**
   * Mean wind direction during previous 60 minutes, 10 m above the ground
   */
  wind_direction_60?: null | number;

  /**
   * Direction of maximum wind gust during previous 10 minutes, 10 m above the ground
   */
  wind_gust_direction_10?: null | number;

  /**
   * Direction of maximum wind gust during previous 30 minutes, 10 m above the ground
   */
  wind_gust_direction_30?: null | number;

  /**
   * Direction of maximum wind gust during previous 60 minutes, 10 m above the ground
   */
  wind_gust_direction_60?: null | number;

  /**
   * Speed of maximum wind gust during previous 10 minutes, 10 m above the ground
   */
  wind_gust_speed_10?: null | number;

  /**
   * Speed of maximum wind gust during previous 30 minutes, 10 m above the ground
   */
  wind_gust_speed_30?: null | number;

  /**
   * Speed of maximum wind gust during previous 60 minutes, 10 m above the ground
   */
  wind_gust_speed_60?: null | number;

  /**
   * Mean wind speed during previous previous 10 minutes, 10 m above the ground
   */
  wind_speed_10?: null | number;

  /**
   * Mean wind speed during previous previous 30 minutes, 10 m above the ground
   */
  wind_speed_30?: null | number;

  /**
   * Mean wind speed during previous previous 60 minutes, 10 m above the ground
   */
  wind_speed_60?: null | number;
}
