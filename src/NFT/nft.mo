import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT(title: Text, owner: Principal, image: [Nat8]) = this {  
    private let itemName = title;
    private var nftOwner = owner;
    private let imageByte = image;

    public query func getName() : async Text {
        return itemName;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    public query func getImage() : async [Nat8] {
        return imageByte;
    };

    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnerShip(newOwner: Principal): async Text {
        if(msg.caller == nftOwner){
            nftOwner := newOwner;
            return "Success";
        } else {
            return "Error: Not initated by NFT Owner.";
        }
    }
}