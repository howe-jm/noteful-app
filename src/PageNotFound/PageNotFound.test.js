import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import PageNotFound from './PageNotFound';

describe(`Add Folder component`, () => {
  it('Renders without errors', () => {
    const wrapper = shallow(<PageNotFound />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
