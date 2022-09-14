import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token";
import { opend } from "../../../declarations/opend";
import Button from "./button";
import CURRENT_USER_ID from "../index";
import PriceTag from "./PriceTag";

function Item(props) {
  var id = Principal.fromText(props.id);
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [prizeBox, setPrizeBox] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [blur, setIsBlur] = useState();
  const [sellStatus, setSellStatus] = useState();
  const [priceTag, setPriceTag] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

  const agent = new HttpAgent({ host: "http://localhost:8080/" });
  agent.fetchRootKey(); //Remove this line before deploying.
  let nftActor;
  async function loadNFT() {
    nftActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });
    var name = await nftActor.getName();
    var owner = await nftActor.getOwner();
    var imageData = await nftActor.getImage();
    var imageContent = new Uint8Array(imageData);
    var image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );
    setName(name);
    setImage(image);
    setOwner(owner.toText());

    const isListed = await opend.isListed(id);
    if (props.role == "collection") {
      if (isListed) {
        setIsBlur({ filter: "blur(4px)" });
        setOwner("OpenD");
        setSellStatus("Listed");
      } else {
        setButton(<Button name="Sell" handleClick={handleSell} />);
      }
    } else if (props.role == "discover") {
      var orignialOwner = await opend.getOrignalOwner(id);
      if (orignialOwner.toText() != CURRENT_USER_ID) {
        setButton(<Button name="Buy" handleClick={handleBuy} />);
      }
      var priceTag = await opend.getOrignalPrice(id);
      console.log(priceTag);
      setPriceTag(<PriceTag price={priceTag.toString()} />);
    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  async function handleBuy() {
    console.log("Buying");
    setIsLoading(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("wxns6-qiaaa-aaaaa-aaaqa-cai"),
    });

    const sellerId = await opend.getOrignalOwner(id);
    const itemPrice = await opend.getOrignalPrice(id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    console.log(result);
    if (result == "Success") {
      const transferResult = await opend.completedPurchase(
        id,
        sellerId,
        CURRENT_USER_ID
      );
      console.log(transferResult);
      setDisplay(false);
    }
    setIsLoading(true);
  }

  var prize;
  function handleSell() {
    setPrizeBox(
      <input
        placeholder="Price in DCHI"
        type="number"
        className="price-input"
        value={prize}
        onChange={(e) => (prize = e.target.value)}
      />
    );
    setButton(<Button name="Confirm" handleClick={confirmSell} />);
  }

  async function confirmSell() {
    setIsBlur({ filter: "blur(4px)" });
    setIsLoading(false);
    var listingResult = await opend.listItem(id, Number(prize));
    console.log(listingResult);
    if (listingResult == "Success") {
      var openDid = await opend.getOpenDCanisterId();
      var transferResult = await nftActor.transferOwnerShip(openDid);
      console.log(transferResult);
      setButton();
      setOwner("OpenD");
      setPrizeBox();
      setSellStatus("Listed");
    }
    setIsLoading(true);
  }

  return (
    <div
      style={{ display: shouldDisplay ? "inline" : "none" }}
      className="disGrid-item"
    >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          style={blur}
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div hidden={isLoading} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceTag}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {prizeBox}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
