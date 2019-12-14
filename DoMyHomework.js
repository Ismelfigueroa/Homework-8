const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require('html-pdf');

class DoMyHomework {
  constructor() {
    this.githubUserName = null;
    this.color = null;
  }

  promptUser() {
    return inquirer.prompt([
      {
        message: 'What is your user name',
        name: 'githubUserName'
      }
    ]).then(({ githubUserName }) => {
      this.githubUserName = githubUserName;
      this.makeApiRequest();
    })
  }

  makeApiRequest() {
    return Promise.all(
      [
        axios.get(`https://api.github.com/users/${this.githubUserName}`),
        //axios.get(`https://api.github.com/users/${this.location}`),
        axios.get(`https://api.github.com/users/${this.githubUserName}/starred`)
      ])
      .then((
        [
          {
            data:
            {
              avatar_url,
              location,
              name,
              blog,
              bio,
              public_repos,
              followers,
              following
            }
          },
          {
            data:
            {
              length
            }
          }
        ]
      ) => {
        this.avatar_url = avatar_url;
        this.location = location;
        this.name = name;
        this.blog = blog;
        this.bio = bio;
        this.public_repos = public_repos;
        this.followers = followers;
        this.following = following;
        this.stars = length;
        console.log(this);
        this.createHtml();
      })
  }

  createHtml() {
    this.html = 
    `</head>
    <body>
    <header>
    <div class="wrapper">
      <div class="photo-header">
        <img src="${this.avatar_url}"><br>
        <h1>Hi!</h1>
        <h2>My name is ${this.name}</h2>
    <nav class="links-nav">
    <a class="nav-link" href="">${this.location}</a>
    <a class="nav-link" href="https://github.com/${this.githubUserName}">github</a>
      <a class="nav-link" href="${this.blog}">blog</a>
    </nav>
    </header>
    <div class="container">
    <div class="row">
    <div class="col">
    <h4>${this.bio}</h4>
    </div>
    </div>
    <div class="row">
    <dive class="col card">
    <h1>Public repositories: </h1>
    <p>${this.public_repos}</p>
    </div>
    <div class="col card">
    <h2>Followers:</h2>
    ${this.followers}
    </div>
    </div>
    <div class="row">
    <div class="card col"
    <h2>Stars:</h2>
    ${this.stars}
    </div>
    <div class="card col">
    <h2>Following:</h2>
    ${this.following}
    </div>
    </div>
    </div>
    </body>
    </html>`
    ;
    console.log(this);
    this.createPdf();
  }

  createPdf() {
    pdf.create(this.html).toFile('./class-test.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  }

}

var newHomework = new DoMyHomework();
newHomework.promptUser();