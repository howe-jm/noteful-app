import React from 'react';
import Note from '../Note/Note';
import ApiContext from '../ApiContext';
import { findNote } from '../notes-helpers';
import './NotePageMain.css';
import ErrorPage from '../ErrorBoundary/ErrorBoundary';
import PropTypes from 'prop-types';
import PageNotFound from '../PageNotFound/PageNotFound';

export default class NotePageMain extends React.Component {
  static contextType = ApiContext;

  handleDeleteNote = () => {
    this.props.history.push(`/`);
  };

  render() {
    const { notes = [] } = this.context;
    const noteId = parseInt(this.props.match.params.noteId);
    const note = findNote(notes, noteId) || { content: '' };
    if (!(noteId === note.id)) {
      return <PageNotFound />;
    } else {
      console.log(note);
      return (
        <ErrorPage>
          <section className='NotePageMain'>
            <Note
              id={note.id}
              notename={note.notename}
              modified={note.modified}
              onDeleteNote={this.handleDeleteNote}
            />
            <div className='NotePageMain__content'>
              {note.content.split(/\n \r|\n/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        </ErrorPage>
      );
    }
  }
}

NotePageMain.propTypes = {
  onDeleteNote: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  modified: PropTypes.string,
};

NotePageMain.defaultProps = {
  match: {
    params: {},
  },
};
