import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import PageNotFound from '../PageNotFound/PageNotFound';
import ApiContext from '../ApiContext';
import config from '../config';
import './App.css';
import ErrorPage from '../ErrorBoundary/ErrorBoundary';

export default class App extends Component {
  state = {
    notes: [],
    folders: [],
    loading: false,
    timeout: false,
    error: false,
    errorMsg: '',
  };

  componentDidMount() {
    // Added some loading feedback.
    this.setState({ loading: true });
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`),
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok) return notesRes.json().then((e) => Promise.reject(e));
        if (!foldersRes.ok) return foldersRes.json().then((e) => Promise.reject(e));

        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders });
        this.setState({ loading: false });
      })
      // Added some error feedback. This sets the error state and defines the error message to be called up later.
      .catch((error) => {
        this.setState({ loading: false, error: true, errorMsg: `${error}` });
      });
  }
  // Local updates to state so we can trigger a re-render after doing stuff, like...

  // Deleting notes!
  handleDeleteNote = (noteId) => {
    this.setState({
      notes: this.state.notes.filter((note) => note.id !== noteId),
    });
  };

  // Adding folders!
  handleAddFolder = (res) => {
    this.setState({ folders: [...this.state.folders, res] });
  };

  // Adding notes!
  handleAddNote = (res) => {
    this.setState({ notes: [...this.state.notes, res] });
  };

  // Implemented Switch and a fallback component so we can't just go around typing in random folder names and get blank pages.
  renderNavRoutes() {
    return (
      <>
        <Switch>
          {['/', '/folder/:folderId'].map((path) => (
            <Route exact key={path} path={path} component={NoteListNav} />
          ))}
          <Route path='/note/:noteId' component={NotePageNav} />
          <Route path='/add-folder' component={NotePageNav} />
          <Route path='/add-note' component={NotePageNav} />
          <Route component={NotePageNav} />
        </Switch>
      </>
    );
  }
  // Implemented Switch and a fallback component so we can't just go around typing in random note names and get blank pages.
  renderMainRoutes() {
    return (
      <>
        <Switch>
          {['/', '/folder/:folderId'].map((path) => (
            <Route exact key={path} path={path} component={NoteListMain} />
          ))}
          <Route path='/note/:noteId' component={NotePageMain} />
          <Route path='/add-folder' component={AddFolder} />
          <Route path='/add-note' component={AddNote} />
          <Route component={PageNotFound} />
        </Switch>
      </>
    );
  }

  render() {
    // Values for the context provider - data and functions that other components will need to use and reference.
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.handleDeleteNote,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
    };
    const { loading, error, errorMsg } = this.state;
    return (
      <ErrorPage>
        <ApiContext.Provider value={value}>
          <div className='App'>
            {/* Here's a little logic that will give the user feedback when loading from the API, as well as when we get an error. Originally, 
            we were just blindly running renderNavRoutes whether the API fetch was successful or not. It was not pretty.*/}
            <nav className='App__nav'>
              {loading ? (
                <h2 className='loading-text'>Loading...</h2>
              ) : error ? (
                <h2 className='loading-text'>Error: {errorMsg}</h2>
              ) : (
                this.renderNavRoutes()
              )}
            </nav>
            <header className='App__header'>
              <h1>
                <Link to='/'>Noteful</Link> <FontAwesomeIcon icon='check-double' />
              </h1>
            </header>
            {/* Same thing we did for renderNavRoutes. If we wanted to, we could put pretty loading animation components in, but we're just using text for now. */}
            <main className='App__main'>
              {loading ? (
                <h2 className='loading-text'>Loading...</h2>
              ) : error ? (
                <h2 className='loading-text'>Error: {errorMsg}</h2>
              ) : (
                this.renderMainRoutes()
              )}
            </main>
          </div>
        </ApiContext.Provider>
      </ErrorPage>
    );
  }
}
