/* tslint:disable */
/* eslint-disable */
import { Timestamp } from './timestamp';
export interface Source {

  /**
   * Distance of weather station to the requested `lat` and `lon`, in meters
   */
  distance?: number;

  /**
   * DWD weather station ID
   */
  dwd_station_id?: null | string;
  first_record?: Timestamp & any;

  /**
   * Station height, in meters
   */
  height?: number;

  /**
   * Bright Sky source ID
   */
  id?: number;
  last_record?: Timestamp & any;

  /**
   * Station latitude, in decimal degrees
   */
  lat?: number;

  /**
   * Station longitude, in decimal degrees
   */
  lon?: number;

  /**
   * Source type
   */
  observation_type?: 'forecast' | 'synop' | 'current' | 'historical';

  /**
   * DWD weather station name
   */
  station_name?: null | string;

  /**
   * WMO weather station ID
   */
  wmo_station_id?: null | string;
}
