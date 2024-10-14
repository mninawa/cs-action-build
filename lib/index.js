"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const fs_1 = require("fs");
async function run() {
    var _a, _b;
    const token = (0, core_1.getInput)("gh-token");
    const label = (0, core_1.getInput)("label");
    const variables = (0, core_1.getInput)("variables");
    const target = (0, core_1.getInput)("target");
    const octokit = (0, github_1.getOctokit)(token);
    const pullRequest = github_1.context.payload.pull_request;
    try {
        if (!pullRequest) {
            throw new Error("This action can only be run on Pull Requests");
        }
        const variables_instance = JSON.parse(variables);
        console.log(variables_instance);
        writeOff(variables_instance, target);
        await octokit.rest.issues.addLabels({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            issue_number: (_a = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.number) !== null && _a !== void 0 ? _a : 0,
            labels: [label],
        });
    }
    catch (error) {
        (0, core_1.setFailed)((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown error");
    }
}
exports.run = run;
const writeOff = async (variable, target) => {
    var _a;
    var formatted = [];
    const header = (0, fs_1.readFileSync)(variable.header, 'utf-8');
    formatted.push(header);
    (_a = variable.trala) === null || _a === void 0 ? void 0 : _a.forEach(trala => {
        formatted.push(`${trala.type} = """`);
        const file = (0, fs_1.readFileSync)(trala.path, 'utf-8');
        formatted.push(file.substring(file.indexOf(trala === null || trala === void 0 ? void 0 : trala.index)));
        formatted.push(`"""`);
    });
    const footer = (0, fs_1.readFileSync)(variable.footer, 'utf-8');
    formatted.push(footer);
    formatted.forEach(data => {
        console.log(data);
        (0, fs_1.writeFileSync)(target, data);
    });
};
if (!process.env.JEST_WORKER_ID) {
    run();
}
