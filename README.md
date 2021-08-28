# Fetch Rewards Coding Exercise

## Author
-----
General Info:
- **Name:** Ahmed Shahrour
- **University**: Dominican University of California
- **Major**: Applied Computer Science
- **[Resume](https://drive.google.com/file/d/1NG9PCcjNhPRQPeXoublJSnFA-nrQl5HB/view?usp=sharing)**

Contact Info:
- **[Email](as.ahmed.shahrour@gmail.com)**
- **[LinkedIn](https://www.linkedin.com/in/ahmed-shahrour/)**

## Description
-----
I was given the task to create a simple server with routes that allowed a user to spend points and check their balance. This is putting in mind the application will be used by the accounting team as well. More details on the task can be found [here](https://fetch-hiring.s3.us-east-1.amazonaws.com/points.pdf).

There are two rules for determining what points to "spend" first:
- The oldest points to be spent first
- No payer's points can go negative.

### Implementation:
----
The spend route is the most important aspect of logic for the requirements above. A cleaner version of the transactions will be created that provides how much of each positive transaction has been left over after being consumed, and the transactions that have been used to consume the positive transaction will be flagged as consumed. The process then continues for the rest of the positive transactions. Then we traverse through the list of clean transactions to consume them from the points provided to spend until we spend it all. 

### Assumptions:
----
- Database is specifically referencing 1 user (no user_id foreign key implementation)
- Each payer name is unique. (no payer_id foreign key implementation)


## Tech Stack
-----


- Language: **Javascript**
- Environment: **NodeJS**
- Framework: **Express**
- Database: **PostgreSQL**
- ORM: **Sequelize**

## Local Machine Requirements
-----


- Install [NodeJS](https://nodejs.org/en/download/)
- Install [PostgreSQL](https://www.postgresql.org/download/)
- Install [Yarn](https://classic.yarnpkg.com/en/docs/install)

## Getting Started
-----

### Development Server:

```bash
yarn run dev
```

### Test Server:

```bash
yarn run test
```

## Routes
-----
There are four routes created. The `/transactions ` routes are used for testing and confirmation. The `/balance` route is used to 

### **`GET /transactions/`**
----
Lists all transactions
#### **Parameters**
----
None
#### **Response - 200**
----
returns an array of objects, each object is a transaction. A transaction holds three properties: payer, points, and timestamp.
```JSON
// Response 200 Example
[
  {
    "payer": "DANNON",
    "points": 300,
    "timestamp": "2020-10-31T10:00:00Z",
  },
  {
    "payer": "DANNON",
    "points": -1000,
    "timestamp": "2020-11-02T14:00:00Z"
  },
]
```


### **`POST /transactions/`**
----
Creates a new transaction
#### **Parameters**
----
- `payer`: String
- `points`: Integer
```JSON
// Parameters Example
{
  "payer": "DANNON",
  "points": 1000
}
```
#### **Response - 200**
----
None

### **`GET /balance/`**
----
Provides the balance of each payer
#### **Parameters**
----
None
#### **Response**
----
Returns an object with a balance that is greater than or equal to zero for each payer. If all are added, this will be the the user's total balance available.

```JSON
// Response 200 Example
{
  "DANNON": 1000,
  "UNILEVER": 0,
  "MILLER COORS": 5300
}
```
### **`POST /spend/`**
----
Consumes points from balance transactions based on repo description.
#### **Parameters**
----
- `points`: Positive Integer
```JSON
// Parameters example
{
  "points": 5000
}
```
#### **Response**
----
Returns an array of objects, each object represents a transaction consumption based on the rules in the repo description.
```JSON
// Response 200 Example
[
   {
    "payer": "DANNON",
    "points": -100
    },
    {
      "payer": "UNILEVER",
      "points": -200
    },
    {
      "payer": "MILLER COORS",
      "points": -4700
    }
]
```

#### **Error - 405**
----
This will be returned if the request parameter is larger than the user's balance. The points required will be returned

```JSON
// Spend parameter: 100
// Balance: 50
{
  "message": "More points required.",
  "data":  50
}
```


## Edge Cases
-----

### Spending with no historical transactions
----
We ought to make sure that the user cannot spend when there are no historical transactions. The user can only add a positive transaction if for their first transaction and cannot spend
### Spending > Balance
----
We ought to make sure the balance is equal or greater than spending. If not then we reject the request (without creating any new negative transactions) and provide the required amount of points needed to satisfy the spend parameter with an error message.