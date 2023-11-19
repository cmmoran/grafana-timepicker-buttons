import React, { Component } from 'react';

import '../css/TimepickerButton.css';
import { TimepickerData } from '../types';
import { changeTimeRangeAndVariable, getPrettyDate } from '../utils';
import { Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

interface TimepickerSelectProps {
  timepickerData: TimepickerData[];
}

const TimepickerCompareFn = (k = "time_from"): (a: TimepickerData,b: TimepickerData) => number => {
  return (a: TimepickerData, b: TimepickerData): number => {
    let ao = (a as any)[k];
    let bo = (b as any)[k];
    if (ao === bo) {
      return 0;
    } else if(ao > bo) {
      return -1;
    } else if(ao < bo) {
      return 1;
    }
    return 0;
  }
}

export class TimepickerSelect extends Component<TimepickerSelectProps> {
  handleChange = (selectedOption: SelectableValue) => {
    const selected: TimepickerData = this.props.timepickerData[selectedOption.value];
    changeTimeRangeAndVariable(selected.time_from, selected.time_to, selected.variableName, selected.variableValue);
  };

  render() {
    return (
      <Select
        onChange={this.handleChange}
        options={this.props.timepickerData.sort(TimepickerCompareFn()).map((option, index) => ({
          label: option.errors.length > 0 ? 'Error' : option.text || getPrettyDate(option.time_from),
          value: index,
          description: option.errors.join() || getPrettyDate(option.time_from) + ' to ' + getPrettyDate(option.time_to),
        }))}
      />
    );
  }
}
