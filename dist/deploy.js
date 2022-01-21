"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
const compile_1 = require("./compile");
const variables_1 = require("./config/variables");
const preSetUp = async (contractName) => {
    const provider = new truffle_hdwallet_provider_1.default(variables_1.mnemonic, variables_1.nodeHTTP);
    const web3 = new web3_1.default(provider);
    return {
        web3,
        contract: (0, compile_1.compileContract)(contractName),
        accounts: await web3.eth.getAccounts(),
    };
};
const deployContract = async (contractName) => {
    const { web3, contract, accounts } = await preSetUp(contractName);
    const { options: { address }, } = await new web3.eth.Contract(contract.abi)
        .deploy({
        data: contract?.evm?.bytecode.object,
        arguments: ["Sup yo!"],
    })
        .send({
        gas: 1000000,
        gasPrice: "5000000000",
        from: accounts[0],
    });
    console.log(`Contract deployed at: ${address}`);
};
deployContract(process.argv[2]);
//# sourceMappingURL=deploy.js.map