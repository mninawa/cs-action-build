"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core_1 = require("@actions/core");
const fs_1 = require("fs");
async function run() {
    const token = (0, core_1.getInput)("gh-token");
    const label = (0, core_1.getInput)("label");
    const configs = (0, core_1.getInput)("variables");
    const target = (0, core_1.getInput)("target");
    try {
        const variables_instance = JSON.parse((0, fs_1.readFileSync)(configs, 'utf-8'));
        writeOff(variables_instance, target);
    }
    catch (err) {
        if (err instanceof Error) {
            return {
                message: `Things exploded (${err.message} ${err.stack})`,
            };
        }
    }
}
exports.run = run;
const writeOff = async (variable, target) => {
    var _a;
    var formatted = [];
    const header = (0, fs_1.readFileSync)(variable.header, 'utf-8');
    formatted.push(header);
    formatted.push("\n");
    formatted.push("transformations { ");
    (_a = variable.trala) === null || _a === void 0 ? void 0 : _a.forEach(trala => {
        formatted.push(`${trala.type} = """`);
        const file = (0, fs_1.readFileSync)(trala.path, 'utf-8');
        formatted.push(file.substring(file.indexOf(trala === null || trala === void 0 ? void 0 : trala.index)));
        formatted.push(`"""`);
    });
    const footer = (0, fs_1.readFileSync)(variable.footer, 'utf-8');
    formatted.push(footer);
    const others = formatted.join("\n");
    formatted.push(" } ");
    (0, fs_1.writeFileSync)(target, others, 'utf8');
    console.log(others);
};
if (!process.env.JEST_WORKER_ID) {
    run();
}
