var app = {
  init: function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/javascript");
  }
}

$(document).ready(function() {
  app.init();
});
