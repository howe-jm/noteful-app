import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';
export default class ErrorPage extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    console.error(error);
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <main className='error-page'>
          <h1>Something seems to have gone wrong</h1>
          <p>Try refreshing the page</p>
        </main>
      );
    }
    return this.props.children;
  }
}

ErrorPage.propTypes = {
  children: PropTypes.object,
};
