import {ethers} from "ethers"
import diceAbi from "./abi";
import provider from "./provider";


const diceAddress = "0x8c47fE26385630D4De17B303a5Af3045827b7E73";
const diceContract = new ethers.Contract(diceAddress, diceAbi, provider);

export default diceContract