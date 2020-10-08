import React from 'react';
import ErrorPage from '../ErrorBoundary/ErrorBoundary';
import ApiContext from '../ApiContext';
import './PageNotFound.css';

export default class PageNotFound extends React.Component {
  static contextType = ApiContext;

  render() {
    return (
      <ErrorPage>
        <div className='not-found'>
          <h2>Note not found!</h2>
          <p>Get outta here, stalker.</p>
        </div>
      </ErrorPage>
    );
  }
}
