"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileContract = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const solc_1 = __importDefault(require("solc"));
const R = __importStar(require("ramda"));
const getContractSourceCodeFor = (contractName) => {
    const runFromDistFolder = __dirname.includes("dist");
    const ifRunFolderPathOneLevelDown = runFromDistFolder ? [".."] : [];
    const inboxPath = (0, path_1.resolve)(__dirname, ...ifRunFolderPathOneLevelDown, "contracts", contractName.toLowerCase(), `${contractName}.sol`);
    return (0, fs_1.readFileSync)(inboxPath, "utf8");
};
const startCompilationFor = (contractName) => {
    const compileConfigBase = {
        language: "Solidity",
        sources: {},
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    };
    const compileConfigWithSourceCode = R.assocPath(["sources", `${contractName}.sol`, "content"], getContractSourceCodeFor(contractName), compileConfigBase);
    return JSON.parse(solc_1.default.compile(JSON.stringify(compileConfigWithSourceCode)));
};
const compileContract = (contractName) => {
    console.log(`Compiling ${contractName}...`);
    const { contracts, errors } = startCompilationFor(contractName);
    if (errors)
        console.log(`${contractName} compiled with errors:\n`, errors);
    else
        console.log(`${contractName} compiled with no error!\n`);
    return contracts[`${contractName}.sol`][contractName];
};
exports.compileContract = compileContract;
//# sourceMappingURL=compile.js.map