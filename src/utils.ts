import { dateTimeFormatWithAbbrevation, UrlQueryMap } from '@grafana/data';
import {locationService} from '@grafana/runtime';

/**
 * This formats a time field to ensure the millisecond portion of the epoch time is
 * included.
 *
 * @param time the epoch time to format
 *
 * @returns the formatted epoch time containing milliseconds.
 */
export const getEpochWithMillis = (time: number): number => {
  return time < 100000000000 ? time * 1000 : time;
};

/**
 * This formats a time field to ensure the millisecond portion of the epoch time is
 * NOT included.
 *
 * @param time the epoch time to format
 *
 * @returns the formatted epoch time containing milliseconds.
 */
export const getEpochWithoutMillis = (time: number): number => {
  return time > 100000000000 ? time % 1000 : time;
};

/**
 * This changes the Query map of the URL to effectively change the to and from time.
 *
 * @param time_from the start time
 * @param time_to the end time. Defaults to 'now' if null or invalid.
 *
 */
export function changeTimeRange(time_from: number, time_to?: number) {
  let queryMap: UrlQueryMap = { from: getEpochWithMillis(time_from), to: 'now' };
  if (typeof time_to !== 'undefined' && time_to !== null && !isNaN(time_to)) {
    queryMap.to = getEpochWithMillis(time_to);
  }

  locationService.partial(queryMap, true);
}

export function changeTimeRangeAndVariable(
    time_from: number,
    time_to?: number,
    variable_name?: string,
    variable_value?: string,
) {
  let queryMap: any = { from: getEpochWithMillis(time_from), to: 'now' };
  if (typeof time_to !== 'undefined' && time_to !== null && !isNaN(time_to)) {
    queryMap.to = getEpochWithMillis(time_to);
  }

  if (variable_name !== undefined && variable_name !== '') {
    queryMap[`var-${variable_name}`] = variable_value;
  }

  locationService.partial(queryMap, true);

}

/**
 * Get an Epoch date in a human readble format.
 *
 * @param time the epoch time. Can be in seconds or milliseconds
 *
 * @returns a srting containing the human readbale date.
 */
export const getPrettyDate = (time?: number): string => {
  if (typeof time !== 'undefined' && time !== null && !isNaN(time)) {
    return dateTimeFormatWithAbbrevation(getEpochWithMillis(time));
  }
  return 'now';
};
