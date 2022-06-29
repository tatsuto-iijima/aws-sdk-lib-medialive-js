# @tatsuto-iijima/aws-sdk-lib-medialive

## Description

AWS SDK Library for JavaScript MediaLive.

## Installing

To install the this package, simply type add or install @tatsuto-iijima/aws-sdk-lib-medialive
using your favorite package manager:

- `npm install @tatsuto-iijima/aws-sdk-lib-medialive`

## Getting Started

### Import

```js
// ES5 example
const { ChannelList } = require("@tatsuto-iijima/aws-sdk-lib-medialive");
```

```ts
// ES6+ example
import { ChannelList } from "@tatsuto-iijima/aws-sdk-lib-medialive";
```

### Usage

```js
const { MediaLiveClient } = require("@aws-sdk/client-medialive");
const { ChannelList } = require("@tatsuto-iijima/aws-sdk-lib-medialive");

const client = new MediaLiveClient({ region: "REGION" });

const channelList = new ChannelList({
  client: client,
});

(async() => {
  const returnedLoad = await channelList.load();

  for (const channel of channelList) {
    if (!channel.ScheduleActionList) continue;
    await channel.ScheduleActionList.load();
    const returnedFilter = channel.ScheduleActionList.filter((scheduleAction) => {
      if (scheduleAction.ScheduleActionSettings?.InputSwitchSettings) {
        return true;
      } else {
        return false;
      }
    });
    if (returnedFilter.length > 0) {
      console.log('Channel ID: ' + channel.Id);
      console.log(returnedFilter);
    }
  }
  
})();
```

## License

This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE for more information.