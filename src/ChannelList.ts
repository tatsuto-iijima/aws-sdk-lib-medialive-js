import {
  ListChannelsCommandInput,
  ListChannelsCommand,
  MediaLiveClient,
} from "@aws-sdk/client-medialive";
import { Channel } from "./Channel";

export class ChannelList implements IterableIterator<Channel> {

  private _client: MediaLiveClient;

  private _pointer = 0;

  private _channels: Channel[] = [];

  constructor(params: {
    client: MediaLiveClient;
  }) {
    this._client = params.client;
  }

  async load() {
    this._channels = [];
    let response = await this.listChannels({});
    if (response.Channels) {
      for (const channelSummary of response.Channels) {
        this._channels.push(new Channel({
          client: this._client,
          channelSummary: channelSummary,
        }));
      }
    }
    while (response.NextToken) {
      response = await this.listChannels({ NextToken: response.NextToken });
      if (response.Channels) {
        for (const channelSummary of response.Channels) {
          this._channels.push(new Channel({
            client: this._client,
            channelSummary: channelSummary,
          }));
        }
      }
    }
    return this._channels;
  }

  async listChannels(input: ListChannelsCommandInput) {
    const command = new ListChannelsCommand(input);
    try {
      const response = await this._client.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  filter(callback: (channel: Channel) => boolean) {
    const filteredChannels = [];
    for (const channel of this._channels) {
      if (callback(channel)) filteredChannels.push(channel);
    }
    return filteredChannels;
  }

  next(): IteratorResult<Channel> {
    if (this._pointer < this._channels.length) {
      return {
        done: false,
        value: this._channels[this._pointer++]
      }
    } else {
      return {
        done: true,
        value: null
      }
    }
  }
    
  [Symbol.iterator](): IterableIterator<Channel> {
    return this;
  }
    
}