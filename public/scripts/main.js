var app = {

  init: function() {
    this.initEditors();
    this.listenForChanges();
  },

  editors: {
    html: {},
    javascript: {},
    css: {}
  },

  // Initializes editor areas with Ace editor
  initEditors: function() {
    for (var editor in this.editors) {
      this.editors[editor] = ace.edit('editor-' + editor);
      this.editors[editor].setTheme("ace/theme/chrome");
      this.editors[editor].session.setMode("ace/mode/" + editor);
    };
  },

  listenForChanges: function() {
    $('#js-save').on('click', function(){
      $("#result").contents().find('html').html(app.editors.html.getValue());
    });
  }

}

$(document).ready(function() {
  app.init();
});
