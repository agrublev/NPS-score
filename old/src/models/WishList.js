import { types, getParent, destroy } from "mobx-state-tree";

export const WishListItem = types
    .model({
        name: types.string,
        price: types.number,
        image: ""
    })
    .actions(self => ({
        updateItem(key, val) {
            if (key === "price" && val.slice(-1) === ".") {
                val = val + "00";
                console.warn("-- Console PRICEEE", val);
            }
            self[key] = key === "price" ? parseFloat(val) : val;
        },
        remove() {
            getParent(self, 2).remove(self);
        }
    }));

export const WishList = types
    .model({
        items: types.array(WishListItem)
    })
    .actions(self => ({
        add(item) {
            self.items.push(item);
        },
        remove(item) {
            destroy(item);
        }
    }))
    .views(self => ({
        get totalPrice() {
            return self.items.reduce((sum, entry) => sum + entry.price, 0);
        }
    }));
