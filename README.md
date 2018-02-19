# Tincan
Cross Domain Communicator  

[![Tincan](logo.png)](https://github.com/streamrail/tincan)

## CDN

https://sdk.streamrail.com/tincan/tincan.js

## Usage
Init the following code in each frame
### Initialization
```javascript
/* script in frame 1 */
const tincan = new Tincan(frame2Window, 'https://frame1.origin.com', context /* `window` by default */);
function frame1Fn (){
	return 'hello from frame 1';
}

/* script in frame 2 */
const tincan = new Tincan(frame1Window, 'https://frame2.origin.com', context /* `window` by default */);
function frame2Fn (){
	return 'hello from frame 1';
}
```

### Execution

```javascript
/* script in frame 1 */
tincan.talk(
	function(){
		return this.frame2Fn();
	},
	function onSuccess(result){
		console.log(result) // will print 'hello from frame 2'
	}),
	function onError(error){
		console.error(error.message) // will print an error id occured in frame2
	})
);

/* script in frame 2 */
tincan.talk(
	function(){
		return this.frame1Fn();
	},
	function onSuccess(result){
		console.log(result) // will print 'hello from frame 1'
	}),
	function onError(error){
		console.error(error.message) // will print an error id occured in frame1
	})
);
```

### Gotchas
- Both frames have to use the same version of `tincan`.
- For child frames within a `file://`  parent , initialize the child's tincan instance with `'*'` origin


## Build

- `git clone https://github.com/streamrail/tincan.git`
- `npm install`
- `npm run build`

## Test

- `npm run build`
- `npm run test`

