// Generated by CoffeeScript 1.10.0
(function() {
  var CreateFileError, ExternalEditor, FS, LaunchEditorError, ReadFileError, RemoveFileError, SpawnSync, Temp,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FS = require('fs');

  Temp = require('temp');

  SpawnSync = require('spawn-sync');

  CreateFileError = require('./errors/CreateFileError');

  ReadFileError = require('./errors/ReadFileError');

  RemoveFileError = require('./errors/RemoveFileError');

  LaunchEditorError = require('./errors/LaunchEditorError');

  ExternalEditor = (function() {
    ExternalEditor.edit = function(text) {
      var editor;
      if (text == null) {
        text = '';
      }
      editor = new ExternalEditor(text);
      editor.run();
      editor.cleanup();
      return editor.text;
    };

    ExternalEditor.CreateFileError = CreateFileError;

    ExternalEditor.ReadFileError = ReadFileError;

    ExternalEditor.RemoveFileError = RemoveFileError;

    ExternalEditor.LaunchEditorError = LaunchEditorError;

    ExternalEditor.prototype.text = '';

    ExternalEditor.prototype.temp_file = void 0;

    ExternalEditor.prototype.editor = {
      bin: void 0,
      args: []
    };

    function ExternalEditor(text1) {
      this.text = text1 != null ? text1 : '';
      this.launchEditor = bind(this.launchEditor, this);
      this.removeTemporaryFile = bind(this.removeTemporaryFile, this);
      this.readTemporaryFile = bind(this.readTemporaryFile, this);
      this.createTemporaryFile = bind(this.createTemporaryFile, this);
      this.determineEditor = bind(this.determineEditor, this);
      this.cleanup = bind(this.cleanup, this);
      this.run = bind(this.run, this);
      this.determineEditor();
      this.createTemporaryFile();
    }

    ExternalEditor.prototype.run = function() {
      this.launchEditor();
      return this.readTemporaryFile();
    };

    ExternalEditor.prototype.cleanup = function() {
      return this.removeTemporaryFile();
    };

    ExternalEditor.prototype.determineEditor = function() {
      var args, ed, editor;
      ed = /^win/.test(process.platform) ? 'notepad' : 'vim';
      editor = process.env.VISUAL || process.env.EDITOR || ed;
      args = editor.split(/\s+/);
      this.bin = args.shift();
      return this.args = args;
    };

    ExternalEditor.prototype.createTemporaryFile = function() {
      var e, error;
      try {
        this.temp_file = Temp.path();
        return FS.writeFileSync(this.temp_file, this.text);
      } catch (error) {
        e = error;
        throw new CreateFileError(e);
      }
    };

    ExternalEditor.prototype.readTemporaryFile = function() {
      var e, error;
      try {
        return this.text = FS.readFileSync(this.temp_file).toString();
      } catch (error) {
        e = error;
        throw new ReadFileError(e);
      }
    };

    ExternalEditor.prototype.removeTemporaryFile = function() {
      var e, error;
      try {
        return FS.unlinkSync(this.temp_file);
      } catch (error) {
        e = error;
        throw new RemoveFileError(e);
      }
    };

    ExternalEditor.prototype.launchEditor = function() {
      var e, error;
      try {
        return SpawnSync(this.bin, this.args.concat([this.temp_file]), {
          stdio: 'inherit'
        });
      } catch (error) {
        e = error;
        throw new LaunchEditorError(e);
      }
    };

    return ExternalEditor;

  })();

  module.exports = ExternalEditor;

}).call(this);