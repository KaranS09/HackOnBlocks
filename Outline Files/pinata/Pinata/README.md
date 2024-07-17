This is a simple implementation of the mechanism of transfer and fetching of files to and from the ipfs network using pinata's api.

We will use this to store json files of user profiles and the returned cid will be mapped with the wallet address of the user in a smart contract.

When wallet is connected initially, if mapping exists, just display profile, else, prompt profile creation.
