var rem = require('../..');
var read = require('read');

// Create Github API, prompting for key/secret.
// Authenticate user via the console.
rem.connect('github.com', 3.0).prompt({
  scope: ["user", "repo", "gist"]
}, function (err, user) {

  user.debug = true;

  // List user gists.
  user('user').get(function (err, profile) {
    if (err) return console.error('Error retrieving profile:', err);

    user("users", profile.login, "gists").get(function (err, json) {
      if (err) return console.error('Error fetching gists:', err);

      console.log('Your gists:');
      json.forEach(function (gist) {
        console.log(' -', gist.description)
      });
      console.log('');

      // Create a gist.
      read({ prompt: "Create a new (private) gist with the contents: "}, function (err, text) {
        if (!err) {
          user('gists').post({
            description: 'temp gist',
            public: true,
            files: {
              "rem.txt": {
                content: text
              }
            }
          }, function (err, json) {
            if (err) return console.error('Error creating gist:', err);
          
            // Patch the gist.
            user('gists', json.id).patch({
              description: "A Gist created with Rem. http://github.com/tcr/rem-js"
            }, function (err, json) {
              if (err) return console.error('Error patching gist:', err);

              console.log('Created', json.html_url);
            });

          });
        } else {
          console.error('Skipping.');
        }
      })
    });
  });
});