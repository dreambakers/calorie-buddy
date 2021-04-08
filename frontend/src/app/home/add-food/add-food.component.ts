import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from 'src/app/services/food.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.scss']
})
export class AddFoodComponent implements OnInit {

  addFoodForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private utils: UtilService
  ) { }

  ngOnInit(): void {
    // Defining regex so that only decimals can be input
    const decimalNumberPattern = Validators.pattern(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/);

    // Intialize Add food form
    this.addFoodForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      typicalValues: ['', [Validators.required, decimalNumberPattern]],
      typicalValueUnit: ['', [Validators.required]],
      calories: ['', [Validators.required, decimalNumberPattern]],
      carbs: ['', [Validators.required, decimalNumberPattern]],
      fat: ['', [Validators.required, decimalNumberPattern]],
      protien: ['', [Validators.required, decimalNumberPattern]],
      salt: ['', [Validators.required, decimalNumberPattern]],
      sugar: ['', [Validators.required, decimalNumberPattern]],
    });
  }

  onSubmit() {
    if (this.addFoodForm.invalid) {
      return;
    }

    this.foodService.addFood(this.addFoodForm.value).subscribe(
      (res: any) => {
        if (res.success) {
          this.utils.openSnackBar('Food item added');
        }
      }, err => {
        this.utils.openSnackBar('Error adding food item');
      }
    );
  }

  get f() { return this.addFoodForm.controls; }
}
