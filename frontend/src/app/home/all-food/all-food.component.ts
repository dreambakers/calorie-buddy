import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FoodService } from 'src/app/services/food.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-all-food',
  templateUrl: './all-food.component.html',
  styleUrls: ['./all-food.component.scss']
})
export class AllFoodComponent implements OnInit {

  displayedColumns: string[] = ['name', 'typicalValues', 'typicalValueUnit', 'calories', 'carbs', 'fat', 'protien', 'salt', 'sugar'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private foodService: FoodService,
    private utils: UtilService
  ) { }

  ngOnInit(): void {
    this.foodService.getFoods().subscribe(
      (res: any) => {
        if (res.success) {
          this.dataSource = new MatTableDataSource(res.foods);
        }
      }, err => {
        this.utils.openSnackBar('Error getting food items');
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
