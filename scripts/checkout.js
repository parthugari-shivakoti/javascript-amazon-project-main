import {cart, removeFromCart} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
let cartSummaryHTML = '';

const today = dayjs();
const deliveryDate = today.add(7,'days');
console.log(deliveryDate);
console.log(deliveryDate.format('dddd, MMMM D'));

cart.forEach((cartItem)=>{
    const productId = cartItem.productId;
    let machingProduct;
    products.forEach((product)=>{
        if(product.id === productId){
            machingProduct = product;
        }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;
    deliveryOptions.forEach((option) =>{
      if(option.id === deliveryOptionId){
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );

    console.log(deliveryDate)
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${machingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${machingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${machingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(machingProduct.priceCents)};
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = ${machingProduct.id}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(machingProduct,cartItem)}
                
              </div>
            </div>
        </div>
    `;
});

function deliveryOptionsHTML(machingProduct, cartItem){

  let html='';

  deliveryOptions.forEach((deliveryOption)=>{
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    console.log(deliveryDate)
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );
    const priceString = deliveryOption.priceCents === 0
    ? 'Free'
    : `$${formatCurrency(deliveryOption.priceCents)}`;

    html+=`
    <div class="delivery-option">
      <input type="radio" ${deliveryOption.id === cartItem.deliveryOptionId ? 'checked' : ''} class="delivery-option-input"
        name="delivery-option-${machingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} - Shipping
        </div>
      </div>
    </div>
    `
  });
  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId = link.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();

  });
});