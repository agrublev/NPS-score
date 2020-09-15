import React, { Component } from "react";
import logo from "../assets/santa-claus.png";

import WishListView from "./WishListView";
import { observer } from "mobx-react";

@observer
class App extends Component {
    componentDidUpdate() {
        const { group } = this.props;
        let selectedUser = localStorage.getItem("selected");
        if (selectedUser) {
            group.setC(selectedUser);
        } else {
            localStorage.clear();
        }
    }

    render() {
        const { group } = this.props;
        const { currentUser } = group;

        return group.isLoading ? (
            <div>LOADING...</div>
        ) : (
            <div className="App">
                <header className="App-header">
                    {logo && <img src={logo} alt={""} className="App-logo" alt="logo" />}
                    <h1 className="App-title">WishList</h1>
                </header>
                <button
                    onClick={async () => {
                        await group.reload();
                        group.setLoad(false);
                        // window.location.reload();
                    }}
                >
                    Reload
                </button>
                <select onChange={this.onSelectUser} value={group.getId}>
                    <option>- Select user -</option>
                    {Array.from(group.users.values()).map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                {currentUser && <User user={currentUser} />}
            </div>
        );
    }

    onSelectUser = event => {
        localStorage.setItem("selected", event.target.value);
        this.props.group.setC(event.target.value);
    };
}

const User = observer(({ user }) => (
    <div>
        <WishListView wishList={user.wishList} />

        <button onClick={user.getSuggestions}>Suggestions</button>
    </div>
));

export default observer(App);
