# Farcaster Snap API

this api powers [Farcaster snap](https://limone-eth.github.io/farcaster-snap-site), a MetaMask Snap that integrates with the Farcaster social graph to tell you if the address you're sending the money is part of your Farcaster circle.

this api does one simple thing: registers user on a redis db right after having installed the snap, and then authenticates api requests coming from the snap allowing only registered users to call it.

## how to run

1. install packages `bun install`
2. setup local environment `cp .env.template .env` and populate it accordingly
3. start the process with `bun start:ts`

### redis setup

quickly spin-up a redis instance on [Upstash](https://upstash.com/docs/redis/overall/getstarted) and then get your connection string in the local environment.

on redis we just save a key-value pair per address for authentication purposes:
- key: address
- value: 1

### airstack api key

create a profile on [airstack.xyz](https://airstack.xyz) and then get your api keys [here](https://app.airstack.xyz/profile-settings/api-keys).

### deploy on railway
railway supports easy [github deployments](https://docs.railway.app/guides/github-autodeploys), so once you have an account there, go to your dashboard and create a new service linked to whatever repository are you using for your codebase. 

at each push, railway will re-deploy your service.

__don't forget to add env variables in your service__