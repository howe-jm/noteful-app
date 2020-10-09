import React from 'react';
import './AddNote.css';
import ApiContext from '../ApiContext';
import cuid from 'cuid';
import ErrorPage from '../ErrorBoundary/ErrorBoundary';
import PropTypes from 'prop-types';

// Here we use a stateful class component because the form validation relies on current state.
export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', // Had to define a default folderId value, which is fine since folders can't (yet) be deleted.
      // Otherwise, new notes couldn't read initial folder value and would POST without it.
      folderId: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
      content: '',
      error: false,
      submitting: false,
      apiError: false,
      apiErrMsg: '',
    };
  }

  // Consuming context from ApiContext provided in App.js
  static contextType = ApiContext;

  // This function handles the submission of the Note form.
  // It sets the error state to false if validation passes and passes data to API function.
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ error: false });
    this.postFormToApi(this.state);
  };

  // Function handles submitting form data to API and processing results or errors.
  postFormToApi = (obj) => {
    // Set the submitting state to true to display feedback after the user submits the form.
    this.setState({ submitting: true });
    // API call which was generated by Postman based on tests that resulted in safe, reliable results.

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    // Implemented cuid for object ids, since api id behavior was less than ideal.
    /* In the particular case of adding notes, new notes could be added without issue
       so long as some of the default notes were still stored in the API. Passing a
       blank string for id (or simply not passing id at all) to the API would result
       in a randomly generated id, which worked. However, when all notes were deleted
       from the API and a new note was added, new notes would be added with an id start
       ing with the integer 1. Because the helper function findNote relies on note.id
       being a string, it couldn't find the notes. Rather than change the helper function
       or coercing the integer to a string (assigning ids starting with the single digit 1
       wouldn't be considered safe, as best practices go), I implemented CUID to generate
       better ids, and pushed those to the API, solving the issue. */
    urlencoded.append('id', `${cuid()}`);
    urlencoded.append('name', `${obj.name}`);
    urlencoded.append('modified', `${new Date().toISOString()}`);
    // The 'modified' time in the default objects uses ISO-8601, though the client only displays the date.
    urlencoded.append('folderId', `${obj.folderId}`);
    urlencoded.append('content', `${obj.content}`);

    const requestOptions = { method: 'POST', headers: myHeaders, body: urlencoded, redirect: 'follow' };

    fetch('http://localhost:9090/notes/', requestOptions)
      // Then statements based on previous code. If the API query responds inappropriately, catch  the error and set the apiError state and apiErrMsg state appropriately.
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      // Context from App.js - runs App.js function handleAddNote, which updates the local state.
      .then((res) => {
        this.context.addNote(res);
      })
      // Upon submission of a folder, the page doesn't need to stay on the folder submit form, so root view is pushed to the end of props.history, sending the user to main page.
      .then(() => this.props.history.push(`/`))
      // Error handling, so the rendered jsx displays appropriate feedback on any errors.
      .catch((error) => this.setState({ submitting: false, apiError: true, apiErrMsg: `${error}` }));
  };
  // Feedback for form validation. While we check that the fields aren't empty elsewhere, we call back to this method to provide feedback to the user.
  validateForm = () => {
    const { name, content } = this.state;
    if ((!name || name === '') && (!content || content === '')) {
      return 'Note name and content must be completed!';
    } else if (!name || name === '') {
      return 'Note name must be completed!';
    } else if (!content || content === '') {
      return 'Note content must be completed!';
    }
  };

  render() {
    const { error, submitting, apiError, apiErrMsg, name, content, folderId } = this.state;
    if (this.context.folders) {
      var options = this.context.folders.map((folder) => {
        return (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        );
      });
    }

    return (
      <ErrorPage>
        <div className='add-note-form'>
          <h2 className='add-form-title'>Add Note</h2>
          {/* Basic form validation. We only want to make sure the form isn't empty in this case. If empty, we set the error state. */}
          <form className='form-body' onSubmit={!name || name === '' || (!content || content === '') ? this.setState({ error: true }) : this.handleSubmit}>
            <div className='form-div'>
              <label>
                Note Name
                <div>
                  {/* Once the user starts typing, we can clear the error state for now. */}
                  <input className='note-submit-inputs' value={name} type='text' name='notename' onChange={(event) => this.setState({ error: false, name: event.target.value })} />
                </div>
              </label>
            </div>
            <div className='form-div'>
              <label>
                Folder
                <div>
                  {/* Once the user interacts with the drop-down menu, we can clear the error state for now. */}
                  <select value={folderId} name='notefolder' onChange={(event) => this.setState({ error: false, folderId: event.target.value })}>
                    {options}
                  </select>
                </div>
              </label>
            </div>
            <div className='form-div'>
              <label>
                Note Content
                <div>
                  {/* Once the user starts typing, we can clear the error state for now. */}
                  <textarea className='note-submit-content' value={content} onChange={(event) => this.setState({ error: false, content: event.target.value })} />
                </div>
              </label>
            </div>
            <div className='note-submit-button'>
              <input type='submit' value='Submit' />
            </div>
            {/* Two sets of conditional statements: The first (ternary) displays feedback that the form is being submitted. If the API returns an error, the error is displayed.
                The second (conditional render) statement checks for validation error state and displays an error message if the user tried to submit without entering a name.
                
                Undefined is good. We want to return undefined! Or maybe null. Null would also be fine. Anything falsy, really, is just fantastic right in this particular spot.*/}
            {submitting ? <h2 className='loading-text'>Submitting...</h2> : apiError ? <h2 className='error-text'>Error: {apiErrMsg}</h2> : undefined}
            {error && <p className='error-text'>{this.validateForm()}</p>}
          </form>
        </div>
      </ErrorPage>
    );
  }
}

// I still have no idea (right at the moment) if I'm doing this right.
AddNote.propTypes = {
  history: PropTypes.object,
  context: PropTypes.shape({
    match: PropTypes.object,
    folders: PropTypes.object,
  }),
};

AddNote.defaultProps = {
  history: {},
  context: {
    match: {},
    folders: {},
  },
};
