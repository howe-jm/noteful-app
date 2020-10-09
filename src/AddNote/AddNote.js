import React from 'react';
import './AddNote.css';
import ApiContext from '../ApiContext';
import cuid from 'cuid';
import ErrorPage from '../ErrorBoundary/ErrorBoundary';
import PropTypes from 'prop-types';

export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      folderId: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
      content: '',
      error: false,
      submitting: false,
      apiError: false,
      apiErrMsg: '',
    };
  }

  static contextType = ApiContext;

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ error: false });
    this.postFormToApi(this.state);
  };

  postFormToApi = (obj) => {
    this.setState({ submitting: true });
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('id', `${cuid()}`);
    urlencoded.append('name', `${obj.name}`);
    urlencoded.append('modified', `${new Date().toISOString()}`);
    urlencoded.append('folderId', `${obj.folderId}`);
    urlencoded.append('content', `${obj.content}`);

    const requestOptions = { method: 'POST', headers: myHeaders, body: urlencoded, redirect: 'follow' };

    fetch('http://localhost:9090/notes/', requestOptions)
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((res) => {
        this.context.addNote(res);
      })
      .then(() => this.props.history.push(`/`))
      .catch((error) => this.setState({ submitting: false, apiError: true, apiErrMsg: `${error}` }));
  };

  formErrorState = (event) => {
    event.preventDefault();
    this.setState({ error: true });
  };

  validateForm = () => {
    if ((!this.state.name || this.state.name === '') && (!this.state.content || this.state.content === '')) {
      return 'Note name and content must be completed!';
    } else if (!this.state.name || this.state.name === '') {
      return 'Note name must be completed!';
    } else if (!this.state.content || this.state.content === '') {
      return 'Note content must be completed!';
    }
  };

  render() {
    const { submitting, apiError, apiErrMsg } = this.state;
    if (!this.context.folders) {
      return (
        <ErrorPage>
          <div className='add-note-form'>
            <p>Error: No Folders Found</p>
          </div>
        </ErrorPage>
      );
    } else {
      const options = this.context.folders.map((folder) => {
        return (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        );
      });

      return (
        <ErrorPage>
          <div className='add-note-form'>
            <h2 className='add-form-title'>Add Note</h2>
            <form className='form-body' onSubmit={!this.state.name || this.state.name === '' || (!this.state.content || this.state.content === '') ? this.formErrorState : this.handleSubmit}>
              <div className='form-div'>
                <label>
                  Note Name
                  <div>
                    <input className='note-submit-inputs' value={this.state.name} type='text' name='notename' onChange={(event) => this.setState({ error: false, name: event.target.value })} />
                  </div>
                </label>
              </div>
              <div className='form-div'>
                <label>
                  Folder
                  <div>
                    <select value={this.state.folderId} name='notefolder' onChange={(event) => this.setState({ error: false, folderId: event.target.value })}>
                      {options}
                    </select>
                  </div>
                </label>
              </div>
              <div className='form-div'>
                <label>
                  Note Content
                  <div>
                    <textarea className='note-submit-content' value={this.state.content} onChange={(event) => this.setState({ error: false, content: event.target.value })} />
                  </div>
                </label>
              </div>
              <div className='note-submit-button'>
                <input type='submit' value='Submit' />
              </div>
              {submitting ? <h2 className='loading-text'>Submitting...</h2> : apiError ? <h2 className='error-text'>Error: {apiErrMsg}</h2> : undefined}
              {this.state.error && <p className='error-text'>{this.validateForm()}</p>}
            </form>
          </div>
        </ErrorPage>
      );
    }
  }
}

AddNote.defaultProps = {
  history: PropTypes.object,
  context: PropTypes.shape({
    match: PropTypes.object,
  }),
};
