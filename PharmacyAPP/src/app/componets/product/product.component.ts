import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { CartService } from '../../services/cart.service';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public products: any = [];
  private cartItems: any[] = [];

  constructor(private product: ProductService, private cartService: CartService,private toast:NgToastService) {
    this.products = this.product.getProducts();
  }


  ngOnInit() {
    this.product.getProducts()
      .subscribe(res => {
        this.products = res;
      });
  }

  /*addToCart(product: any) {
    this.cartService.addToCart(product);
   // alert('Item has been added to the cart!');
    this.toast.success({ detail: "Product Added", summary: "Product Added To Cart", duration: 1000 }); 
  }*/
  addToCart(item: any) {
    const existingItem = this.cartItems.find(cartItem => cartItem.productName === item.productName);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1; // Initialize quantity if undefined
    } else {
      item.quantity = 1;
      this.cartItems.push(item);
    }
    this.toast.success({ detail: "Product Added", summary: "Product Added To Cart", duration: 1000 });
  }

}


