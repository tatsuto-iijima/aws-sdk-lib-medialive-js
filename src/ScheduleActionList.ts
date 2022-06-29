import {
  MediaLiveClient,
  ScheduleAction,
  DescribeScheduleCommand,
  DescribeScheduleCommandInput,
} from "@aws-sdk/client-medialive";

export class ScheduleActionList implements IterableIterator<ScheduleAction> {

  private _client: MediaLiveClient;

  private _channelId: string | undefined;

  private _pointer = 0;

  private _scheduleActions: ScheduleAction[] = [];

  constructor(params: {
    client: MediaLiveClient;
    Id: string | undefined;
  }) {
    this._client = params.client;
    this._channelId = params.Id;
  }
  
  async load() {
    this._scheduleActions = [];
    let response = await this.describeSchedule({
      ChannelId: this._channelId,
    });
    if (response.ScheduleActions) this._scheduleActions.push(...response.ScheduleActions);
    while (response.NextToken) {
      response = await this.describeSchedule({
        ChannelId: this._channelId,
        NextToken: response.NextToken,
      });
      if (response.ScheduleActions) this._scheduleActions.push(...response.ScheduleActions);
    }
    return this._scheduleActions;
  }

  async describeSchedule(input: DescribeScheduleCommandInput) {
    const command = new DescribeScheduleCommand(input);
    try {
      const response = await this._client.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  filter(callback: (scheduleAction: ScheduleAction) => boolean) {
    return this._scheduleActions.filter(scheduleAction => callback(scheduleAction));
  }

  next(): IteratorResult<ScheduleAction> {
    if (this._pointer < this._scheduleActions.length) {
      return {
        done: false,
        value: this._scheduleActions[this._pointer++]
      }
    } else {
      return {
        done: true,
        value: null
      }
    }
  }
    
  [Symbol.iterator](): IterableIterator<ScheduleAction> {
    return this;
  }
    
}