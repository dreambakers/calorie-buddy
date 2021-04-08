import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(
    private http: HttpClient
  ) { }

  addFood(food) {
    return this.http.post(`${constants.apiUrl}/food/`, food);
  }

  getFoods() {
    return this.http.get(`${constants.apiUrl}/food/`);
  }

  findFoods(searchTerm) {
    return this.http.post(`${constants.apiUrl}/food/find/`, searchTerm);
  }
}
