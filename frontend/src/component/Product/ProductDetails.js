import React, { Fragment, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import './ProductDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearErrors,
  getProductDetails,
  newReview,
} from '../../actions/productAction';

import ReviewCard from './ReviewCard.js';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { addItemsToCart } from '../../actions/cartAction';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const options = {
    size: 'large',
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const increaseQuantity = () => {
    if (quantity < 3) {
      setQuantity(quantity + 1);
    } else {
      alert.show('Please Contact us for more than 3KG');
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(match.params.id, quantity));
    alert.success('Item Added To Cart');
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set('rating', rating);
    myForm.set('comment', comment);
    myForm.set('productId', match.params.id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success('Review Submitted Successfully');
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert, reviewError, success]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} `} />
          <div className='ProductDetails details'>
            <div className='big-img'>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className='CarouselImage'
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div className='app'>
              <div className='details'>
                <div className='box'>
                  <div className='row'>
                    <h2>{product.name}</h2>
                    <h1>{`₹${product.price}`}</h1>
                  </div>

                  <p>{product.description}</p>

                  <div className='detailsBlock-3-1'>
                    <div
                      className='detailsBlock-3-1-1'
                      style={{ display: 'flex' }}
                    >
                      <h4>KG : </h4>
                      <button className='m-2' onClick={decreaseQuantity}>
                        -
                      </button>
                      <p>{quantity}</p>
                      <button className='m-2' onClick={increaseQuantity}>
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className='cart m-2'
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                  <button
                    className='cart'
                    onClick={submitReviewToggle}
                    style={{ background: 'dodgerblue' }}
                  >
                    Submit Review
                  </button>
                </div>
                <Rating {...options} />
              </div>
            </div>
           
          </div>

          <h3 className='reviewsHeading'>REVIEWS</h3>

          <Dialog
            aria-labelledby='simple-dialog-title'
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className='submitDialog'>
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size='large'
              />

              <textarea
                className='submitDialogTextArea'
                cols='30'
                rows='5'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color='secondary'>
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color='primary'>
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className='reviews'>
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className='noReviews'>No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
