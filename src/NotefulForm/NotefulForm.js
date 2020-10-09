import React from 'react';
import PropTypes from 'prop-types';
import './NotefulForm.css';

// What is this and where is it being used?

export default function NotefulForm(props) {
  const { className, ...otherProps } = props;
  return <form className={['Noteful-form', className].join(' ')} action='#' {...otherProps} />;
}

NotefulForm.defaultProps = {
  className: PropTypes.string,
};
