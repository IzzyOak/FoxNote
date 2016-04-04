var React = require('react'),
    NoteStore = require('../../stores/note'),
    NotesApi = require('../../utils/notes_util'),
    NotebookStore = require('../../stores/notebook');

var NoteView = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      note: NoteStore.find(this.props.params.noteId),
      notebooks: NotebookStore.all()
    };
  },

  componentDidMount: function() {
    this.noteListener = NoteStore.addListener(this._noteChange);
    this.notebookListener = NotebookStore.addListener(this._notebookChange);
    NotesApi.fetchSingleNote(this.props.params.noteId);
  },

  componentWillUnmount: function() {
    this.noteListener.remove();
    this.notebookListener.remove();
  },

  composeNote: function() {
    var note = NoteStore.find(this.props.params.noteId);
    if (!note) {return;}
    this.setState({
      title: note.title,
      body: note.body,
      notebook_id: note.notebook_id
    });
  },

  _noteChange: function () {
    this.composeNote();
  },
  _notebookChange: function() {
    this.setState({notebooks: NotebookStore.all()});
  },

  handleBodyChange: function(e) {
    this.setState({body:e.target.value});
  },

  handleTitleChange: function(e) {
    this.setState({title:e.target.value});
  },

  componentWillReceiveProps: function(newProps) {
    NotesApi.fetchSingleNote(newProps.params.noteId);
  },

  handleSubmit: function(e) {
    e.preventDefault();
    NotesApi.updateNote(this.state, function (newNoteId) {
        this.context.router.push("/home/" + newNoteId);
    }.bind(this));
  },

  render: function() {
    return (
      <form className='note-form' onSubmit={this.handleSubmit}>
              <input
                  htmlFor="title"
                  className='note-form-title'
                  type='text'
                  placeholder='Title'
                  value={this.state.title}
                  onChange={this.handleTitleChange} />
              <textarea
                  htmlFor="body"
                  className='note-form-body'
                  type='text'
                  value={this.state.body}
                  placeholder='just start typing...'
                  onChange={this.handleBodyChange}
                   />
              <input
                  className='note-form-submit'
                  type='submit'
                  value='Edit Your Note' />
          </form>
    );
  }
});

module.exports = NoteView;
