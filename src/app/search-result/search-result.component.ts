import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../model/User";
import {UserDto} from "../model/UserDto";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
   currentClickId: number;
  constructor(private router: Router) {

  }

  result = this.router.getCurrentNavigation()?.extras.state as { result: [] }
  users:UserDto[]=this.result.result

  ngOnInit(): void {
    // @ts-ignore
    console.log('test ' + JSON.stringify(this.result.result))
  }
  fowardToMainTimeLine(id: number) {
    this.currentClickId = id;
    this.router.navigateByUrl("/mainTimeLine/" + id)
  }
  test() {
    // @ts-ignore
    alert(JSON.stringify(this.users.at(0).id))
  }
}
