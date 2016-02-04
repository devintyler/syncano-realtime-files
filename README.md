# Real Time File Manager

Below are instructions on how to build the Real Time File Manager. If you haven't signed up for Syncano already, please [click here](https://dashboard.syncano.io/#/signup).

## Instructions

- Create a new [`instance`](http://docs.syncano.io/docs/getting-started-with-syncano#adding-an-instance)
- Create a `Class` with the following [schema]()
```
{
	"name": string,
	"file": file
}
```
- Create a `Channel` with "Other" permissions set to **`subscribe`**
- Clone/Download [this repo](https://github.com/devintyler/syncano-realtime-files)
- Follow the comment instructions in `js/app.js`

### [Docs to help](http://docs.syncano.io/docs/realtime-communication)