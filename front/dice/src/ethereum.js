import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import Dice from './contracts/Dice.json';

const getBlockchain = () =>
  new Promise( async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if(provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      const networkId = await provider.request({ method: 'net_version' })
      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();
      const simpleStorage = new Contract(
        Dice.networks[networkId].address,
        Dice.abi,
        signer
      );
      resolve({simpleStorage});
      return;
    }
    reject('Install Metamask');
  });

export default getBlockchain;