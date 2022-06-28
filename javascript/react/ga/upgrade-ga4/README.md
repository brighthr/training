# Upgrading to GA4

Originally reported by Tia in Data Science, our current set up for logging events into GA (using 'Universal Analytics' or UA for short) will no longer work after 1st July 2023. As a result we need to move over to logging events using the new standard: GA4.

Tia has asked that we implement this upgrade by 1st July 2022, to allow for a full year of data being logged in both platforms before the old UA platform is turned off, and to allow us to have year-on-year data when the old service is terminated.

To avoid the complexity of this upgrade among all of our apps I've written this guide to help teams upgrade in the smoothest way possible; I will be using the upgrade in BrightrHR WebApp to supplement this guide.

## Step 1: Install `react-ga4` package

> `npm i react-ga4`

## Step 2 (if applicable): Update your apps Content Security Policy

A Content Security Policy (CSP) is a way to specify which domains the application is allowed to access externally and by what means. It is structured by specifying the type of access, and than which domains are allowed. For example:

> `Content-Security-Policy: script-src 'self' data: static.cloudflareinsights.com *.google-analytics.com`

This policy is saying that all 'scripts' (Javascript files) have to be either self hosted (i.e. *our* files) OR come from `static.cloudflareinsights.com` OR from any subdomain of `google-analytics.com`.

GA4 doesn't log to GA through the same domain as our original GA implementation (`*.google-analytics.com`), therefore we need to include a new domain in our CSP: `*.googletagmanager.com` so when we try to log the new events using GA4 the script doesn't get blocked by the security policy.

Searching for `Content-Security-Policy` in your app should tell you if you have one, and where it is. If you do have one, you need to include `*.googletagmanager.com` after `*.google-analytics.com` in any relevant sections. If you are unsure about this step, either reach out to myself or Sean for more guidance.

## Step 3: Initialise GA4 with new Measurement ID

Your team should have received an email from Tia originally scoping this piece of work; in that email you should find a Measurement ID. This is different from the Tracking ID we were originally using for UA logging. Get that ID and store it in your App with your other credentials. Either in a config file/environment variable.

Once you have your measurement ID available in the App you need to initalise GA4 with the new Measurement ID. If you were already logging to GA using `react-ga`, you can combine the initialisations together. Otherwise you can just initialise GA4 on its own.

```js
// In your app setup code
import ReactGA from 'react-ga';
import ReactGA4 from 'react-ga4';

// Get these from wherever your app stores them
const TRACKING_ID = '';
const MEASUREMENT_ID = '';

export const initializeGA = () => {
    const options = {};

    // Initialise the original GA tracking
	ReactGA.initialize(TRACKING_ID, options);

    // If we have a measurement ID, also initialise the tracking via GA4
	if (MEASUREMENT_ID) {
		ReactGA4.initialize(MEASUREMENT_ID, options);
	}
};

initializeGA();
```

## Step 4: Start tracking events

In the Webapp we have a shared util function which logs events; accessible via `import event from 'bright-utils/ga';`, it *originally* looked like this:

```js
// app/react/utils/ga/index.js

export const trackEvent = ({
	category,
	action,
	label,
	nonInteraction = false,
	cb = () => {}
}) => {
	ReactGA.event({
		category,
		action,
		...(label && { label }),
		...(nonInteraction && { nonInteraction })
	});
    cb();
};
```

This would take a single object argument with various options around the event (category, action etc...) and then log it to GA via `ReactGA.event()`. However, the new events which we want to log in GA4 need to be structured slightly differently and we don't want to have to make separate calls to log to GA in the 2 different formats. Here is the breakdown of the differences between the 2 event types:

Original UA: Every event has `category` and `action`, `label` and `nonInteraction` are optional.
New GA4: Every event has a top level `category` with an options object, with a property `action` which consists of the original action and the optional `label` if it has been defined. The `nonInteraction` is still optional.

In an ideal world we would use this exact same util function we've been using throughout the app to *also* log to GA4 in the new format, meaning we dont have to change any of our existing calls or app logic.

Here is the modified `trackEvent` function in the Webapp which now also logs the new event format to GA4 if its initialised.

```js
export const trackEvent = ({
	category,
	action,
	label,
	nonInteraction = false,
	cb = () => {}
}) => {
	// Log the original event to UA
    ReactGA.event({
		category,
		action,
		...(label && { label }),
		...(nonInteraction && { nonInteraction })
	});

    // If we've initialised GA4 (the measurement ID was correct), then also log to GA4 using the new format of events
    if (ReactGA4.isInitialized) {
    	const ga4Params = {};
	const actionString = `${action}${label ? ` ${label}` : ''}`;

	// Chops an action string into multiple numbered action properties of 100 characters each
	// This is because GA4 requires all event parameters to be <=100 characters in length

	// e.g { action: 'first 100 characters', action2: 'next 100 characters' }
	const getStrSection = i =>
		actionString.substring((i - 1) * 100, i * 100);

	for (let i = 1; i <= Math.ceil(actionString.length / 100); i++) {
		ga4Params[`action${i === 1 ? '' : i}`] = getStrSection(i);
	}

	if (nonInteraction) {
		ga4Params.nonInteraction = true;
	}

	ReactGA4.event(category, ga4Params);
    }
    cb();
};
```

After this step is completed, all of the original events that were being logged through the shared `trackEvent` util function will now *also* log to GA4 🎉🎉. Here is a screenshot of what that looks like when using the Chrome plugin [Google Analyics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna). `analytics.js` is the old UA logging, `js?id=<xxxx>` is the new GA4 logging where `id` should match up to the Measurement ID you got at the beginning.

![](https://user-images.githubusercontent.com/6953549/172587968-b8ea442f-8ed3-472b-927c-2710bcbab4e7.png)

## Step 5 (If applicable): Add an ESlint rule to people using `react-ga` or `react-ga4` directly

Once you've made the above changes its imperative that **ALL** of the times in your app you are logging to GA you use the shared util, rather than the original `react-ga` import: `ReactGA.event({})`. This is because if all of the GA logging is done through the shared util, all of the events will be logged to both services with no additional work needed for the actual calls themselves. This may require some manual refactoring to go through your code to find all of the times events are being logged and changing their imports to use the shared util instead. There is an easy way to find all of those instances and also stop any future developers making the same mistake.

You can add an eslint rule in your eslint config to address this and modify the message to be whatever makes sense for the individual app: 

```js
"no-restricted-imports": ["error", {
        "name": "react-ga",
        "message": "Please use the shared GA util to log an event to GA; it logs the event in multiple places. `import event from 'bright-utils/ga';`"
    }, {
        "name": "react-ga4",
        "message": "Please use the shared GA util to log an event to GA; it logs the event in multiple places. `import event from 'bright-utils/ga';`"
    }
]
```

This is what that looks like in VS code when you try to import the module:

![](https://user-images.githubusercontent.com/6953549/172587892-b83ba180-f00b-46a0-9360-b819a256294c.png)

You will need to import `react-ga` and `react-ga4` into the util functions themselves; you can get around that with a simple eslint ignore:

```js
// eslint-disable-next-line no-restricted-imports
import ReactGA from 'react-ga';
// eslint-disable-next-line no-restricted-imports
import ReactGA4 from 'react-ga4';
```

If you then run a lint against your project you should get a clear and concise output in your terminal with all of the files that need to be changed.

That should be everything you need to implement the GA4 upgrade in your App. If anything in this guide doesn't make sense, is outdated, or needs clarification you can open a PR in the training repository or message me directly on Slack or Teams.
