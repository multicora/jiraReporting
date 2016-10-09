
document.addEventListener('DOMContentLoaded', function() {
  var jiraUrl = 'https://d-source.atlassian.net';
  var printReportBtn = $('#printReportBtn');
  var report = $('.report');
  var usersEl = $('#users');

  // GET /rest/api/latest/user/search?startAt=0&maxResults=1000&username=%
  jQuery.ajax({
    url: jiraUrl + '/rest/api/latest/user/search?startAt=0&maxResults=1000&username=%',
    success: function(res) {
      var users = res.filter(function (user) {
        return user.active && user.emailAddress !== 'noreply@mailer.atlassian.com';
      });
      usersEl.html('');
      users.forEach(function (user) {
        var userBtn = document.createElement('button');

        userBtn.className = 'user-btn';
        userBtn.innerHTML = 'Print report for ' + user.displayName;
        userBtn.dataset.user = user.key;
        userBtn.addEventListener('click', userBtnClickHandler);
        usersEl.append(userBtn);
      });
    }
  });

  // report.html('Report2');

  function userBtnClickHandler(event) {
    report.html('Loading...');
    config = {
      project: 'cart',
      sprint: $('#sprint').val(),
      user: event.target.dataset.user,
      from: $('#from').val(),
      to: $('#to').val(),
      jiraUrl: jiraUrl
    };
    getReport(config, function (text) {
      report.html(text);
    });
  }
});

