# vending-machine-rest v0.0.0



- [Auth](#auth)
	- [Authenticate](#authenticate)
	
- [Order](#order)
	- [Retrieve order](#retrieve-order)
	- [Retrieve orders](#retrieve-orders)
	
- [Product](#product)
	- [Create product](#create-product)
	- [Delete product](#delete-product)
	- [Retrieve product](#retrieve-product)
	- [Retrieve products](#retrieve-products)
	- [Update product](#update-product)
	
- [User](#user)
	- [Create user](#create-user)
	- [Delete user](#delete-user)
	- [Retrieve current user](#retrieve-current-user)
	- [Retrieve user](#retrieve-user)
	- [Retrieve users](#retrieve-users)
	- [Update user](#update-user)
	
- [Vending](#vending)
	- [Buy product](#buy-product)
	- [Deposit coins](#deposit-coins)
	- [Reset coins](#reset-coins)
	


# Auth

## Authenticate



	POST /auth

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| Authorization			| String			|  <p>Basic authorization with email and password.</p>							|

# Order

## Retrieve order



	GET /orders/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|

## Retrieve orders



	GET /orders


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String			| **optional** <p>Order of returned items (comma-separated string).</p>							|

# Product

## Create product



	POST /products


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|
| amount			| Number			|  <p>Product's amount.</p>							|
| cost			| Number			|  <p>Product's cost.</p>							|
| name			| String			|  <p>Product's name.</p>							|
| sellerId			| String			| **optional** <p>Product's seller id.</p>							|

## Delete product



	DELETE /products/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve product



	GET /products/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|

## Retrieve products



	GET /products


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String			| **optional** <p>Order of returned items (comma-separated string).</p>							|

## Update product



	PUT /products/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|
| amount			| Number			|  <p>Product's amount.</p>							|
| cost			| Number			|  <p>Product's cost.</p>							|
| name			| String			|  <p>Product's name.</p>							|

# User

## Create user



	POST /users


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  <p>User's email.</p>							|
| password			| String			|  <p>User's password.</p>							|
| role			| String			|  <p>User's role.</p>							|
| name			| String			| **optional** <p>User's name.</p>							|

## Delete user



	DELETE /users/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|

## Retrieve current user



	GET /users/me


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|

## Retrieve user



	GET /users/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|

## Retrieve users



	GET /users


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String			| **optional** <p>Order of returned items (comma-separated string).</p>							|

## Update user



	PUT /users/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|
| name			| String			|  <p>User's name.</p>							|
| password			| String			|  <p>User's password.</p>							|

# Vending

## Buy product



	POST /vending/buy


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|
| productId			| String			|  <p>Product's id.</p>							|
| amount			| Number			|  <p>Purchase amount.</p>							|

## Deposit coins



	POST /vending/deposit


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|
| amount			| Number			|  <p>Deposit amount.</p>							|

## Reset coins



	POST /vending/reset


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access token.</p>							|


