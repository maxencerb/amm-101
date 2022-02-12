pragma solidity ^0.6.0;

import "./utils/IUniswapV2Factory.sol";
import "./utils/IUniswapV2Pair.sol";
import "./myERC20.sol";
import "./utils/IUniswapV2Router.sol";
import "./DummyToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ExerciceSolution 
{
    IUniswapV2Factory uniswapFactory;
    IUniswapV2Router01 uniswapRouter;
    myERC20 erc20;
    DummyToken dtk;
    address WETH;
    mapping(address => mapping(address => bool)) allowed; // (token, spender) => allowed

    constructor (IUniswapV2Factory _uniswapFactory, myERC20 _erc20, DummyToken _dtk, IUniswapV2Router01 router) public {
        uniswapFactory = _uniswapFactory;
        erc20 = _erc20;
        uniswapRouter = router;
        WETH = uniswapRouter.WETH();
        dtk = _dtk;
    }

    function getPair(address tokena, address tokenb) public view returns (IUniswapV2Pair) {
        (address token1, address token2) = address(tokena) < address(tokenb) ? (address(tokena), address(tokenb)) : (address(tokenb), address(tokena));
        return IUniswapV2Pair(uniswapFactory.getPair(token1, token2));
    }

    function approveTransfer(address token, address spender, uint256 amount) private {
        IERC20 tokenContract = IERC20(token);
        tokenContract.approve(spender, amount);
    }

    function approveAllTransfer(address token, address spender) private {
        if(allowed[token][spender]) return;
        IERC20 tokenContract = IERC20(token);
        approveTransfer(token, spender, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        allowed[token][spender] = true;
    }

	function addLiquidity() external {
        // Approve for WETH and erc20
        approveAllTransfer(WETH, address(uniswapRouter));
        approveAllTransfer(address(erc20), address(uniswapRouter));

        uniswapRouter.addLiquidityETH{ value: 1000 }(
            address(erc20), // token address
            1000, // amount
            1, // min tokens
            1, // min ETH
            address(this), // receiver address
            block.timestamp // deadline
        );
    }

	function withdrawLiquidity() external {
        // Approve for WETH and erc20
        approveAllTransfer(WETH, address(uniswapRouter));
        approveAllTransfer(address(erc20), address(uniswapRouter));

        uniswapRouter.removeLiquidityETH(
            address(erc20), // token address
            1000, // amount
            1, // min tokens
            1, // min ETH
            address(this), // receiver address
            block.timestamp // deadline
        );
    }

	function swapYourTokenForDummyToken() external {
        IUniswapV2Pair pair = getPair(address(erc20), address(dtk));
        require(address(pair) != address(0), "pair not found");
        // Create path
        address[] memory path = new address[](2);
        path[0] = address(erc20);
        path[1] = address(dtk);
        // Approve all transfers for erc20
        approveAllTransfer(address(erc20), address(uniswapRouter));
        // swap from router
        uniswapRouter.swapExactTokensForTokens(
            1000, // amount in
            1, // min amount out,
            path, // path
            address(this), // sender
            block.timestamp // deadline
        );
        // pair.swap(1000, 2000, address(this), new bytes(0));
    }

	function swapYourTokenForEth() external {
        // Get the pair
        IUniswapV2Pair pair = getPair(address(erc20), WETH);
        require(address(pair) != address(0), "Pair not found");
        // Create the path
        address[] memory path = new address[](2);
        path[0] = address(erc20);
        path[1] = WETH;

        // Approve uniswap router to spend our erc20 token
        approveAllTransfer(address(erc20), address(uniswapRouter));
        // swap from router
        uniswapRouter.swapExactTokensForTokens(
            1000, // amount in
            1, // min amount out
            path, // path
            address(this), // sender
            block.timestamp // deadline
        );
        // pair.swap(1000, 2000, address(this), new bytes(0));
    }
}
