import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  ordersList = [
    {
      id: 5331,
      name: 'Erin Gonzales',
      avatar: 'assets/images/avatars/thumb-1.jpg',
      date: '8 May 2019',
      amount: 137,
      status: 'approved',
      checked: false,
    },
    {
      id: 5375,
      name: 'Darryl Day',
      avatar: 'assets/images/avatars/thumb-2.jpg',
      date: '6 May 2019',
      amount: 322,
      status: 'approved',
      checked: false,
    },
    {
      id: 5762,
      name: 'Marshall Nichols',
      avatar: 'assets/images/avatars/thumb-3.jpg',
      date: '1 May 2019',
      amount: 543,
      status: 'approved',
      checked: false,
    },
    {
      id: 5865,
      name: 'Virgil Gonzales',
      avatar: 'assets/images/avatars/thumb-4.jpg',
      date: '28 April 2019',
      amount: 876,
      status: 'pending',
      checked: false,
    },
    {
      id: 5213,
      name: 'Nicole Wyne',
      avatar: 'assets/images/avatars/thumb-5.jpg',
      date: '28 April 2019',
      amount: 241,
      status: 'approved',
      checked: false,
    },
    {
      id: 5311,
      name: 'Riley Newman',
      avatar: 'assets/images/avatars/thumb-6.jpg',
      date: '19 April 2019',
      amount: 872,
      status: 'rejected',
      checked: false,
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
