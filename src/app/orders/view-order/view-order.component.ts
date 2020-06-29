import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  checked: boolean = false; 

  memberList = [
      {
          name: 'Erin Gonzales',
          avatar: 'assets/images/avatars/thumb-1.jpg'
      },
      {
          name: 'Darryl Day',
          avatar: 'assets/images/avatars/thumb-2.jpg'
      },
      {
          name: 'Marshall Nichols',
          avatar: 'assets/images/avatars/thumb-3.jpg'
      },
      {
          name: 'Virgil Gonzales',
          avatar: 'assets/images/avatars/thumb-4.jpg'
      },
      {
          name: 'Riley Newman',
          avatar: 'assets/images/avatars/thumb-6.jpg'
      },
      {
          name: 'Pamela Wanda',
          avatar: 'assets/images/avatars/thumb-7.jpg'
      }
  ]

  taskList = [
      {
          task: "Irish skinny, grinder affogato",
          checked: false
      },
      {
          task: "Let us wax poetic about the beauty of the cheeseburger.",
          checked: false
      },
      {
          task: "I'm gonna build me an airport",
          checked: false
      },
      {
          task: "Efficiently unleash cross-media information",
          checked: true
      },
      {
          task: "Here's the story of a man named Brady",
          checked: true
      },
      {
          task: "Bugger bag egg's old boy willy jolly",
          checked: true
      },
      {
          task: "Hand-crafted exclusive finest tote bag Ettinger",
          checked: true
      },
      {
          task: "I'll be sure to note that in my log",
          checked: true
      }
  ]

  fileList = [
      {
          name: "Mockup.zip",
          size: "7 MB",
          type: "zip"        
      },
      {
          name: "Guideline.doc",
          size: "128 KB",
          type: "doc"        
      },
      {
          name: "Logo.png",
          size: "128 KB",
          type: "image"        
      }
  ];

  activityList = [
      {
          name: "Virgil Gonzales",
          avatar: "assets/images/avatars/thumb-4.jpg",
          date: "24/01/2020 10:44 PM",
          action: "Complete task",
          target: "Pending",
          actionType: "completed"
      },
      {
          name: "Lilian Stone",
          avatar: "assets/images/avatars/thumb-8.jpg",
          date: "24/01/2020 8:34 PM",
          action: "Attached file",
          target: "Invoice Paid",
          actionType: "completed"
      },
      {
          name: "Erin Gonzales",
          avatar: "assets/images/avatars/thumb-1.jpg",
          date: "25/01/2020 8:34 PM",
          action: "Commented",
          target: "In Progress",
          actionType: "loading"
      }
  ]

  commentList = [
      {
          name: 'Lillian Stone',
          img: 'assets/images/avatars/thumb-8.jpg',
          date: '28th Jul 2018',
          review: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
      },
      {
          name: 'Victor Terry',
          img: 'assets/images/avatars/thumb-9.jpg',
          date: '28th Jul 2018',
          review: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
      },
      {
          name: 'Wilma Young',
          img: 'assets/images/avatars/thumb-10.jpg',
          date: '28th Jul 2018',
          review: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
      }
  ]

  itemData = [
    {
        name   : 'Asus Zenfone 3 Zoom ZE553KL Dual Sim (4GB, 64GB)',
        quantity   : 2,
        price: 450
    },
    {
        name   : 'HP Pavilion 15-au103TX 15.6˝ Laptop Red',
        quantity   : 1,
        price: 550
    },
    {
        name   : 'Canon EOS 77D',
        quantity   : 1,
        price: 875
    },
];
}
