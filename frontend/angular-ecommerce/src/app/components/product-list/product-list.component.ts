import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  //pagination propreties
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;



  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.hundlesearchProducts();
    }
    else {
      this.hundleListProducts();
    }
  }
  hundlesearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  hundleListProducts() {
    //check if category id is available 
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      //get the 'id'  param string convert it to a number using +
      this.currentCategoryId = + this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // category id is not available... default to category 1
      this.currentCategoryId = 1;
    }
    //check if we have a different category id than previous

    //if we have different category id than previous
    //set page num to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize, 
                                               this.currentCategoryId).subscribe(this.processResult());

  }
  processResult(){
    return data=> {
      this.products =data._embedded.products;
      this.thePageNumber=data.page.number + 1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
    };
  }
}
