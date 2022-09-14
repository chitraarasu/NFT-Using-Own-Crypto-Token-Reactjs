export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'completedPurchase' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'getListedNfts' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getOpenDCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'getOrignalOwner' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'getOrignalPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getOwnerNFTs' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'isListed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'listItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
