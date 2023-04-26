import "./App.css";

import React, { useReducer } from "react";
// import "./styles.css";

import faker from "faker";

faker.seed(123);

const data = [...Array(50)].map((item) => ({
  id: faker.random.uuid(),
  name: faker.commerce.productName(),
  image: faker.random.image(),
  price: faker.commerce.price(),
  material: faker.commerce.productMaterial(),
  brand: faker.lorem.word(),
  inStock: faker.random.boolean(),
  fastDelivery: faker.random.boolean(),
  ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
  offer: faker.random.arrayElement([
    "Save 50",
    "70% bonanza",
    "Republic Day Sale",
  ]),
  idealFor: faker.random.arrayElement([
    "Men",
    "Women",
    "Girl",
    "Boy",
    "Senior",
  ]),
  level: faker.random.arrayElement([
    "beginner",
    "amateur",
    "intermediate",
    "advanced",
    "professional",
  ]),
  color: faker.commerce.color(),
}));

const filterReducer = (filterAppliedByUser, action) => {
  switch (action.type) {
    case "INPUT_BY_USER":
      return { ...filterAppliedByUser, inputByUser: action.payload };
    case "SEARCH_INPUT":
      return {
        ...filterAppliedByUser,
        searchInput: filterAppliedByUser.inputByUser,
        // inputByUser: "",
      };
    case "PRICE_SORT":
      return { ...filterAppliedByUser, sortByPrice: action.payload };
    case "CHECKBOX": {
      const isFilterAlreadyPresent = filterAppliedByUser.checkBox.find(
        (filter) => filter === action.payload
      );
      return {
        ...filterAppliedByUser,
        checkBox: isFilterAlreadyPresent
          ? filterAppliedByUser.checkBox.filter((el) => el !== action.payload)
          : [...filterAppliedByUser.checkBox, action.payload],
      };
    }
    default:
      return filterAppliedByUser;
  }
};
function App() {
  const initial = {
    inputByUser: "",
    searchInput: "",
    sortByPrice: null,
    checkBox: ["inStock"],
  };

  const [filterAppliedByUser, dispatch] = useReducer(filterReducer, initial);
  
  let processedData = filterAppliedByUser.searchInput.length
    ? data.filter((data) =>
        data.name
          .toUpperCase()
          .includes(filterAppliedByUser.searchInput.toUpperCase())
      )
    : data;
  processedData = processedData.sort((a, b) =>
    filterAppliedByUser.sortByPrice === "lowToHigh"
      ? a.price - b.price
      : filterAppliedByUser.sortByPrice === "highToLow"
      ? b.price - a.price
      : processedData
  );

  processedData = filterAppliedByUser.checkBox.length
    ? processedData.filter((product) =>
        filterAppliedByUser.checkBox.every((el) => product[el])
      )
    : processedData;

  return (
    <>
      <h1>NeogMart</h1>
      <div className="input-search">
        <label>
          Search:{" "}
          <input
            onChange={(e) =>
              dispatch({ type: "INPUT_BY_USER", payload: e.target.value })
            }
            placeholder="Search By Name"
          />
        </label>
        <button onClick={() => dispatch({ type: "SEARCH_INPUT" })}>
          Search Data
        </button>
      </div>
      <div className="input-radio">
        <fieldset>
          <legend>Sort By</legend>
          <label>
            Price: High to Low
            <input
              value="lowToHigh"
              onChange={(e) =>
                dispatch({ type: "PRICE_SORT", payload: e.target.value })
              }
              name="price "
              type="radio"
            />
          </label>
          <label>
            Price: Low to High
            <input
              value="highToLow"
              onChange={(e) =>
                dispatch({ type: "PRICE_SORT", payload: e.target.value })
              }
              name="price "
              type="radio"
            />
          </label>
        </fieldset>
      </div>
      <div className="input-checkbox">
        <fieldset>
          <legend>Filters</legend>
          <label>
            Include Out of Stock
            <input
              checked={!filterAppliedByUser.checkBox.includes("inStock")}
              type="checkbox"
              value="inStock"
              onChange={(e) =>
                dispatch({ type: "CHECKBOX", payload: e.target.value })
              }
            />
          </label>
          <label>
            Fast Delivery Only
            <input
              value="fastDelivery"
              onChange={(e) =>
                dispatch({ type: "CHECKBOX", payload: e.target.value })
              }
              type="checkbox"
            />
          </label>
        </fieldset>
      </div>

      <div className="App" >
        {processedData.map(
          ({
            id,
            name,
            image,
            price,
            productName,
            inStock,
            level,
            fastDelivery,
          }) => (
            <div className="card" key={id}>
              <img src={image} width="100%" height="auto" alt={productName} />
              <h3> {name} </h3>
              <div>Rs. {price}</div>
              {inStock && <div> In Stock </div>}
              {!inStock && <div> Out of Stock </div>}
              <div>{level}</div>
              {fastDelivery ? (
                <div> Fast Delivery </div>
              ) : (
                <div> 3 days minimum </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}

export default App;
