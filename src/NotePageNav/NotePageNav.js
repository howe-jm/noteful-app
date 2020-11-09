import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleButton from '../CircleButton/CircleButton';
import ApiContext from '../ApiContext';
import { findNote, findFolder } from '../notes-helpers';
import './NotePageNav.css';
import ErrorPage from '../ErrorBoundary/ErrorBoundary';
import PropTypes from 'prop-types';

export default class NotePageNav extends React.Component {
  static contextType = ApiContext;

  render() {
    const { notes, folders } = this.context;
    const { noteid } = this.props.match.params;
    const note = findNote(notes, noteid) || {};
    const folder = findFolder(folders, note.folderid);
    return (
      <ErrorPage>
        <div className='NotePageNav'>
          <CircleButton
            tag='button'
            role='link'
            onClick={() => this.props.history.goBack()}
            className='NotePageNav__back-button'
          >
            <FontAwesomeIcon icon='chevron-left' />
            <br />
            Back
          </CircleButton>
          {folder && <h3 className='NotePageNav__folder-name'>{folder.foldername}</h3>}
        </div>
      </ErrorPage>
    );
  }
}

NotePageNav.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
};

NotePageNav.defaultProps = {
  match: {
    params: {},
  },
};
