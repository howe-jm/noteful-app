import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import AddNote from './AddNote';

describe(`Add Note component`, () => {
  const props = { name: '', folderId: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', content: '', error: false };
  const propsTest = { name: '', folderId: '', content: '', error: false };

  it('renders an error page with no folders present', () => {
    const wrapper = shallow(<AddNote {...propsTest} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders the add note form given props', () => {
    const wrapper = shallow(<AddNote {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
