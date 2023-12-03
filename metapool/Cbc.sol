// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IERC4626Router.sol";
import "./ERC4626Router.sol";

error Transaction_Failed();
error Order_Incomplete();


contract CBC is ERC4626Router {

    using SafeERC20 for IERC20;
    using SafeERC20 for IERC4626;

    uint256 public constant SERVICEFEE = 2;
    address public mpETH = 0x748c905130CC15b92B97084Fd1eEBc2d2419146f; //0x48AFbBd342F64EF8a9Ab1C143719b63C2AD81710
    address public ETH = 0x9D29f395524B3C817ed86e2987A14c1897aFF849;

    enum TransactionState {
        OPEN,
        IN_PROGRESS,
        COMPLETE
    }

    address public owner; // Dirección del propietario del contrato
    uint256 public balance; // Saldo del contrato
    address public facilitator = 0x9875f61e3F3Bd6F66720b381B245b5d86668886E;
    address public seller = 0x9875f61e3F3Bd6F66720b381B245b5d86668886E;
    address public wpETHToken;
    uint256 public accumulatedFees = 0;
    uint256 public minStakedThreshold = 1 ether;
    uint256 public authorizedStaker = 10**17;

    IERC4626Router private immutable i_metapoolRouter;
    
    //Variables de la interfaz de metapool para hacer Staking
    IERC4626 private immutable i_vault;
    address private immutable i_to;

    address payable private s_partner;
    TransactionState private s_transactionstate;

    // Evento para registrar la transferencia de Ether
    event Deposit(address indexed sender, uint256 amount);
    event OrderComplete(address indexed facilitator, uint256 amount);

    // Constructor para inicializar el contrato
    constructor(
        IERC4626 _vault ,
        address _to
        ) ERC4626Router() {
            i_metapoolRouter = IERC4626Router(0x3750Be57761707e3dEEdAb9F888996F61376fd37); 
            i_vault = _vault; 
            i_to = _to; 
        }

        function startOrder(uint256 _amount) external payable returns (bool confirmation) {
            require(IERC20(mpETH).balanceOf(seller) > authorizedStaker, "Not allowed"); // Revisa que el facilitador tenga un monyo mínimo de 0.1 mpETH en staking para ser autorizado
            require(IERC20(ETH).balanceOf(seller) > _amount, "Insuficient Funds");
            require(IERC20(ETH).approve(seller, _amount));
            require(IERC20(ETH).transferFrom(seller, address(this), _amount), "");
            s_transactionstate = TransactionState.IN_PROGRESS;
            return true;
        }

        function completeOrder(uint256 _amount) external payable returns (bool confirmation) {
            if(s_transactionstate != TransactionState.IN_PROGRESS) {
                revert Transaction_Failed();
            }
            require(IERC20(ETH).transfer(facilitator, (_amount-(_amount*SERVICEFEE/100))), "Transfer failed"); //Transferencia de fondos al facilitador menos la comisión cobrada
            s_transactionstate = TransactionState.COMPLETE;
            return true;
        }

        function stakeRewardPool () public payable {  // Se hace stake en metapool de la pool de rewards disponibles
            if(s_transactionstate != TransactionState.COMPLETE) {
                revert Order_Incomplete();
            }else if(IERC20(mpETH).balanceOf(address(this)) > 1000000000000){
                stakeEth(address(this).balance, (address(this).balance*95/100));
            }
        }

        function distributeRewards() public payable { //Distribución de rewards en mpETH hacia las wallets de la comunidad
            if(s_transactionstate != TransactionState.COMPLETE || s_transactionstate != TransactionState.OPEN) {
                revert Order_Incomplete();
            }
            uint256 amount = IERC20(mpETH).balanceOf(address(this));
            require(amount > 0, "No funds to distribute");
            require(IERC20(mpETH).transfer(facilitator, (amount*40/100)), "Transfer failed");
            require(IERC20(mpETH).transfer(seller, (amount*40/100)), "Transfer failed");
            require(IERC20(mpETH).transfer(facilitator, (amount*10/100)), "Transfer failed");
            require(IERC20(mpETH).transfer(seller, (amount*10/100)), "Transfer failed");
        }

        function withdrawProtocolFunds() public payable { // Sacar los recursos disponibles del protocolo de staking
            if(s_transactionstate != TransactionState.COMPLETE || s_transactionstate != TransactionState.OPEN) {
                revert Order_Incomplete();
            }
            uint256 amount = IERC20(mpETH).balanceOf(address(this));
            require(amount > 0, "No funds to withdraw");

            withdraw(amount, amount);
        }


        function stakeEth (uint256 _amount, uint256 _minSharesOut) public payable returns(uint256 _shares) {_shares = i_metapoolRouter.depositToVault(i_vault, i_to, _amount, _minSharesOut);}

        function withdraw (uint256 _amount, uint256 _maxSharesOut) public payable returns(uint256 _shares) {_shares = i_metapoolRouter.withdrawFromVault(i_vault, i_to, _amount, _maxSharesOut);}

}
