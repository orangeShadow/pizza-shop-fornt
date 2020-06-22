import React from 'react';

export default class extends React.Component{
  constructor(props) {
    super(props);    
  }

  render() {
    return (
      <span>{(this.props.price/100).toFixed(2)}  {this.props.currency === 'USD'? "$":"€"}</span>
    )
  }
}