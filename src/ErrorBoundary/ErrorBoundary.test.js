import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ErrorBoundary from './ErrorBoundary';

describe(`Add Folder component`, () => {
  it('Renders without errors', () => {
    const wrapper = shallow(<ErrorBoundary />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
