var app = {

  init: function() {
    this.initEditors();
    this.listenForChanges();
  },

  editors: {
    html: {},
    css: {},
    javascript: {}
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
    // When HTML gets saved
    $('#refresh').on('click', function(){

      // Update the immediate frame
      $("#result").contents().find('html').html(app.editors.html.getValue());
      $("#result").contents().find('head').append('<style id="user-css">' + app.editors.css.getValue() + '</style>');
      $("#result").contents().find('head').append('<script id="user-js">' + app.editors.javascript.getValue() + '</script>');

      // Update the real shit
      $.post("save", {
        fullDOM : $("#result").contents().find('html')[0].outerHTML,
        subdomain: $('#site-subdomain').val(),
        editorCode: {
          html: app.editors.html.getValue(),
          css: app.editors.css.getValue(),
          js: app.editors.javascript.getValue()
        }
      }, function(data) {
        console.log(data);
      });

    });
  }

}

$(document).ready(function() {
  app.init();
});
