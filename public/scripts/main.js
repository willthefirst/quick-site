var app = {

  init: function() {
    this.initEditors();
  },

  // Which editors we will use
  editors: ['html', 'javascript', 'css'],

  // Initializes editor areas with Ace editor
  initEditors: function() {
    var editor;
    for (var i = 0; i < this.editors.length; i++) {
      editor = ace.edit('editor-' + this.editors[i]);
      editor.setTheme("ace/theme/chrome");
      editor.session.setMode("ace/mode/" + this.editors[i]);
    };
  }
}

$(document).ready(function() {
  app.init();
});
