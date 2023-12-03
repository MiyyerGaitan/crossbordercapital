import { useState } from "react";
import { Address } from "../scaffold-eth";
import { ETHToPrice } from "./EthToPrice";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  useAccountBalance,
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
} from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import {
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { SendData } from "../send-data/index";
import { GetData } from "../get-data/index";

export const StakeContractInteraction = ({ address }: { address?: string }) => {

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [otpGet, setOtpGet] = useState('');
  const handleOpen = () => setOpen(!open);
  const handleOpen2 = () => setOpen2(!open2);

  const [args, setArgs] = useState({monto:0,otp:"", montotransfer:0});  
  

  const { address: connectedAddress } = useAccount();
  const { data: StakerContract } = useDeployedContractInfo("Staker");
  const { data: ExampleExternalContact } = useDeployedContractInfo("ExampleExternalContract");
  const { balance: stakerContractBalance } = useAccountBalance(StakerContract?.address);
  const { balance: exampleExternalContractBalance } = useAccountBalance(ExampleExternalContact?.address);

  const configuredNetwork = getTargetNetwork();

  // Contract Read Actions
  const { data: myStake } = useScaffoldContractRead({
    contractName: "Staker",
    functionName: "balances",
    args: [connectedAddress],
    watch: true,
  });
  const { data: isStakingCompleted } = useScaffoldContractRead({
    contractName: "ExampleExternalContract",
    functionName: "completed",
    watch: true,
  });

  // Contract Write Actions
  const { writeAsync: stakeETH } = useScaffoldContractWrite({
    contractName: "Staker",
    functionName: "stake",
    value: "0.5",
  });
  const { writeAsync: execute } = useScaffoldContractWrite({
    contractName: "Staker",
    functionName: "execute",
    args: [BigInt(1)]
  });
  const { writeAsync: withdrawETH } = useScaffoldContractWrite({
    contractName: "Staker",
    functionName: "withdraw",
    args: [otpGet]
  });

  const executeContract = (e:any, otp:string, montotal:any, montotransfer:any) => {
    e.preventDefault();
    setArgs({monto:montotal, otp:otp, montotransfer:montotransfer})
    console.log('executeContract',otp);
    execute();
    handleOpen();
  };

  const getContract = (e:any, otp:string) => {
    e.preventDefault();
    setOtpGet(otp)
    console.log('getContract',otp);
    withdrawETH()
    handleOpen2();
  };
  return (
    <div className="flex items-center flex-col flex-grow w-full px-4 gap-12">
      {isStakingCompleted && (
        <div className="flex flex-col items-center gap-2 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-12 w-full max-w-lg">
          <p className="block m-0 font-semibold">
            {" "}
            🎉 &nbsp; Staking App triggered `ExampleExternalContract` &nbsp; 🎉{" "}
          </p>
          <div className="flex items-center">
            <ETHToPrice
              value={exampleExternalContractBalance != null ? exampleExternalContractBalance.toString() : undefined}
              className="text-[1rem]"
            />
            <p className="block m-0 text-lg -ml-1">staked !!</p>
          </div>
        </div>
      )}
      <div
        className={`flex flex-col items-center space-y-8 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg ${
          !isStakingCompleted ? "mt-24" : ""
        }`}
      >
        <div className="flex flex-col w-full items-center">
          <p className="block text-2xl mt-0 mb-2 font-semibold">Pool de giros</p>
          <Address address={address} size="xl" />
        </div>
        <div className="flex items-start justify-around w-full">
          <div className="flex flex-col items-center w-1/2">
            <p className="block text-xl mt-0 mb-1 font-semibold">Monto de destino</p>
            <span>
              {myStake ? formatEther(myStake) : 0} {configuredNetwork.nativeCurrency.symbol}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 w-full">
          <p className="block text-xl mt-0 mb-1 font-semibold">Recompensas de la pool</p>
          <div className="flex space-x-2">
            {<ETHToPrice value={stakerContractBalance != null ? "0.00001" : undefined} />}
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex space-x-7">
            <button className="btn btn-primary" onClick={() => handleOpen() }>
              Enviar transaccion
            </button>
            <button className="btn btn-primary" onClick={() => handleOpen2()}>
              Recibir transaccion
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => stakeETH()}>
            🥩 Enviar Activos!
          </button>
        </div>
      </div>


       {/* Modal enviar Giro */}
       <Dialog open={open} handler={handleOpen} className="bg-white"  size="xxl">
          <DialogBody>
            <SendData executeContract={executeContract} handleOpen={handleOpen} />
          </DialogBody>
        </Dialog>

       {/* Modal reclamar Giro */}
       <Dialog open={open2} handler={handleOpen2} className="bg-white"  size="xxl">
          <DialogBody>
            <GetData getContract={getContract}  handleOpen2={handleOpen2} />
          </DialogBody>
        </Dialog>

    </div>
  );
};
