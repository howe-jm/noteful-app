import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Note from '../Note/Note';
import CircleButton from '../CircleButton/CircleButton';
import ApiContext from '../ApiContext';
import { getNotesForFolder } from '../notes-helpers';
import ErrorPage from '../ErrorBoundary/ErrorBoundary';
import PropTypes from 'prop-types';
import './NoteListMain.css';

export default class NoteListMain extends React.Component {
  static defaultProps = { match: { params: {} } };
  static contextType = ApiContext;

  handleDeleteNote = () => {
    this.props.history.push(`/`);
  };

  render() {
    const folderId = parseInt(this.props.match.params.folderId);
    const { notes = [] } = this.context;
    const notesForFolder = getNotesForFolder(notes, folderId);
    return (
      <ErrorPage>
        <section className='NoteListMain'>
          <ul>
            {notesForFolder.map((note) => (
              <li key={note.id}>
                <Note
                  id={note.id}
                  notename={note.notename}
                  modified={note.modified}
                  onDeleteNote={this.handleDeleteNote}
                />
              </li>
            ))}
          </ul>
          <div className='NoteListMain__button-container'>
            <CircleButton
              tag={Link}
              to='/add-note'
              type='button'
              className='NoteListMain__add-note-button'
            >
              <FontAwesomeIcon icon='plus' />
              <br />
              Note
            </CircleButton>
          </div>
        </section>
      </ErrorPage>
    );
  }
}

NoteListMain.propTypes = {
  match: PropTypes.shape({ params: PropTypes.object }),
};
