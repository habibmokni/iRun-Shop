# iRun-Shop

https://github.com/habibmokni/Click-And-Collect (Version 2.0)

This release bring new design to whole web app along with new improvements and a full featured ecommerce website. 

# What is iRun?

i-Run is an ecommerce website powered by Angular click and collect feature built by Habib Mokni. It covers all aspects of click and collect feature. clickNCollect feature is integrated in checkout, product page and store selector component of i-Run.

# Angular Google Maps component

This component provides a Google Maps Angular component that implements the
[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial).
File any bugs against the [angular/components repo](https://github.com/angular/components/issues).

## Installation

Just copy the code in your machine and run 'npm install' to install all the required modules and dependencies. You will also need Google Maps Api key for the full functioning of click and collect.
After obtaining the Google Maps Api key just copy paste your api key in below code placed in index.html

```html
<!-- index.html -->
<!doctype html>
<head>
  ...
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
</head>
```

**Note:**
Don't forget to enable google places api in google cloud console.

## Dependencies 

- [Angular Material](https://material.angular.io/guide/getting-started)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API).
- [FlexLayout](https://github.com/angular/flex-layout)
- [AngularFire](https://github.com/angular/angularfire)
- [GoogleMaps](https://www.npmjs.com/package/@angular/google-maps)


## Components

- [`Home`](./home) displays the online products
- [`Information`](./information)  provides information about click and collect 
- [`Checkout`](./checkout)  is responsible to provide clickAndCollect and delivery option to the user
- [`Product Page`](./home/productPage) displays information about product, it's images, variants, sizes, avaiability of the product in physical stores(enabling clickNCollect feature productAvailability)
- [`Shopping Cart`](./shoppingCart) displays cart products
- [`Store Selector`](./storeSelector) helps user to select a store for future purchases
- [`Add products`](./addProducts) helps to add products to db (for admin use only)
- [`Billing Details`](./billingDetails) asks user to enter billing details
- [`Order Success`](./orderSuccess) displays a success message on order creation
- [`Payment Method`](./paymentMethods)  asks user to select a payment method

## Services

- [`ProductService`](./shared/services/product.service.ts) contains products related functions and cart related functions
- [`SnackBarService`](./shared/services/snackbar.service.ts) is used to display snack messages on success, error or information.
- [`StoreService`](./shared/services/store.service.ts) contains store related functions
- [`UserService`](./shared/services/user.service.ts) contains user related functions


