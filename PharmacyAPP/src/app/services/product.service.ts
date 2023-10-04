import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = 'https://localhost:7148/api/ProductDetails/';
  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<any>(this.baseUrl);
  }
}
