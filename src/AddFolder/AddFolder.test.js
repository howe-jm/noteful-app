import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import AddFolder from './AddFolder';

describe(`Add Folder component`, () => {
  it('Renders without errors', () => {
    const wrapper = shallow(<AddFolder />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
