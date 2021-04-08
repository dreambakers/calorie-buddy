import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from 'src/app/services/food.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-search-food',
  templateUrl: './search-food.component.html',
  styleUrls: ['./search-food.component.scss']
})
export class SearchFoodComponent implements OnInit {
  searchFoodForm: FormGroup;
  foods = [];

  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private utils: UtilService
  ) { }

  ngOnInit(): void {
    this.searchFoodForm = this.formBuilder.group({
      searchTerm: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.searchFoodForm.invalid) {
      return;
    }

    // clear food array for new search
    this.foods = [];

    this.foodService.findFoods(this.searchFoodForm.value).subscribe(
      (res: any) => {
        if (res.success) {
          this.foods = res.foods;
          if (res.foods.length === 0) {
            this.utils.openSnackBar('No foods founds against the search term');
          }
        }
      }, err => {
        this.utils.openSnackBar('Error searching food items');
      }
    );
  }
}
