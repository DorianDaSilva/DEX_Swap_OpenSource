## Overview

Front end/Back end codebase for DEX Swap

Includes:

* Functional Swap function
* JS logic
* Price view and quote view UI
* CSS

Ready to deploy!

### Bug Fix

This code wasn't deployed live for public use due to an unresolved error when fetching and importing the logoURI and Token symbol from the price view into the quote view to finalize the trade.

You can realize the trade succesfully and safely but users won't see the missing data when finalizing the trade, therefore, it is recommended to fix the issue prior to deploying it for production.

### Wallet

This build uses the previous version of `Wallet Connect` and requires upgrading the wallet config in `app.tsx` and readjust the parameters and imports accordingly throughout the code or use the web3 wallet provider of your choice


### Launch

Run `yarn install` to download dependencies!

Enjoy!
