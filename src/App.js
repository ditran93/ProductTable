import React, { Component } from 'react';
import './App.css';
import escapeRegExp from 'escape-string-regexp'

class ProductCategoryRow extends Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="2">
          {category}
        </th>
      </tr>
    )
  }
}

class ProductRow extends Component {
  render() {
    const product = this.props.product
    const name = product.stocked ?
      product.name : 
      <span style={{color: 'red'}}>
        {product.name}
      </span>

      return(
        <tr>
          <td>{name}</td>
          <td>{product.price}</td>
        </tr>
      )
  }
}

class ProductTable extends React.Component {
  render() {
    let rows = [];
    let lastCategory = null;

    this.props.products.forEach((product) => {
      if(product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow 
            category={product.category}
            key={product.category}
          />
        )
      }
      if(this.props.inStockOnly === true) {
        if(product.stocked === true) {
          rows.push(
            <ProductRow 
              product={product}
              key={product.name}
            />)
        } 
      } else if (this.props.inStockOnly === false) {
        rows.push(
          <ProductRow 
            product={product}
            key={product.name}
          />)
        }
      lastCategory = product.category;
    })
    if(this.props.filterText) {
      const match = new RegExp(escapeRegExp(this.props.filterText), 'i')
      rows = rows.filter(row => match.test(row.key))
      debugger
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class SearchBar extends React.Component {
  render() {
    return (
      <form>
        <input onChange={(e) => this.props.onSearch(e)} type="text" placeholder="Search..." />
        <p>
          <input onChange={(e) => this.props.onChangeStockMode(e)} type="checkbox" />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  state = {
    filterText: '',
    inStockOnly: false
  }
  changeStockMode = (e) => {
    if(e.target.checked === true){
      this.setState({inStockOnly: true})
    } else {
      this.setState({inStockOnly: false})
    }
  }
  search = (e) => {
    this.setState({ filterText: e.target.value })
  }
  render() {
    return (
      <div>
        <SearchBar 
        onChangeStockMode={this.changeStockMode} 
        onSearch={this.search}
        />
        <ProductTable 
        inStockOnly={this.state.inStockOnly} 
        products={this.props.products}
        filterText={this.state.filterText}
        />
      </div>
    );
  }
}

const PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <FilterableProductTable products={PRODUCTS} />
      </div>
    );
  }
}

export default App;
