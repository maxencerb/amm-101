pragma solidity ^0.6.0;

import "./utils/IUniswapV2Factory.sol";
import "./utils/IUniswapV2Pair.sol";
import "./myERC20.sol";
import "./utils/IUniswapV2Router.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ExerciceSolution 
{
    IUniswapV2Factory uniswapFactory;
    myERC20 erc20;
    IUniswapV2Pair pair;

    constructor (IUniswapV2Factory _uniswapFactory, myERC20 _erc20) public {
        uniswapFactory = _uniswapFactory;
        erc20 = _erc20;
        // WETH = weth;
        // (address token1, address token2) = address(token) < WETH ? (address(token), WETH) : (WETH, address(token));
        // address _pair = createPair(token1, token2);
        // pair = IUniswapV2Pair(_pair);
    }

    function createPairWithERC20(address token) public returns (address) {
        (address token1, address token2) = address(token) < address(erc20) ? (address(token), address(erc20)) : (address(erc20), address(token));
        return createPair(token1, token2);
    }

    function createPair(address tokenA, address tokenB) public returns (address) {
        return uniswapFactory.createPair(tokenA, tokenB);
    }

    function TransferToken(address _token, uint _amount) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    }

	function addLiquidity() external {

    }

	function withdrawLiquidity() external;

	function swapYourTokenForDummyToken() external;

	function swapYourTokenForEth() external;
}
