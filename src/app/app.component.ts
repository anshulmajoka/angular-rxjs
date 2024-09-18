import { HttpClient } from '@angular/common/http';
import { Component, OnInit, VERSION } from '@angular/core';
import { Observable, from, pipe } from 'rxjs';
import { tap, share } from 'rxjs/operators';
import { of, fromEvent, interval, combineLatest, zip, concat } from 'rxjs';
import { map, filter, mergeMap, switchMap, debounceTime } from 'rxjs/operators';
export class Person {
  name: string;
}
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  loading: boolean = false;
  searchText: string = '';

  constructor(private http: HttpClient) {}
  ngOnInit() {
    //------start -from and of operator ----------
    // converting an object to observable
    const person: Person = {
      name: 'david',
    };
    const personObs: Observable<Person> = of(person);
    personObs.subscribe((data) => {
      console.log('person', data);
    });

    //converting a string to observable
    const strObs: Observable<string> = of('bharat');
    strObs.subscribe((data) => {
      console.log('person string', data);
    });

    // converting romise to observable
    const personPromise: Promise<Person> = Promise.resolve(person);
    const persObs = from(personPromise);
    persObs.subscribe((data) => {
      console.log('person promise', data);
    });

    //------end -from and of operator ----------

    //2.) map  & tap operator
    const source = of('david');
    source
      .pipe(
        map((data) => {
          return data.toUpperCase();
        })
      )
      .subscribe((data) => {
        console.log('mapped object', data);
      });

    // tap does not make changes to actual stream when ever we dont want to change the data.. we can log the data..or may be want to send some signal to some servce and we dont want to maipulate the data..
    const source2 = of('david');
    source2
      .pipe(
        tap((data) => {
          console.log(data.toUpperCase());
        })
      )
      .subscribe((data) => {
        console.log('tapped object', data);
      });

    // making use of share operator
    const request = this.getPosts();
    this.setLoadingSpinner(request);
    request.subscribe((data) => {
      console.log('data for posts', data);
    });
    request.subscribe((data) => {
      console.log('data for posts again', data);
    });
    // this.getPosts().subscribe(data => {
    //   console.log("suscriing again", data);
    // });
    // this.getPosts().subscribe(data => {
    //   console.log("suscriing again..", data);
    // });

    this.runRxJsOpertors();
  }

  setLoadingSpinner(observable) {
    this.loading = true;
    observable.subscribe((data) => {
      this.loading = false;
      console.log('data for posts inside spinner logic', data);
    });
  }

  getPosts() {
    return this.http
      .get('https://jsonplaceholder.typicode.com/posts')
      .pipe(share());
  }

  runRxJsOpertors() {
    // 1. `map`: Transforming emitted values.
    const numbers = of(1, 2, 3, 4);
    numbers
      .pipe(map((x) => x * 2))
      .subscribe((val) => console.log('Map:', val)); // Output: 2, 4, 6, 8

    // 2. `filter`: Filtering emitted values.
    numbers
      .pipe(filter((x) => x % 2 === 0))
      .subscribe((val) => console.log('Filter:', val)); // Output: 2, 4

    // MAP
    const products$ = from([
      { id: 1, name: 'Laptop', price: 1000 },
      { id: 2, name: 'Phone', price: 500 },
      { id: 3, name: 'Tablet', price: 800 },
    ]);

    products$
      .pipe(map((product) => product.name))
      .subscribe((productName) => console.log('Product Name:', productName));

    products$
      .pipe(
        filter((product) => product.price > 600),
        map((product) => product.name)
      )
      .subscribe((expensiveProduct) =>
        console.log('Expensive Product:', expensiveProduct)
      );

    //mergeMap: Handling dependent API calls, where multiple results are needed simultaneously.
    //You have a list of user IDs and for each ID, you want to fetch the user's details from a server.

    const userIds$ = of(1, 2, 3);

    userIds$
      .pipe(
        mergeMap((id) =>
          fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(
            (response) => response.json()
          )
        )
      )
      .subscribe((user) => console.log('User Details:', user));

    // Output: {id: 1, name: "Leanne Graham", ...}, {id: 2, name: "Ervin Howell", ...}, ...

    const searchInput = document.getElementById('search') as HTMLInputElement; // Assume there's an input field with id 'search'

    fromEvent(searchInput, 'input')
      .pipe(
        debounceTime(500), // Wait for 500ms pause in typing
        map((event: Event) => (event.target as HTMLInputElement).value),
        switchMap((searchTerm) =>
          fetch(`https://dummyjson.com/recipes/search?q={searchTerm}`).then(
            (res) => res.json()
          )
        )
      )
      .subscribe((results) => console.log('Search Results:', results));

    const categories$ = from(
      fetch('https://dummyapi.online/api/movies').then((res) => res.json())
    );
    const products$$ = from(
      fetch('https://dummyapi.online/api/products').then((res) => res.json())
    );

    concat(categories$, products$$).subscribe((data) => {
      console.log('Data:', data);
      // Categories are fetched first, then products
    });

    const submitButton = document.getElementById('submit');

    fromEvent(submitButton, 'click')
      .pipe(
        debounceTime(2000) // Prevent multiple form submissions within 2 seconds
      )
      .subscribe(() => {
        console.log('Form Submitted!');
        // Perform form submission or some other action
      });
  }

  //
}
