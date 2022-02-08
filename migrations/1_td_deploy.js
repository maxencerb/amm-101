const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20 = artifacts.require("DummyToken.sol"); 
var evaluator = artifacts.require("Evaluator.sol");
var myERC20 = artifacts.require("myERC20.sol");
var exerciceSolution = artifacts.require("ExerciceSolution.sol");

const account = "0x3Ab484E75884b42AD86BE388D04b7B3208a5c6cD"

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts); 
		await makeExercice(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-AMM-101","TD-AMM-101",web3.utils.toBN("20000000000000000000000000000"))
	dummyToken = await ERC20.new("dummyToken", "DTK", web3.utils.toBN("2000000000000000000000000000000"))
	uniswapV2FactoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"
	wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab"
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, dummyToken.address, uniswapV2FactoryAddress, wethAddress)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	randomSupplies = []
	randomTickers = []
	for (i = 0; i < 20; i++)
		{
		randomSupplies.push(Math.floor(Math.random()*1000000000))
		randomTickers.push(Str.random(5))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomTickers)
	console.log(randomSupplies)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomTickersAndSupply(randomSupplies, randomTickers);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("dummyToken " + dummyToken.address)
	console.log("Evaluator " + Evaluator.address)
} 

async function deployMyERC20(deployer, network, accounts, ticker, supply) {
	MyERC20 = await myERC20.new(ticker, ticker, supply)
	console.log("My ERC20 " + MyERC20.address)
}

async function deploySolution(deployer, network, accounts) {
	ExerciceSolution = await exerciceSolution.new(TDToken.address, MyERC20.address, wethAddress)
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

	console.log("========== Exercice 6a ==========")
	await Evaluator.ex6a_getTickerAndSupply({from: account})
	const ticker = await Evaluator.readTicker(account)
	const supply = await Evaluator.readSupply(account)
	console.log("ticker " + ticker)
	console.log("supply " + supply)
	const balance_ex6a = await TDToken.balanceOf(account)
	console.log("balance_ex6a " + balance_ex6a)

	console.log("========== Exercice 6b ==========")
	await deployMyERC20(deployer, network, accounts, ticker, supply)
	await Evaluator.submitErc20(MyERC20.address, {from: account})
	await Evaluator.ex6b_testErc20TickerAndSupply({from: account})
	const balance_ex6b = await TDToken.balanceOf(account)
	console.log("balance_ex6b " + balance_ex6b)

	console.log("========== Exercice 7 ==========")
	await deploySolution(deployer, network, accounts)
	const erc20WETHPair = await ExerciceSolution.createPairWithERC20(wethAddress, {from: account})
	await Evaluator.ex7_tokenIsTradableOnUniswap({from: account})
	const balance_ex7 = await TDToken.balanceOf(account)
	console.log("balance_ex7 " + balance_ex7)

	console.log("========== Exercice 8 ==========")
	await Evaluator.submitExercice(ExerciceSolution.address, {from: account})
	






	await ExerciceSolution.createPairWithERC20(dummyToken.address, {from: account})



}