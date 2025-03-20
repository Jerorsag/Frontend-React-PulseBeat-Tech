import { useState } from "react"
import { BASE_URL } from "../api"
import api from "../api"
import { toast } from "react-toastify"

const CartItem = ({item, setCartTotal, cartItems, setNumberCartItems, setCartItems}) => {

  const [quantity, setQuatity] = useState(item.quantity)
  const [loading, setLoading] = useState(false)
  
  const itemData = {quantity:quantity, item_id:item.id}
  const itemID = {item_id:item.id}

  function deleteCartItem() {
    const confirmDelete = window.confirm("Are you sure you want to delete this Cart Item") 
    if(confirmDelete) {
      api.post("delete_cartitem", itemID)
      .then(res => {
        console.log(res.data)
        toast.success("Cart Item deleted succesfully")
        setCartItems(cartItems.filter(cartItem => cartItem.id != item.id))

        setCartTotal(cartItems.filter(cartItem => cartItem.id != item.id)
          .reduce((acc, curr) => acc + curr.total, 0))

        setNumberCartItems(cartItems.filter(cartItem => cartItem.id != item.id)
          .reduce((acc, curr) => acc + curr.quantity, 0))
      })
      .catch(err => {
        console.log(err.message)
      })
    }
  }

  function updateCartItem() {
    setLoading(true)
    api.patch("update_quantity/", itemData)
    .then(res => {
      console.log(res.data)
      setLoading(false)
      toast.success("Cart Item Updated Succesfully!!!")
      setCartTotal(cartItems.map((cartItem) => cartItem.id === item.id ? res.data.data : cartItem)
      .reduce((acc, curr) => acc + curr.total, 0))

      setNumberCartItems(cartItems.map((cartItem) => cartItem.id === item.id ? res.data.data : cartItem)
      .reduce((acc, curr) => acc + curr.quantity, 0))
    })
    .catch(err => {
      console.log(err.message)
      setLoading(false)
    })
  }

  return (
    <div className="col-md-12">
        <div
        className="cart-item d-flex align-items-center mb-3 p-3">
            <img 
            src={`${BASE_URL}${item.product.image}`} 
            alt="Product Image"
            className="img-fluid" 
            style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px'}}/>
            <div className="ms-3 flex-grow-1">
                <h5 className="mb-1">{item.product.name}</h5>
                <p className="mb-0 text-muted">{`$${item.product.price}`}</p>
            </div>
            <div className="d-flex align-items-center">
                <input 
                type="number"
                min="1"
                className="form-control me-3"
                value={quantity}
                onChange={(e) => setQuatity(e.target.value)}
                style={{width: '70px'}} />
                <button className="btn btn-sm mx-2" 
                onClick={updateCartItem}
                style={{backgroundColor: "#4b3bcb", color:"white"}} disabled={loading}>
                {loading ? "Updating" : "Update"}
                </button>
                <button className="btn btn-danger btn-sm" onClick={deleteCartItem}>Remove</button>
            </div>
        </div>
    </div>
  )
}

export default CartItem