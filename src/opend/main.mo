import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";

import NFTActorClass "../NFT/nft";


actor OpenD {

    private type Listing = {
        itemOwner: Principal;
        price: Nat;
    };

    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    var mapOfOwner = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var mapOfListing = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

    public shared(msg) func mint(imageData: [Nat8], name: Text) : async Principal {
        let owner : Principal = msg.caller;

        Debug.print(debug_show(Cycles.balance()));
        Cycles.add(100_500_000_000);
        let newNFT = await NFTActorClass.NFT(name, owner, imageData);
        Debug.print(debug_show(Cycles.balance()));

        let newNFTPrincipal = await newNFT.getCanisterId();
        mapOfNFTs.put(newNFTPrincipal, newNFT);
        addToOwnershipMap(owner, newNFTPrincipal);
        return newNFTPrincipal;
    };

    private func addToOwnershipMap(owner: Principal, nftID: Principal) {
        var ownerNFTs: List.List<Principal> = switch (mapOfOwner.get(owner)){
            case null List.nil<Principal>();
            case (?result) result;
        };
        ownerNFTs := List.push(nftID, ownerNFTs);
        mapOfOwner.put(owner, ownerNFTs);
    };

    public query func getOwnerNFTs(user: Principal): async [Principal]{
        var userNFTs: List.List<Principal> = switch (mapOfOwner.get(user)){
            case null List.nil<Principal>();
            case (?result) result;
        };

        return List.toArray(userNFTs);
    };

    public shared(msg) func listItem(id: Principal, price: Nat) : async Text {
        var item: NFTActorClass.NFT = switch (mapOfNFTs.get(id)){
            case null return "NFT doesn't exist.";
            case (?result) result;
        };

        let owner = await item.getOwner();

        if(Principal.equal(owner, msg.caller)){
            let newListing : Listing = {
                itemOwner = owner;
                price = price;
            };
            mapOfListing.put(id, newListing);
            return "Success";
        } else {
            return "You don't own the NFT.";
        }
    };

    public query func getOpenDCanisterId(): async Principal{
        return Principal.fromActor(OpenD);
    };

    public query func isListed(id: Principal): async Bool{
        return switch(mapOfListing.get(id)){
            case null false;
            case (?result) true;
        }
    };

    public query func getListedNfts(): async [Principal] {
        return Iter.toArray(mapOfListing.keys());
    };

    public query func getOrignalOwner(id: Principal): async Principal {
        var listing: Listing = switch(mapOfListing.get(id)){
            case null return Principal.fromText("");
            case (?result) result;
        };
        return listing.itemOwner;
    };
    
    public query func getOrignalPrice(id: Principal): async Nat {
        var listing: Listing = switch(mapOfListing.get(id)){
            case null return 0;
            case (?result) result;
        };
        return listing.price;
    };

    public shared(msg) func completedPurchase(id: Principal, ownerId: Principal, newOwnerId: Principal): async Text {
        var purchasedNFT : NFTActorClass.NFT = switch (mapOfNFTs.get(id)){
            case null return "NFT doesn't exist";
            case (?result) result;
        };

        let transferOwner = await purchasedNFT.transferOwnerShip(newOwnerId);
        if(transferOwner == "Success"){
            mapOfListing.delete(id);
            var ownerNfts : List.List<Principal> = switch (mapOfOwner.get(ownerId)){
                case null List.nil<Principal>(); 
                case (?result) result;
            };
            ownerNfts := List.filter(ownerNfts, func (listItemId: Principal): Bool{
                return listItemId != id;
            });

            addToOwnershipMap(newOwnerId, id);
            return "Success";
        } else {
            return "Error";
        }
    };
};
