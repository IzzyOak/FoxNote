var React = require('react'),
    SessionAPI = require('../../utils/session_util');

var AccountBadge = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },


  getInitialState: function() {
    return {
      email: this.props.user.email,
      image: this.props.user.image
    };
  },

  handleEmailChange: function(e) {
    this.setState({ email: e.currentTarget.value });
  },

  handleFileChange: function(e) {
    // TO DO: HANDLE BAD INPUT LIKE NON-IMAGE FILES
    var file = e.currentTarget.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      var result = reader.result;
      this.setState({ imageFile: file, image: result });
    }.bind(this);

    reader.readAsDataURL(file);
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append("user[email]", this.state.email);
    if (this.state.imageFile) {
      formData.append("user[image]", this.state.imageFile);
    }
    SessionAPI.editUser(formData, this.props.user.id, function() {
      this.props.closeModal();
    }.bind(this));

  },

  logOut: function(e) {
    e.preventDefault();
    SessionAPI.logout();
    this.context.router.push("/");
  },

  render: function () {
    var currentEmail = this.props.user.email;
    return (
      <div className='user-edit-form-container'>
        <div className='user-avatar'>
          <img src={this.state.image} />
        </div>
        <p className='user-email'>{currentEmail}</p>
        <form className='user-edit-form'
              onSubmit={this.handleSubmit} >
          <label>Email
            <input
              className='user-edit-input-text'
              type='text'
              placeholder='Change your e-mail'
              onChange={this.handleEmailChange}
              value={this.state.email}
              />
          </label>
          <label
            htmlFor='user-avatar'
            className='user-upload'>
            <a>Change User Avatar</a>
          </label>
            <input
              name='user-avatar'
              id='user-avatar'
              className='user-edit-input-file'
              type='file'
              onChange={this.handleFileChange}
              />
          <input
            className='user-edit-submit'
            type="submit"
            value="Save Changes"/>
        </form>
        <button className='user-logout'
                onClick={this.logOut}>Log out</button>
      </div>
    );
  }
});

module.exports = AccountBadge;
