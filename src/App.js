import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export default function App() {
  const [showaddFriend, setShowaddFriend] =
    useState(false);

  const [selectedFriend, setSelecteFriend] =
    useState(null);

  const [friends, setFriends] = useState(
    initialFriends
  );

  function handleShowaddFriend() {
    setShowaddFriend((showState) => !showState);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowaddFriend(false);
  }

  function handleSelection(friend) {
    // setSelecteFriend(friend);
    setSelecteFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );

    setShowaddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + value,
            }
          : friend
      )
    );

    setSelecteFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showaddFriend && (
          <FormAddFriend
            onAddFriend={handleAddFriend}
          />
        )}

        <Button onClick={handleShowaddFriend}>
          {showaddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplit={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({
  friends,
  onSelection,
  selectedFriend,
}) {
  return (
    <div>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </div>
  );
}

function Friend({
  friend,
  onSelection,
  selectedFriend,
}) {
  const isSelected =
    selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      {" "}
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name}{" "}
          {Math.abs(friend.balance)}{" "}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you{" "}
          {Math.abs(friend.balance)}
        </p>
      ) : (
        <p>You and {friend.name} are even </p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(
    "https://i.pravatar.cc/48"
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form
      className="form-add-friend"
      onSubmit={handleSubmit}
    >
      <label>✈️ Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🔮 Image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({
  selectedFriend,
  onSplit,
}) {
  const [bill, setbill] = useState("");
  const [paidByUser, setPaidByUser] =
    useState("");
  const paidbyFriend = bill
    ? bill - paidByUser
    : "";

  const [whoIsPaying, setWhoIsPaying] =
    useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplit(
      whoIsPaying === "user"
        ? paidbyFriend
        : -paidByUser
    );
  }

  return (
    <form
      className="form-split-bill"
      onSubmit={handleSubmit}
    >
      <h2>
        Split a bill with {selectedFriend.name}
      </h2>
      <label>🔮 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) =>
          setbill(Number(e.target.value))
        }
      />

      <label>🔮 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill
              ? bill
              : Number(e.target.value)
          )
        }
      />

      <label>
        🔮 {selectedFriend.name}'s expense
      </label>
      <input
        type="text"
        disabled
        value={paidbyFriend}
      />

      <label>🔮 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) =>
          setWhoIsPaying(e.target.value)
        }
      >
        <option value="user">You</option>
        <option value="friend">
          {selectedFriend.name}
        </option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
