import {
  MediaLiveClient,
  CdiInputSpecification,
  ChannelClass,
  OutputDestination,
  ChannelEgressEndpoint,
  InputAttachment,
  InputSpecification,
  LogLevel,
  MaintenanceStatus,
  ChannelState,
  VpcOutputSettingsDescription,
  ChannelSummary,
} from "@aws-sdk/client-medialive";
import { ScheduleActionList } from "./ScheduleActionList";

export class Channel {
  private _client: MediaLiveClient;
  readonly Arn: string | undefined;
  readonly CdiInputSpecification: CdiInputSpecification | undefined;
  readonly ChannelClass: ChannelClass | string | undefined;
  readonly Destinations: OutputDestination[] | undefined;
  readonly EgressEndpoints: ChannelEgressEndpoint[] | undefined;
  readonly Id: string | undefined;
  readonly InputAttachments: InputAttachment[] | undefined;
  readonly InputSpecification: InputSpecification | undefined;
  readonly LogLevel: LogLevel | string | undefined;
  readonly Maintenance: MaintenanceStatus | undefined;
  readonly Name: string | undefined;
  readonly PipelinesRunningCount: number | undefined;
  readonly RoleArn: string | undefined;
  readonly State: ChannelState | string | undefined;
  readonly Tags: Record<string, string> | undefined;
  readonly Vpc: VpcOutputSettingsDescription | undefined;
  readonly ScheduleActionList: ScheduleActionList | undefined;
  
  constructor(params: {
    client: MediaLiveClient;
    channelSummary: ChannelSummary;
  }) {
    this._client = params.client;
    this.Arn = params.channelSummary.Arn;
    this.CdiInputSpecification = params.channelSummary.CdiInputSpecification;
    this.ChannelClass = params.channelSummary.ChannelClass;
    this.Destinations = params.channelSummary.Destinations;
    this.EgressEndpoints = params.channelSummary.EgressEndpoints;
    this.Id = params.channelSummary.Id;
    this.InputAttachments = params.channelSummary.InputAttachments;
    this.InputSpecification = params.channelSummary.InputSpecification;
    this.LogLevel = params.channelSummary.LogLevel;
    this.Maintenance = params.channelSummary.Maintenance;
    this.Name = params.channelSummary.Name;
    this.PipelinesRunningCount = params.channelSummary.PipelinesRunningCount;
    this.RoleArn = params.channelSummary.RoleArn;
    this.State = params.channelSummary.State;
    this.Tags = params.channelSummary.Tags;
    this.Vpc = params.channelSummary.Vpc;
    this.ScheduleActionList = new ScheduleActionList({
      client: this._client,
      Id: this.Id,
    });
  }

}