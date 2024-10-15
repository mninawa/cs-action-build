import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { promises as fs, readFileSync, writeFileSync } from 'fs';

export async function run() {

  const token = getInput("gh-token");
  const label = getInput("label");
  const configs = getInput("variables");
  const target = getInput("target");

  try {

    const variables_instance: Variables = JSON.parse(readFileSync(configs, 'utf-8'))
    writeOff(variables_instance, target)

  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: `Things exploded (${err.message} ${err.stack})`,
      };
    }
  }
}



const writeOff = async (variable: Variables, target: string): Promise<void> => {

  var formatted: string[] = [];
  const header = readFileSync(variable.header, 'utf-8');
  formatted.push(header);


  variable.trala?.forEach(trala => {
    formatted.push(`${trala.type} = """`);
    const file = readFileSync(trala.path, 'utf-8');
    formatted.push(file.substring(file.indexOf(trala?.index)));
    formatted.push(`"""`);
  });

  const footer = readFileSync(variable.footer, 'utf-8');
  formatted.push(footer);

  const others=formatted.join("\n");

  writeFileSync(target, others, 'utf8');
  console.log(others)

  }

if (!process.env.JEST_WORKER_ID) {
  run();
}


export interface Variables {
  header: string;
  footer: string;
  trala?: Trala[];
}

export interface Trala {
  type: string;
  path: string;
  index: string;
}
