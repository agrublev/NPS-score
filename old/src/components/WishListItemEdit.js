import React, { Component } from "react";
import { observer } from "mobx-react";
import { action, observable } from "mobx";
import { WishListItem } from "../models/WishList";
const round = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);

class WishListItemEdit extends Component {
    @observable entry = WishListItem.create({
        name: "",
        price: 0
    });

    @observable submitting = false;

    render() {
        const { item = this.entry, save, cancel } = this.props;
        return (
            <div className="item-edit">
                {!this.submitting && (
                    <form onSubmit={this.sub}>
                        {["name", "price", "image"].map(e => (
                            <div key={e}>
                                <h3>{e}:</h3>
                                <input
                                    formNoValidate={true}
                                    value={item[e]}
                                    name={e}
                                    type={e === "price" ? "number" : "text"}
                                    onChange={this.onUpdate}
                                />
                            </div>
                        ))}
                        {save ? (
                            <div>
                                <button onClick={save}>💾 Save</button>
                                <button onClick={cancel}>❎ Cancel</button>
                            </div>
                        ) : (
                            <button type={"submit"}>Add</button>
                        )}
                    </form>
                )}
            </div>
        );
    }
    sub = ev => {
        this.submitting = true;
        ev.preventDefault();
        const { item = this.entry } = this.props;
        if (this.props.wishList) {
            this.props.wishList.add(item);
        }
        this.entry = WishListItem.create({ name: "", price: 0 });

        this.submitting = false;
        return false;
    };

    onUpdate = event => {
        const { item = this.entry } = this.props;
        item.updateItem(event.target.name, event.target.value);
    };
}

export default observer(WishListItemEdit);
