import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { promises as fs,readFileSync } from 'fs';

export async function run() {

  const token = getInput("gh-token");
  const label = getInput("label");
  const variables = getInput("variables");
  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  try {

    if (!pullRequest) {
      throw new Error("This action can only be run on Pull Requests");
    }


    const variables_instance: Variables = JSON.parse(variables)
    console.log(variables_instance)

    writeOff(variables_instance)
    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest?.number??0,
      labels: [label],
    });

  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

const writeOff = async (variable:Variables): Promise<void> => {

  var formatted: string[] = [];
  const header = readFileSync(variable.header, 'utf-8');
  formatted.push(header);


  variable.trala?.forEach(trala => {
     formatted.push(`${trala.type} = """`);
     const file = readFileSync(trala.path, 'utf-8');
     formatted.push( file.substring(file.indexOf(trala?.index)));
     formatted.push( `"""`);
  });

  const footer = readFileSync(variable.footer, 'utf-8');
  formatted.push( footer);

  formatted.forEach(data => {
 console.log(data)
});

}

if (!process.env.JEST_WORKER_ID) {
  run();
}


export interface Variables {
  header: string;
  footer: string;
  trala?:  Trala[];
}

export interface Trala {
  type:  string;
  path:  string;
  index: string;
}
