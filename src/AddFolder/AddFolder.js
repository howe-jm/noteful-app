import React from 'react';
import './AddFolder.css';
import ApiContext from '../ApiContext';
import cuid from 'cuid';

export default class AppFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', error: false };
  }

  static contextType = ApiContext;

  handleSubmit = (event) => {
    event.preventDefault();
    this.postFormToApi(this.state.value);
  };
  postFormToApi = (name) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('id', `${cuid()}`);
    urlencoded.append('name', `${name}`);

    const requestOptions = { method: 'POST', headers: myHeaders, body: urlencoded, redirect: 'follow' };

    fetch('http://localhost:9090/folders/', requestOptions)
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((res) => {
        this.context.addFolder(res);
      })
      .then(() => this.props.history.push(`/`))
      .catch((error) => {
        console.error({ error });
      });
  };

  formErrorState = (event) => {
    event.preventDefault();
    this.setState({ error: true });
  };

  render() {
    return (
      <div className='add-folder-form'>
        <h2 className='add-form-title'>Add Folder</h2>
        <form onSubmit={!this.state.value || this.state.value === '' ? this.formErrorState : this.handleSubmit}>
          <label>
            Folder Name
            <div>
              <input type='text' name='name' onChange={(event) => this.setState({ value: event.target.value })} />
            </div>
          </label>
          <div>
            <input type='submit' value='Submit' />
          </div>
          {this.state.error && <p className='error-text'>Folder must have a name!</p>}
        </form>
      </div>
    );
  }
}
