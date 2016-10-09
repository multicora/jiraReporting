function getReport(config, cb) {
  var project = config.project,
    sprint = config.sprint,
    user = config.user,
    from = config.from,
    to = config.to,
    // from = config.from.getFullYear() + '-' (config.from.getMonth() + 1) + '-' + config.from.getDate(),
    // to = config.to.getFullYear() + '-' (config.to.getMonth() + 1) + '-' + config.to.getDate(),
    jiraUrl = config.jiraUrl;

  var date = "2016-05-23",
    workLogs = [],
    timeSpentSeconds = 0,
    issuesNumber = 0,
    logTxt = '';

  jQuery.ajax({
    url: jiraUrl + '/rest/api/2/search',
    data: {
      "jql": 'project = ' + project + ' AND worklogAuthor = ' + user + ' and Sprint = ' + sprint + ' AND worklogDate >= "' + from + '" AND worklogDate <= "' + to + '"',
      "startAt": 0,
      "maxResults": 50
    },
    success: function(res) {
      // console.log(res);
      if (res.issues.length === 0) {
        cb ? cb('No issues') : console.log('No issues');
      } else {
        res.issues.forEach(function (issue) {
          issuesNumber++;
          jQuery.ajax({
            url: jiraUrl + '/rest/api/2/issue/' + issue.key + '/worklog',
            success: function(res) {
              // console.log(res);

              res.worklogs.forEach(function (log) {
                // console.log(log.timeSpent);
                var started = new Date(log.started),
                  fromDate = new Date(from),
                  toDate = new Date(to);

                started.setHours(0,0,0,0);
                fromDate.setHours(0,0,0,0);
                toDate.setHours(23,59,59,999);

                if (started.getTime() >= fromDate.getTime() && started.getTime() <= toDate.getTime()) {
                  // console.log(issue.key + ': ' + log.timeSpentSeconds / 3600 + 'h;');
                  logTxt += '\n' + issue.key + ': ' + log.timeSpentSeconds / 3600 + 'h;';
                  // console.log(log.timeSpentSeconds);
                  timeSpentSeconds += log.timeSpentSeconds;
                }
              });

              issuesNumber--;

              if (issuesNumber == 0) {
                logTxt += '\n' + 'Time spent (' + from + ' - ' + to + '): ' + timeSpentSeconds / 3600 + 'h';
                cb ? cb(logTxt) : console.log(logTxt);
              }
            }
          });

          // console.log(issue.fields)
        });
      }
    }
  });
}