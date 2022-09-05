/* tslint:disable */
/* eslint-disable */
import { Timestamp } from './timestamp';
export interface WeatherRecord {

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
   * Object mapping meteorological parameters to the source IDs of alternative sources that were used to fill up missing values in the main source
   */
  fallback_source_ids?: {
};

  /**
   * Icon alias suitable for the current weather conditions. Unlike the numerical parameters, this field is not taken as-is from the raw data (because it does not exist), but is calculated from different fields in the raw data as a best effort. Not all values are available for all source types.
   */
  icon?: null | 'clear-day' | 'clear-night' | 'partly-cloudy-day' | 'partly-cloudy-night' | 'cloudy' | 'fog' | 'wind' | 'rain' | 'sleet' | 'snow' | 'hail' | 'thunderstorm' | 'null';

  /**
   * Total precipitation during previous 60 minutes
   */
  precipitation?: null | number;

  /**
   * Atmospheric pressure at timestamp, reduced to mean sea level
   */
  pressure_msl?: null | number;

  /**
   * Relative humidity at timestamp
   */
  relative_humidity?: null | number;

  /**
   * Main Bright Sky source ID for this record
   */
  source_id?: number;

  /**
   * Sunshine duration during previous 60 minutes
   */
  sunshine?: null | number;

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
   * Mean wind direction during previous hour, 10 m above the ground
   */
  wind_direction?: null | number;

  /**
   * Direction of maximum wind gust during previous hour, 10 m above the ground
   */
  wind_gust_direction?: null | number;

  /**
   * Speed of maximum wind gust during previous hour, 10 m above the ground
   */
  wind_gust_speed?: null | number;

  /**
   * Mean wind speed during previous hour, 10 m above the ground
   */
  wind_speed?: null | number;
}
