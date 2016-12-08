
document.addEventListener('DOMContentLoaded', function() {
  var jiraUrl = 'https://d-source.atlassian.net';
  var printReportBtn = $('#printReportBtn');
  var report = $('.report');
  var usersEl = $('#users');

  getProjects(jiraUrl)
    .then(fillProjects)
    .then(function () {
      return getUsers(jiraUrl);
    }).then(fillUsers);

  function projectBtnClickHandler(event) {
    var key = event.target.dataset.key;
    console.log(key);
  }

  function fillUsers(res) {
    var project = $('#projects');
    var from = $('#from');
    var to = $('#to');
    var users = res.filter(function (user) {
      return user.active && user.emailAddress !== 'noreply@mailer.atlassian.com';
    });

    usersEl.html('');
    users.forEach(function (user) {
      var userBtn = document.createElement('button');

      userBtn.className = 'user-btn';
      userBtn.innerHTML = user.displayName;
      userBtn.dataset.user = user.key;
      userBtn.addEventListener('click', userBtnClickHandler);
      usersEl.append(userBtn);
    });

    project.val( localStorage.getItem('jrp.project') );
    from.val( localStorage.getItem('jrp.from') );
    to.val( localStorage.getItem('jrp.to') );

    return;
  }

  function fillProjects(projects) {
    var element = $('#projects');

    element.html('');
    projects.forEach(function (item) {
      var option = document.createElement('option');

      option.innerHTML = item.name;
      option.value = item.key;
      element.append(option);
    });
    return;
  }

  function userBtnClickHandler(event) {
    var project = $('#projects');
    var from = $('#from');
    var to = $('#to');

    localStorage.setItem('jrp.project', project.val());
    localStorage.setItem('jrp.from', from.val());
    localStorage.setItem('jrp.to', to.val());

    report.html('Loading...');
    config = {
      project: project.val(),
      user: event.target.dataset.user,
      from: from.val(),
      to: to.val(),
      jiraUrl: jiraUrl
    };
    getReport(config, function (text) {
      report.html(text);
    });
  }

});

