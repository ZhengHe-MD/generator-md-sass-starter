var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
  prompting: function() {
    return this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Your project name',
      default: this.appname // Default to the current folder name
    }, {
      type: 'input',
      name: 'authorName',
      message: 'Your name'
    }]).then(function(answers) {
      this.projectName = answers.projectName.toLowerCase();
      this.authorName = answers.authorName;
    }.bind(this));
  },

  // copy templates
  configuring: function() {
    this.fs.copy(
      this.templatePath('./assets/**'),
      this.destinationPath('./assets/')
    );
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('./.gitignore')
    );
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('./index.html')
    );
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('./package.json'),
      {
        projectName: this.projectName,
        authorName: this.authorName
      }
    );
  },

  install: function() {
    this.npmInstall(
      [
        'grunt',
        'grunt-contrib-compass',
        'grunt-contrib-watch',
      ],
      { 'saveDev': true }
    );
  },

  writing: function() {
    var compassConfig = {
      dev: {
        options: {
          sassDir: 'assets/sass',
          cssDir: 'assets/css'
        }
      },
      dist: {
        options: {
          sassDir: 'assets/sass',
          cssDir: 'assets/css',
          environment: 'production'
        }
      }
    };

    var watchConfig = {
      sass: {
        files: ['assets/sass/**/*.sass', 'assets/sass/**/*.scss'],
        tasks: ['compass']
      },
      html: {
        files: ['./index.html', './assets/index.css'],
        options: {
          livereload: true
        }
      }
    };

    this.gruntfile.insertConfig('compass', JSON.stringify(compassConfig));
    this.gruntfile.insertConfig('watch', JSON.stringify(watchConfig));

    this.gruntfile.loadNpmTasks(['grunt-contrib-compass', 'grunt-contrib-watch']);
    this.gruntfile.registerTask('default', ['compass', 'watch']);
  }
})
