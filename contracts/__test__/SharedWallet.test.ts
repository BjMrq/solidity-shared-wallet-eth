import { expect } from "chai";
import ganache from "ganache-core";
import Web3 from "web3";
import { compileContract } from "../../compile";
import solc from "solc";

//@ts-expect-error
const web3 = new Web3(ganache.provider());

const sharedWalletContract = compileContract("SharedWallet")["SharedWallet"];

const setUpContractWithAccounts = async (
  baseContract: solc.CompiledContract
) => {
  const accounts = await web3.eth.getAccounts();

  return {
    accounts,
    organizerAddress: accounts[0],
    participatorsAddresses: accounts.slice(1),
    deployedContract: await new web3.eth.Contract(baseContract.abi as solc.Abi)
      .deploy({
        data: baseContract?.evm?.bytecode.object as string,
      })
      .send({ from: accounts[0], gas: 2000000 }),
  };
};

describe("SharedWallet contract", () => {
  it("can be deployed", async () => {
    const { deployedContract } = await setUpContractWithAccounts(
      sharedWalletContract
    );

    expect(deployedContract.options.address).to.be.a("string");
    expect(deployedContract.options.address).to.have.lengthOf(42);
  });
});
