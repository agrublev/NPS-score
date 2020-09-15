import { types, flow, applySnapshot } from "mobx-state-tree";

import { WishList } from "./WishList";
import { createStorable } from "./Storable";

const User = types.compose(
    types
        .model({
            id: types.identifier,
            name: types.string,
            gender: types.enumeration("gender", ["m", "f"]),
            wishList: types.optional(WishList, {})
        })
        .actions(self => ({
            getSuggestions: flow(function* getSuggestions() {
                const response = yield window.fetch(
                    `http://localhost:3052/suggestions_${self.gender}`
                );
                self.wishList.items.push(...(yield response.json()));
            })
        })),
    createStorable("users", "id")
);

export const Group = types
    .model({
        isLoading: types.boolean,
        currentUser: types.maybeNull(types.reference(User)),
        users: types.optional(types.map(User), {})
    })
    .views(self => {
        return {
            get getId() {
                if (self.currentUser !== null) {
                    return self.currentUser.id;
                } else {
                    return null;
                }
            }
        };
    })
    .actions(self => {
        let controller;

        return {
            afterCreate() {
                self.load();
            },
            setC(c) {
                self.currentUser = self.users.get(c);
            },
            load: flow(function* load() {
                controller = window.AbortController && new window.AbortController();
                try {
                    const response = yield window.fetch(`http://localhost:3052/users`, {
                        signal: controller && controller.signal
                    });
                    const users = yield response.json();
                    applySnapshot(
                        self.users,
                        users.reduce((base, user) => ({ ...base, [user.id]: user }), {})
                    );
                } catch (e) {
                    console.log("aborted", e.name);
                }
                self.isLoading = yield new Promise(async resolve =>
                    setTimeout(() => {
                        resolve(false);
                    }, 1)
                );
                console.log("success");
            }),
            setLoad(b) {
                self.isLoading = b;
            },
            reload() {
                if (controller) controller.abort();
                self.setLoad(true);
                return self.load();
            },

            beforeDestroy() {
                if (controller) controller.abort();
            }
        };
    });
