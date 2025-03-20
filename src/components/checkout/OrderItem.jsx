import React from 'react'
import { BASE_URL } from '../../api'

const OrderItem = ({cartItem}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3" style={{padding: "10px 0"}}>
        <div className="d-flex align-items-center">
            <img 
            src={`${BASE_URL}${cartItem.product.image}`}
            alt={cartItem.product.name}
            className="img-fluid"
            style={{width: '60px', height: '60px', objectFit:'cover', borderRadius:'5px'}}/>
            <div className="ms-3">
                <h6 className="mb-0">{cartItem.product.name}</h6>
                <small>{`Quantity: ${cartItem.quantity}`}</small>
            </div>
        </div>
        <h6>{`$${cartItem.product.price}`}</h6>
    </div>
  )
}

export default OrderItem