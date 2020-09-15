import React from "react";
import { observer } from "mobx-react";

import WishListItemView from "./WishListItemView";
import WishListItemEntry from "./WishListItemEntry";
import WishListItemEdit from "./WishListItemEdit";

const WishListView = ({ wishList, readonly }) => (
    <div className="list">
        <div style={{ display: "flex" }}>
            <ul style={{ flex: 0.5, height: 400, width: 300, overflow: "auto" }}>
                {wishList.items.map((item, idx) => (
                    <WishListItemView key={idx} item={item} readonly={readonly} />
                ))}
            </ul>
            {!readonly && <WishListItemEdit wishList={wishList} />}
        </div>
        <h1>Total: {wishList.totalPrice}€</h1>
    </div>
);

export default observer(WishListView);
