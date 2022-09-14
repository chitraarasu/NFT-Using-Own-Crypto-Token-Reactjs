import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'completedPurchase' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
  'getListedNfts' : () => Promise<Array<Principal>>,
  'getOpenDCanisterId' : () => Promise<Principal>,
  'getOrignalOwner' : (arg_0: Principal) => Promise<Principal>,
  'getOrignalPrice' : (arg_0: Principal) => Promise<bigint>,
  'getOwnerNFTs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
}
