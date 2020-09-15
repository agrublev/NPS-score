import React, { Component } from "react";
import { observer } from "mobx-react";
import { clone, getSnapshot, applySnapshot } from "mobx-state-tree";

import WishListItemEdit from "./WishListItemEdit";

class WishListItemView extends Component {
    constructor() {
        super();
        this.state = { isEditing: false };
    }

    render() {
        const { item, readonly } = this.props;
        return this.state.isEditing ? (
            this.renderEditable()
        ) : (
            <li className="item">
                {item.image && <img src={item.image} />}
                <h3>{item.name}</h3>
                <span>{item.price} €</span>
                {!readonly && (
                    <span>
                        <button onClick={this.onToggleEdit}>✏ Edit</button>
                        <button onClick={item.remove}>❎ Delete</button>
                    </span>
                )}
            </li>
        );
    }

    renderEditable() {
        return (
            <li className="item">
                <WishListItemEdit
                    save={this.onSaveEdit}
                    cancel={this.onCancelEdit}
                    item={this.state.clone}
                />
            </li>
        );
    }

    onToggleEdit = () => {
        this.setState({
            isEditing: true,
            clone: clone(this.props.item)
        });
    };

    onCancelEdit = () => {
        this.setState({ isEditing: false });
    };

    onSaveEdit = () => {
        applySnapshot(this.props.item, getSnapshot(this.state.clone));
        this.setState({
            isEditing: false,
            clone: null
        });
    };
}

export default observer(WishListItemView);