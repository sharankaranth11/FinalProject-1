import React, { Fragment } from 'react';
import './Cart.css';
import CartItemCard from './CartItemCard';
import { useSelector, useDispatch } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { Typography } from '@material-ui/core';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import { Link } from 'react-router-dom';
import { useAlert } from "react-alert";

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const alert = useAlert();

  const increaseQuantity = (id, quantity, stock) => {
    if (quantity < 3) {
      const newQty = quantity + 1;
      dispatch(addItemsToCart(id, newQty));
    } else{
      alert.show("Please Contact us for more than 3KG")
    }
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    alert.show("Succesfully remove from cart")
    dispatch(removeItemsFromCart(id));
    
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className='emptyCart'>
          <RemoveShoppingCartIcon />

          <Typography>No Product in Your Cart</Typography>
          <Link to='/products'>View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className='cartPage'>
            <div className='cartHeader'>
              <p>Product</p>

              <p>Remove</p>
              <p>KG</p>
              <p>Price</p>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className='cartContainer' key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className='cartInput'>
                    <button
                      className='btn btn-primary '
                      onClick={() =>
                        decreaseQuantity(item.product, item.quantity)
                      }
                    >
                      -
                    </button>
                    <input type='number' value={item.quantity} readOnly />
                    <h4>{item.quantity} </h4>
                    <button
                      className='btn btn-primary m-2'
                      onClick={() =>
                        increaseQuantity(
                          item.product,
                          item.quantity,
                          item.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className='cartSubtotal fs-6 '>{`₹${
                    item.price * item.quantity
                  }`}</p>
                  <hr />
                </div>
              ))}

            <div className='cartGrossProfit'>
              <div></div>
              <div className='cartGrossProfitBox'>
                <p className='fs-6 fw-bolder'>Total</p>
                <p className='fs-6 fw-bolder'>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className='checkOutBtn'>
                <button className='p-3' onClick={checkoutHandler}>
                  Proceed Payment
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;

