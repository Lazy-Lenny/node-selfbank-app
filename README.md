# node-selfbank-app
Simple banking system website

# Pages

## My banks

On this page you will be able to manage your banks (create, edit, delete, etc.)\
You can also upload and download bank as .bsaf file (Bank Scheme Asociated File)

## Calculator

On this page you will be able to calculate the mortgage depending on your needs and the conditions of the bank

# Tools

## Search bar

With search bar you can search for specific bank among other banks (search is not case sensetive!)

## Sorting

You can also sort all your banks vy interest rate, down payment, max loan, loan term.

# API

This app uses server-implemented REST api

## Api scheme

THIS SCHEME USES ONLY GET REQUESTS. TO REDACT DELETE AND PUT DATA YOU NEED TO BE AUTHORIZED/LOGINED

Default contentType is application/json

### Banks

/banks - returns ALL banks\
/banks/id/:bankId - return bank by its ID\
/banks/name/:bankName - returns bank by its NAME\
/banks/userid/:userId - returns ALL banks which belongs to user with USER ID\

### Users

/users - retruns ALL users with ALL belonging banks\
/users/id/:userId - returns user with ALL belonging banks by USER ID\
/users/name/:userName - returns user with ALL belonging banks by USER NAME\
