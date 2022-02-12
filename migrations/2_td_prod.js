const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20 = artifacts.require("DummyToken.sol"); 
var evaluator = artifacts.require("Evaluator.sol");
var myERC20 = artifacts.require("myERC20.sol");
var exerciceSolution = artifacts.require("ExerciceSolution.sol");

const account = "0x3Ab484E75884b42AD86BE388D04b7B3208a5c6cD"

module.exports = (deployer, network, accounts) => {
    if (network != "rinkeby") return 
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts); 
		await makeExercice(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.at("0xc2269af51350796aF4F6D52e4736Db3A885F28D6")
	dummyToken = await ERC20.at("0xbc3b69d1abD5A39f55a9Ba50C7a2aDd933952123")
	uniswapV2FactoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"
	wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab"
    uniswapV2Router = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.at("0x89a2Faa44066e94CE6B6D82927b0bbbb8709eEd7")
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("dummyToken " + dummyToken.address)
	console.log("Evaluator " + Evaluator.address)
} 

async function deployMyERC20(deployer, network, accounts, ticker, supply) {
	// MyERC20 = await myERC20.new(ticker, ticker, supply)
    MyERC20 = await myERC20.at("0x4C0c42390E8206409CdE684DA4fd1A13dABF9E49")
	console.log("My ERC20 " + MyERC20.address)
}

async function deploySolution(deployer, network, accounts) {
	ExerciceSolution = await exerciceSolution.new(TDToken.address, MyERC20.address, dummyToken.address, uniswapV2Router)
    // ExerciceSolution = await exerciceSolution.at("0x6e0eCd6F4e23Fa438C0db69349F37F8c830a456D")
	console.log("Exercice Solution " + ExerciceSolution.address)
}

async function makeExercice(deployer, network, accounts) {
	
	const initialSupply = await TDToken.balanceOf(account)
	console.log("initialSupply " + initialSupply)

	// console.log("========== Exercice 1 ==========")
	// await Evaluator.ex1_showIHaveTokens({from: account})
	// const balance_ex1 = await TDToken.balanceOf(account)
	// console.log("balance_ex1 " + balance_ex1)

	// console.log("========== Exercice 2 ==========")
	// await Evaluator.ex2_showIProvidedLiquidity({from: account})
	// const balance_ex2 = await TDToken.balanceOf(account)
	// console.log("balance_ex2 " + balance_ex2)

	// console.log("========== Exercice 6a ==========")
	// await Evaluator.ex6a_getTickerAndSupply({from: account})
	// const ticker = await Evaluator.readTicker(account)
	// const supply = await Evaluator.readSupply(account)
	// console.log("ticker " + ticker)
	// console.log("supply " + supply)
	// const balance_ex6a = await TDToken.balanceOf(account)
	// console.log("balance_ex6a " + balance_ex6a)

	// console.log("========== Exercice 6b ==========")
	await deployMyERC20(deployer, network, accounts/*, ticker, supply*/)
	// await Evaluator.submitErc20(MyERC20.address, {from: account})
	// await Evaluator.ex6b_testErc20TickerAndSupply({from: account})
	// const balance_ex6b = await TDToken.balanceOf(account)
	// console.log("balance_ex6b " + balance_ex6b)

	// console.log("========== Exercice 7 ==========")
	// await Evaluator.ex7_tokenIsTradableOnUniswap({from: account})
	// const balance_ex7 = await TDToken.balanceOf(account)
	// console.log("balance_ex7 " + balance_ex7)

	console.log("========== Exercice 8 ==========")
	await deploySolution(deployer, network, accounts)
	await Evaluator.submitExercice(ExerciceSolution.address, {from: account})
    console.log('Exercice submitted')
	// Send some tokens to the contract
    await MyERC20.transfer(ExerciceSolution.address, 1000000, {from: account})
    console.log('Tokens sent')

    await Evaluator.ex8_contractCanSwapVsEth({from: account})
    const balance_ex8 = await TDToken.balanceOf(account)
    console.log("balance_ex8 " + balance_ex8)

    console.log("========== Exercice 9 ==========")
    await Evaluator.ex9_contractCanSwapVsDummyToken({from: account})
    const balance_ex9 = await TDToken.balanceOf(account)
    console.log("balance_ex9 " + balance_ex9)

    console.log("========== Exercice 10 ==========")
    await Evaluator.ex10_contractCanProvideLiquidity({from: account})
    const balance_ex10 = await TDToken.balanceOf(account)
    console.log("balance_ex10 " + balance_ex10)

    console.log("========== Exercice 11 ==========")
    await Evaluator.ex11_contractCanWithdrawLiquidity({from: account})
    const balance_ex11 = await TDToken.balanceOf(account)
    console.log("balance_ex11 " + balance_ex11)
}