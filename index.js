const core = require('@actions/core');
const { HttpClient } = require('@actions/http-client');
const { BasicCredentialHandler } = require('@actions/http-client/lib/auth');

async function run() {
  var description = core.getInput('description');
  var date = core.getInput('date');
  const project_id = core.getInput('project_id');
  const service_account_username = core.getInput('service_account_username');
  const service_account_password = core.getInput('service_account_password');

  const http = new HttpClient('http', [
    new BasicCredentialHandler(
      service_account_username, service_account_password,
    ),
  ]);

  const res = await http.post(
    `https://mixpanel.com/api/app/projects/${project_id}/annotations`,
    JSON.stringify({
      'description': description,
      'date': date,
    }),
    {
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
    }
  );

  const obj = JSON.parse(await res.readBody());
  const { status, error } = obj;

  if (status === 'error') return core.setFailed(error);

  var { description, date, id } = obj;
  core.setOutput('description', description);
  core.setOutput('date', date);
  core.setOutput('id', id);
}

run();
